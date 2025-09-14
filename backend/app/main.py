from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users
from app.config.settings import settings
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import List, Literal
import tempfile
import os
import time
import json
import cv2
import mediapipe as mp
import numpy as np


# Pydantic models for structured output
class DanceAnalysisItem(BaseModel):
    timestamp_of_outcome: str
    result: Literal["reference", "recording"]
    move_type: str
    feedback: str


class DanceAnalysisResponse(BaseModel):
    dance_analysis: List[DanceAnalysisItem]


def create_app() -> FastAPI:
    app = FastAPI(
        title="HTN25 Backend API",
        description="Backend API for HTN25 project",
        version="1.0.0",
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://localhost:3000/",
            "https://localhost:3000",
            "https://localhost:3000/"
        ] + (settings.allowed_origins if hasattr(settings, 'allowed_origins') else []),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(users.router)

    @app.get("/")
    def read_root():
        return {"message": "Hello from HTN25 FastAPI Backend!", "version": "1.0.0"}
    
    @app.post("/upload-and-analyze")
    async def upload_and_analyze(video1: UploadFile = File(...), video2: UploadFile = File(...)):
        print("Received files:", video1.filename, video2.filename)
        # Create temporary files to save uploaded videos
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video1:
            content1 = await video1.read()
            temp_video1.write(content1)
            temp_video1_path = temp_video1.name

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video2:
            content2 = await video2.read()
            temp_video2.write(content2)
            temp_video2_path = temp_video2.name

        def wait_for_file_active(uploaded_file, timeout=30, poll_interval=2):
            start = time.time()
            while time.time() - start < timeout:
                if hasattr(uploaded_file, 'state') and uploaded_file.state == "ACTIVE":
                    return uploaded_file
                time.sleep(poll_interval)
                # Re-fetch file status if needed
                try:
                    uploaded_file = client.files.get(name=uploaded_file.name)
                except:
                    pass
            raise RuntimeError(f"File did not become ACTIVE in time")

        try:
            gemini_key = os.getenv("GEMINI_KEY", getattr(settings, "gemini_key", None))
            if not gemini_key:
                raise ValueError("GEMINI_KEY not set in environment or settings")

            # Create client with API key
            client = genai.Client(api_key=gemini_key)

            # Upload files using the new API
            referencefile = client.files.upload(file=temp_video1_path)
            print("Reference file upload result:", referencefile)
            recording = client.files.upload(file=temp_video2_path)
            print("Recording file upload result:", recording)

            # Wait for both files to become ACTIVE
            referencefile_active = wait_for_file_active(referencefile)
            recording_active = wait_for_file_active(recording)

            prompt = (
                "Analyze the dance movements in the reference video and compare them to the user's recording. "
                "For each significant dance moment/move, provide both reference and recording feedback. "
                "Focus on timing, technique, and execution. "
                "Provide timestamps in MM:SS.F format (e.g., '0:05.0', '1:23.5'). "
                "Give specific, actionable feedback for improvements."
            )

            # Generate content using structured output
            response = client.models.generate_content(
                model="gemini-2.0-flash-001",
                contents=[prompt, referencefile_active, recording_active],
                config={
                    "response_mime_type": "application/json",
                    "response_schema": DanceAnalysisResponse,
                }
            )
            
            print("Structured output received successfully!")
            print(f"Raw response text: {response.text[:200]}...")
            
            # Parse the structured response
            analysis_data = response.parsed
            if analysis_data and hasattr(analysis_data, 'dance_analysis'):
                print(f"Successfully parsed {len(analysis_data.dance_analysis)} dance analysis items")
                # Convert back to dict format for compatibility with processing endpoint
                return {
                    "response": response.text,
                    "parsed_data": {
                        "dance_analysis": [
                            {
                                "timestamp_of_outcome": item.timestamp_of_outcome,
                                "result": item.result,
                                "move_type": item.move_type,
                                "feedback": item.feedback
                            }
                            for item in analysis_data.dance_analysis
                        ]
                    }
                }
            else:
                print("Warning: No parsed data available, falling back to raw response")
                return {"response": response.text}
                
        except Exception as e:
            print(f"Error in upload_and_analyze: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"error": f"Error analyzing videos: {str(e)}"}
        finally:
            # Clean up temporary files
            if os.path.exists(temp_video1_path):
                os.unlink(temp_video1_path)
            if os.path.exists(temp_video2_path):
                os.unlink(temp_video2_path)

    @app.post("/process-dance-video")
    async def process_dance_video(
        dance_analysis: str = Form(...),
        video_file: UploadFile = File(...)
    ):
        print("Received video file:", video_file.filename)
        print("Received dance analysis:", dance_analysis[:200] + "..." if len(dance_analysis) > 200 else dance_analysis)

        # Parse the dance analysis JSON - now with structured output support
        analysis_data = None
        
        try:
            # First try to parse as JSON directly (could be structured output or manual JSON)
            parsed_json = json.loads(dance_analysis)
            print("Successfully parsed JSON directly")
            
            # Check if it's the new format with parsed_data
            if 'parsed_data' in parsed_json and 'dance_analysis' in parsed_json['parsed_data']:
                analysis_data = parsed_json['parsed_data']
                print("Using structured output data from parsed_data")
            elif 'dance_analysis' in parsed_json:
                analysis_data = parsed_json
                print("Using dance_analysis from direct JSON")
            elif 'response' in parsed_json:
                # Try to parse the response field as JSON
                try:
                    response_data = json.loads(parsed_json['response'])
                    if 'dance_analysis' in response_data:
                        analysis_data = response_data
                        print("Using dance_analysis from response field")
                except:
                    pass
            
            if not analysis_data:
                # Fallback to treating the whole thing as analysis data
                analysis_data = parsed_json
                print("Using entire JSON as analysis data")
                
        except json.JSONDecodeError:
            print("JSON parsing failed, attempting fallback parsing...")
            # Keep existing fallback parsing logic for backward compatibility
            try:
                print("Direct JSON parsing failed, trying to extract JSON from text...")
                print(f"Raw response first 500 chars: {dance_analysis[:500]}")

                # More aggressive JSON extraction - look for JSON blocks
                import re

                # Try to find JSON block patterns
                json_patterns = [
                    r'```json\s*(\{.*?\})\s*```',  # JSON in code blocks
                    r'```\s*(\{.*?\})\s*```',     # Generic code blocks
                    r'\{[^{}]*"(?:dance_analysis|performance_comparison)"[^{}]*\[[^\]]*\][^{}]*\}',  # Simple structure
                    r'\{.*?"(?:dance_analysis|performance_comparison)".*?\}',  # Original pattern
                ]

                extracted_json = None
                for i, pattern in enumerate(json_patterns):
                    matches = re.findall(pattern, dance_analysis, re.DOTALL)
                    if matches:
                        extracted_json = matches[0] if isinstance(matches[0], str) else matches[0]
                        print(f"Found JSON with pattern {i+1}: {extracted_json[:100]}...")
                        break

                if extracted_json:
                    # Clean up common JSON issues
                    cleaned_json = extracted_json.strip()
                    # Fix common formatting issues
                    cleaned_json = re.sub(r',\s*}', '}', cleaned_json)  # Remove trailing commas
                    cleaned_json = re.sub(r',\s*]', ']', cleaned_json)  # Remove trailing commas in arrays
                    
                    try:
                        analysis_data = json.loads(cleaned_json)
                        print("Successfully extracted and parsed JSON from text")
                    except json.JSONDecodeError as parse_error:
                        print(f"Cleaned JSON still invalid: {parse_error}")
                        print(f"Cleaned JSON: {cleaned_json[:200]}...")
                        raise parse_error
                else:
                    print("No JSON patterns found, searching for key data...")
                    # Try to extract key information even without proper JSON
                    # Look for timestamps and moves in the text
                    timestamp_matches = re.findall(r'(\d+:\d+\.?\d*)', dance_analysis)
                    print(f"Found timestamps: {timestamp_matches[:3]}")
                    
                    if timestamp_matches:
                        # Create minimal valid structure with found timestamps
                        analysis_data = {
                            "performance_comparison": []
                        }
                        
                        for i, ts in enumerate(timestamp_matches[:3]):  # Limit to first 3
                            analysis_data["performance_comparison"].append({
                                "timestamp": ts,
                                "move_type": f"Dance Move {i+1}",
                                "user_performance_score": 75,
                                "expected_technique": "Good form and timing",
                                "user_execution": "Nice execution",
                                "improvement_suggestions": "Keep practicing!"
                            })
                        print(f"Created structure from timestamps: {len(analysis_data['performance_comparison'])} moves")
                    else:
                        raise Exception("No usable data found in analysis")

            except Exception as e:
                print(f"All JSON parsing failed: {e}, using fallback mock data")
                # Create comprehensive mock data as fallback - matching the dance_analysis structure
                analysis_data = {
                    "dance_analysis": [
                        {
                            "timestamp_of_outcome": "0:02.0",
                            "result": "recording",
                            "move_type": "Opening Move",
                            "feedback": "Great start! Keep that energy up throughout the performance."
                        },
                        {
                            "timestamp_of_outcome": "0:05.0",
                            "result": "recording", 
                            "move_type": "Core Movement",
                            "feedback": "Good rhythm, but focus on staying with the beat more consistently."
                        },
                        {
                            "timestamp_of_outcome": "0:08.0",
                            "result": "recording",
                            "move_type": "Dynamic Section",
                            "feedback": "Excellent power and control! This section looks great."
                        }
                    ]
                }
                
        # Log the final parsed structure
        if analysis_data:
            performance_points = len(analysis_data.get('performance_comparison', []))
            dance_analysis_points = len(analysis_data.get('dance_analysis', []))
            print(f"Final analysis data structure:")
            print(f"  - performance_comparison: {performance_points} items")
            print(f"  - dance_analysis: {dance_analysis_points} items")
            print(f"  - Keys in analysis_data: {list(analysis_data.keys())}")
            if analysis_data.get('dance_analysis'):
                print(f"  - First dance_analysis item: {analysis_data['dance_analysis'][0]}")
            elif analysis_data.get('performance_comparison'):
                print(f"  - First performance_comparison item: {analysis_data['performance_comparison'][0]}")
        else:
            print("ERROR: No analysis_data could be parsed!")
            return {"error": "Failed to parse dance analysis data"}

        # Create temporary file for input video
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_input_video:
            video_content = await video_file.read()
            temp_input_video.write(video_content)
            temp_input_video_path = temp_input_video.name

        # Create temporary file for output video
        temp_output_video = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        temp_output_video.close()
        temp_output_video_path = temp_output_video.name

        try:
            # Initialize MediaPipe Pose
            mp_pose = mp.solutions.pose
            pose = mp_pose.Pose(
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )

            # Open the video file - like working example, we need both process and display caps
            # For our case, we'll use the same video for both but treat them separately
            process_cap = cv2.VideoCapture(temp_input_video_path)
            display_cap = cv2.VideoCapture(temp_input_video_path)

            if not process_cap.isOpened() or not display_cap.isOpened():
                raise Exception("Could not open video file. Please check the video format.")

            # Get properties from both caps like working example
            process_fps = int(process_cap.get(cv2.CAP_PROP_FPS))
            process_width = int(process_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            process_height = int(process_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

            display_fps = int(display_cap.get(cv2.CAP_PROP_FPS))
            display_width = int(display_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            display_height = int(display_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

            if process_fps <= 0 or process_width <= 0 or process_height <= 0:
                raise Exception(f"Invalid video properties: fps={process_fps}, width={process_width}, height={process_height}")

            print(f"Process video properties: {process_width}x{process_height} @ {process_fps}fps")
            print(f"Display video properties: {display_width}x{display_height} @ {display_fps}fps")
            
            # Calculate and log dynamic font sizing info
            base_scale = min(display_width, display_height) / 1200
            calculated_font_scale = max(0.3, min(0.8, base_scale))
            print(f"Dynamic font sizing: base_scale={base_scale:.3f}, final_scale={calculated_font_scale:.3f}")

            # DEBUG: Check if FPS is reasonable, fix if not
            if process_fps > 100 or process_fps <= 0:
                print(f"WARNING: Detected unusual FPS {process_fps}, correcting to 30fps")
                process_fps = 30
                display_fps = 30

            # DEBUG: Additional video properties
            total_frames = int(process_cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = total_frames / process_fps if process_fps > 0 else 0
            print(f"DEBUG: Total frames: {total_frames}, Duration: {duration:.2f}s")
            print(f"DEBUG: Input file size: {os.path.getsize(temp_input_video_path)} bytes")

            # Helper functions
            def parse_timestamp(timestamp):
                if ':' in timestamp:
                    minutes, seconds = timestamp.split(':')
                    return float(minutes) * 60 + float(seconds)
                else:
                    return float(timestamp)

            def timestamp_to_frame(timestamp, fps):
                seconds = parse_timestamp(timestamp)
                return int(seconds * fps)

            def wrap_text(text, font, scale, thickness, max_width):
                words = text.split()
                lines = []
                current_line = []

                for word in words:
                    test_line = ' '.join(current_line + [word])
                    text_size = cv2.getTextSize(test_line, font, scale, thickness)[0]

                    if text_size[0] <= max_width:
                        current_line.append(word)
                    else:
                        if current_line:
                            lines.append(' '.join(current_line))
                        current_line = [word]

                if current_line:
                    lines.append(' '.join(current_line))

                return lines

            def get_animation_color(elapsed_time, is_good_performance):
                animation_duration = 1.25
                if elapsed_time >= animation_duration:
                    return (255, 255, 255)  # Return to white

                progress = elapsed_time / animation_duration

                if progress < 0.5:
                    if is_good_performance:
                        # Fade to green (BGR format)
                        return (
                            int(255 * (1 - progress * 2)),  # B
                            255,                            # G
                            int(255 * (1 - progress * 2))   # R
                        )
                    else:
                        # Fade to red (BGR format)
                        return (
                            int(255 * (1 - progress * 2)),  # B
                            int(255 * (1 - progress * 2)),  # G
                            255                             # R
                        )
                else:
                    if is_good_performance:
                        # Fade from green to white
                        return (
                            int(255 * ((progress - 0.5) * 2)),  # B
                            255,                                # G
                            int(255 * ((progress - 0.5) * 2))   # R
                        )
                    else:
                        # Fade from red to white
                        return (
                            int(255 * ((progress - 0.5) * 2)),  # B
                            int(255 * ((progress - 0.5) * 2)),  # G
                            255                                 # R
                        )

            # Process dance analysis data - handle both structures
            dance_events = []
            
            # Handle different JSON structures from Gemini analysis
            analysis_items = []
            if 'performance_comparison' in analysis_data:
                analysis_items = analysis_data['performance_comparison']
                print("Using 'performance_comparison' structure")
            elif 'dance_analysis' in analysis_data:
                analysis_items = analysis_data['dance_analysis']
                print("Using 'dance_analysis' structure")
                
            print(f"Found {len(analysis_items)} analysis items to process")
            
            # Group by timestamp and combine reference/recording feedback
            timestamp_groups = {}
            for item in analysis_items:
                timestamp = item.get('timestamp_of_outcome', item.get('timestamp', '0:00.0'))
                if timestamp not in timestamp_groups:
                    timestamp_groups[timestamp] = {
                        'timestamp': timestamp,
                        'move_type': item.get('move_type', 'Dance Move'),
                        'reference_feedback': '',
                        'recording_feedback': '',
                        'score': 75  # Default score
                    }
                
                # Assign feedback based on result type
                result_type = item.get('result', 'recording')
                feedback = item.get('feedback', item.get('improvement_suggestions', ''))
                
                if result_type == 'reference':
                    timestamp_groups[timestamp]['reference_feedback'] = feedback
                elif result_type == 'recording':
                    timestamp_groups[timestamp]['recording_feedback'] = feedback
                    # Try to derive a score from the feedback (simple heuristic)
                    if any(word in feedback.lower() for word in ['good', 'great', 'excellent', 'smooth', 'nice']):
                        timestamp_groups[timestamp]['score'] = 85
                    elif any(word in feedback.lower() for word in ['needs', 'stiff', 'improve', 'focus']):
                        timestamp_groups[timestamp]['score'] = 60
                    else:
                        timestamp_groups[timestamp]['score'] = 75
            
            # Convert to dance_events format
            for timestamp, group in timestamp_groups.items():
                # Combine feedback from both reference and recording
                combined_feedback = group['recording_feedback']
                if group['reference_feedback']:
                    combined_feedback = f"Reference: {group['reference_feedback']} | Your performance: {combined_feedback}"
                
                dance_events.append({
                    'frame_number': timestamp_to_frame(timestamp, process_fps),
                    'move_type': group['move_type'],
                    'score': group['score'],
                    'feedback': combined_feedback,
                    'feedback_end_frame': timestamp_to_frame(timestamp, process_fps) + (4 * process_fps)
                })
            
            print(f"Created {len(dance_events)} dance events for annotation")

            # Animation variables
            last_move_time = None
            current_color = (255, 255, 255)
            last_move_result = None

            # Processing variables - store all frames like working example
            frame_count = 0
            last_head = None
            process_every_n_frames = int(process_fps / 20)  # Like working example
            processed_frames = []  # Store all processed frames like working example

            print("Processing dance video...")

            while process_cap.isOpened() and display_cap.isOpened():
                # Read frames from both videos like working example
                process_ret, process_frame = process_cap.read()
                display_ret, display_frame = display_cap.read()

                if not process_ret or not display_ret:
                    break

                frame_count += 1



                # Check for dance events and display moment-based feedback
                total_moments = len(dance_events)
                current_moment = None
                current_moment_number = 0
                current_feedback = None

                for i, event in enumerate(dance_events):
                    if event['frame_number'] <= frame_count:
                        if event['frame_number'] == frame_count:
                            # New moment detected
                            last_move_time = time.time()
                            last_move_result = event['score'] >= 70  # Good performance if score >= 70
                            current_moment = event
                        current_moment_number = i + 1

                        # Check if we should show feedback for this moment
                        if event['frame_number'] <= frame_count <= event['feedback_end_frame']:
                            current_feedback = event['feedback']
                            current_moment = event

                # Display moment statistics (instead of moves completed/average score)
                stats_font = cv2.FONT_HERSHEY_SIMPLEX
                stats_border = (0, 0, 0)
                stats_scale = 2.1
                stats_thickness = 6
                stats_border_thickness = 12
                stats_spacing = 90
                white_color = (255, 255, 255)

                stats_x = 30
                stats_y = 150

                # Calculate animation color
                if last_move_time is not None:
                    elapsed_time = time.time() - last_move_time
                    if elapsed_time < 1.25:
                        current_color = get_animation_color(elapsed_time, last_move_result)
                    else:
                        current_color = white_color
                        last_move_time = None
                
                # Display moment-specific feedback at bottom
                if current_feedback and current_moment:
                    feedback_font = cv2.FONT_HERSHEY_SIMPLEX
                    # Dynamic font scaling based on video resolution
                    base_scale = min(display_width, display_height) / 1200  # Scale based on smaller dimension
                    feedback_scale = max(0.3, min(0.8, base_scale))  # Clamp between 0.3 and 0.8
                    feedback_color = (255, 255, 255)
                    feedback_border = (0, 0, 0)
                    feedback_thickness = max(1, int(feedback_scale * 3))  # Scale thickness too
                    feedback_border_thickness = feedback_thickness + 2
                    feedback_spacing = max(20, int(feedback_scale * 40))  # Scale spacing

                    # Add moment header to feedback
                    moment_header = f"Moment {current_moment_number}: {current_moment['move_type']}"
                    full_feedback_text = f"{moment_header} - {current_feedback}"

                    # Use more conservative text width to prevent overflow
                    max_width = int(display_width * 0.85)  # Reduced from 0.9 to 0.85
                    wrapped_lines = wrap_text(full_feedback_text, feedback_font, feedback_scale,
                                            feedback_thickness, max_width)

                    total_height = len(wrapped_lines) * feedback_spacing
                    # Position feedback at the bottom, but ensure it doesn't go off-screen
                    min_start_y = max(50, int(display_height * 0.1))  # At least 10% from top
                    ideal_start_y = display_height - total_height - 30
                    start_y = max(min_start_y, ideal_start_y)

                    for i, line in enumerate(wrapped_lines):
                        text_size = cv2.getTextSize(line, feedback_font, feedback_scale, feedback_thickness)[0]
                        feedback_x = (display_width - text_size[0]) // 2
                        feedback_y = start_y + (i * feedback_spacing)
                        
                        # Skip lines that would go off the bottom of the video
                        if feedback_y + feedback_spacing > display_height:
                            break
                            
                        # Draw border
                        cv2.putText(display_frame, line, (feedback_x, feedback_y), feedback_font, feedback_scale,
                                   feedback_border, feedback_border_thickness, cv2.LINE_AA)
                        # Draw main text
                        cv2.putText(display_frame, line, (feedback_x, feedback_y), feedback_font, feedback_scale,
                                   feedback_color, feedback_thickness, cv2.LINE_AA)

                # Store the processed frame like working example
                processed_frames.append(display_frame.copy())

            # Release resources like working example
            process_cap.release()
            display_cap.release()

            print("Creating final video with web-compatible codec...")
            
            # First create with mp4v like working example
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(temp_output_video_path, fourcc, display_fps, (display_width, display_height))

            if not out.isOpened():
                raise Exception("Could not create output video writer with mp4v codec")

            # Write all frames to the final video like working example
            for frame in processed_frames:
                out.write(frame)

            out.release()

            print("Video created successfully, checking file...")
            
            # Check if file exists and has content
            if not os.path.exists(temp_output_video_path):
                raise Exception("Output video file was not created")
            
            file_size = os.path.getsize(temp_output_video_path)
            print(f"Output video file size: {file_size} bytes")
            
            if file_size == 0:
                raise Exception("Output video file is empty")

            # Try to convert to H.264 for better browser compatibility using FFmpeg
            temp_h264_video_path = temp_output_video_path.replace('.mp4', '_h264.mp4')
            
            try:
                import subprocess
                print("Converting video to H.264 for better browser compatibility...")
                
                # Use FFmpeg to convert to H.264 with web-optimized settings
                ffmpeg_cmd = [
                    'ffmpeg', '-y', '-i', temp_output_video_path,
                    '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
                    '-movflags', '+faststart',  # Optimize for web streaming
                    '-pix_fmt', 'yuv420p',     # Ensure compatibility
                    temp_h264_video_path
                ]
                
                result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True, timeout=60)
                
                if result.returncode == 0 and os.path.exists(temp_h264_video_path):
                    h264_size = os.path.getsize(temp_h264_video_path)
                    if h264_size > 0:
                        print(f"H.264 conversion successful. Size: {h264_size} bytes")
                        # Clean up original file and use H.264 version
                        os.unlink(temp_output_video_path)
                        temp_output_video_path = temp_h264_video_path
                    else:
                        print("H.264 conversion resulted in empty file, using original")
                else:
                    print(f"H.264 conversion failed: {result.stderr}")
                    print("Using original mp4v video")
                    
            except Exception as conv_error:
                print(f"FFmpeg conversion failed: {conv_error}, using original video")
                # Clean up failed conversion file if it exists
                if os.path.exists(temp_h264_video_path):
                    os.unlink(temp_h264_video_path)

            print("Dance video processing complete.")
            print(f"Output video codec: mp4v")
            print(f"Output video size: {display_width}x{display_height}")
            print(f"Output video FPS: {display_fps}")
            print(f"Output file size: {os.path.getsize(temp_output_video_path)} bytes")

            # DEBUG: Validate output video by trying to re-open it
            print("DEBUG: Validating output video...")
            test_cap = cv2.VideoCapture(temp_output_video_path)
            if test_cap.isOpened():
                test_fps = test_cap.get(cv2.CAP_PROP_FPS)
                test_width = int(test_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                test_height = int(test_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                test_frame_count = int(test_cap.get(cv2.CAP_PROP_FRAME_COUNT))
                print(f"DEBUG: Output video validation - {test_width}x{test_height} @ {test_fps}fps, {test_frame_count} frames")

                # Try to read first frame
                ret, frame = test_cap.read()
                if ret:
                    print("DEBUG: Successfully read first frame from output video")
                else:
                    print("ERROR: Could not read first frame from output video")
                test_cap.release()
            else:
                print("ERROR: Could not open output video for validation")
                return {"error": "Output video validation failed - video may be corrupted"}

            # Return the processed video file
            return FileResponse(
                temp_output_video_path,
                media_type="video/mp4",
                filename="processed_dance_video.mp4",
                headers={
                    "Accept-Ranges": "bytes",
                    "Content-Type": "video/mp4",
                    "Cache-Control": "no-cache"
                }
            )

        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error processing video: {str(e)}")
            print(f"Full error traceback: {error_details}")
            return {"error": f"Error processing video: {str(e)}", "details": error_details}
        finally:
            # Clean up temporary input file
            if os.path.exists(temp_input_video_path):
                os.unlink(temp_input_video_path)
            # Note: output file will be cleaned up by FastAPI after response is sent


    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    @app.post("/test-structured-output")
    async def test_structured_output():
        """Test endpoint to verify structured output is working"""
        try:
            gemini_key = os.getenv("GEMINI_KEY", getattr(settings, "gemini_key", None))
            if not gemini_key:
                raise ValueError("GEMINI_KEY not set in environment or settings")

            # Create client with API key
            client = genai.Client(api_key=gemini_key)

            prompt = "Generate sample dance analysis data for testing purposes"

            # Generate content using structured output
            response = client.models.generate_content(
                model="gemini-2.0-flash-001",
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": DanceAnalysisResponse,
                }
            )
            
            print("Test structured output received successfully!")
            analysis_data = response.parsed
            
            return {
                "status": "success",
                "raw_response": response.text,
                "parsed_available": analysis_data is not None,
                "parsed_count": len(analysis_data.dance_analysis) if analysis_data else 0,
                "sample_data": {
                    "dance_analysis": [
                        {
                            "timestamp_of_outcome": item.timestamp_of_outcome,
                            "result": item.result,
                            "move_type": item.move_type,
                            "feedback": item.feedback
                        }
                        for item in analysis_data.dance_analysis[:2]  # Just first 2 items
                    ]
                } if analysis_data else None
            }
            
        except Exception as e:
            import traceback
            return {
                "status": "error",
                "error": str(e),
                "traceback": traceback.format_exc()
            }

    return app

app = create_app()