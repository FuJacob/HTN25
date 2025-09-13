from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users
from app.config.settings import settings
from google import genai
from google.genai import types
import tempfile
import os
import time
import json
import cv2
import mediapipe as mp
import numpy as np


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
                "Analyze the dance movements in the reference video and compare them to the recording. "
                "Output a JSON object with a 'dance_analysis' array, where each item includes: "
                "timestamp_of_outcome, result (reference or recording), move_type, and feedback. "
                "Format the output exactly like this example: "
                '{"dance_analysis": [{"timestamp_of_outcome": "0:05.0", "result": "reference", "move_type": "Spin", "feedback": "Reference spin is smooth and centered."}, {"timestamp_of_outcome": "0:05.0", "result": "recording", "move_type": "Spin", "feedback": "Recording spin is slightly off-balance, try to keep your core engaged."}]}'
            )

            # Generate content using the new API
            response = client.models.generate_content(
                model="gemini-2.0-flash-001",
                contents=[prompt, referencefile_active, recording_active]
            )
            return {"response": response.text}
        finally:
            # Clean up temporary files
            os.unlink(temp_video1_path)
            os.unlink(temp_video2_path)

    @app.post("/compare-performance")
    async def compare_performance(
        dance_analysis: str = Form(...),
        user_video: UploadFile = File(...)
    ):
        print("Received user video:", user_video.filename)
        print("Received dance analysis:", dance_analysis[:200] + "..." if len(dance_analysis) > 200 else dance_analysis)

        # Parse the dance analysis JSON
        try:
            analysis_data = json.loads(dance_analysis)
        except json.JSONDecodeError as e:
            return {"error": f"Invalid JSON format in dance_analysis: {str(e)}"}

        # Create temporary file for user video
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_user_video:
            user_content = await user_video.read()
            temp_user_video.write(user_content)
            temp_user_video_path = temp_user_video.name

        def wait_for_file_active_compare(uploaded_file, timeout=30, poll_interval=2):
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

            # Upload user video
            user_video_file = client.files.upload(file=temp_user_video_path)
            print("User video upload result:", user_video_file)

            # Wait for file to become ACTIVE
            user_video_active = wait_for_file_active_compare(user_video_file)

            # Create comprehensive prompt that includes the dance analysis format
            prompt = (
                "You are analyzing a user's dance performance against an established dance analysis. "
                "The dance analysis contains detailed breakdowns of proper dance movements with timestamps, move types, and feedback. "
                f"Here is the reference dance analysis: {json.dumps(analysis_data, indent=2)}\n\n"
                "Now analyze the user's video and compare their performance to the expected movements described in the analysis above. "
                "For each move type and timestamp mentioned in the reference analysis, evaluate how well the user performed that specific movement. "
                "Output a JSON object with a 'performance_comparison' array, where each item includes: "
                "timestamp, move_type (matching the reference analysis), user_performance_score (0-100), "
                "expected_technique (from reference analysis), user_execution, and improvement_suggestions. "
                "Format the output exactly like this example: "
                '{"performance_comparison": [{"timestamp": "0:05.0", "move_type": "Spin", "user_performance_score": 75, "expected_technique": "Smooth and centered spin with engaged core", "user_execution": "Spin was mostly centered but slightly wobbly", "improvement_suggestions": "Focus on keeping your core engaged throughout the spin and maintain a fixed spotting point"}]}'
            )

            response = client.models.generate_content(
                model="gemini-2.0-flash-001",
                contents=[prompt, user_video_active]
            )
            return {"response": response.text}
        finally:
            # Clean up temporary file
            os.unlink(temp_user_video_path)

    @app.post("/process-dance-video")
    async def process_dance_video(
        dance_analysis: str = Form(...),
        video_file: UploadFile = File(...)
    ):
        print("Received video file:", video_file.filename)
        print("Received dance analysis:", dance_analysis[:200] + "..." if len(dance_analysis) > 200 else dance_analysis)

        # Parse the dance analysis JSON
        try:
            analysis_data = json.loads(dance_analysis)
        except json.JSONDecodeError as e:
            return {"error": f"Invalid JSON format in dance_analysis: {str(e)}"}

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

            # Open the video file
            cap = cv2.VideoCapture(temp_input_video_path)
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

            # Create video writer
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(temp_output_video_path, fourcc, fps, (width, height))

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

            # Process dance analysis data
            dance_events = []
            if 'performance_comparison' in analysis_data:
                for item in analysis_data['performance_comparison']:
                    dance_events.append({
                        'frame_number': timestamp_to_frame(item['timestamp'], fps),
                        'move_type': item['move_type'],
                        'score': item.get('user_performance_score', 0),
                        'feedback': item.get('improvement_suggestions', ''),
                        'feedback_end_frame': timestamp_to_frame(item['timestamp'], fps) + (4 * fps)
                    })

            # Animation variables
            last_move_time = None
            current_color = (255, 255, 255)
            last_move_result = None

            # Processing variables
            frame_count = 0
            last_head = None
            process_every_n_frames = max(1, int(fps / 20))

            print("Processing dance video...")

            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                frame_count += 1

                # Process pose detection every nth frame
                if frame_count % process_every_n_frames == 0:
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = pose.process(rgb_frame)

                    if results.pose_landmarks:
                        head = results.pose_landmarks.landmark[0]
                        head_x = int(head.x * width)
                        head_y = int(head.y * height)
                        last_head = (head_x, head_y)

                # Draw dancer tracking arrow and name
                if last_head is not None:
                    head_x, head_y = last_head
                    arrow_height = 30
                    arrow_width = 45
                    arrow_tip_y = max(0, head_y - 110)

                    # Triangle points for arrow
                    pt1 = (head_x, arrow_tip_y + arrow_height)
                    pt2 = (head_x - arrow_width // 2, arrow_tip_y)
                    pt3 = (head_x + arrow_width // 2, arrow_tip_y)
                    pts = np.array([pt1, pt2, pt3], np.int32).reshape((-1, 1, 2))
                    cv2.fillPoly(frame, [pts], (0, 255, 255))  # Yellow arrow for dance

                    # Draw dancer name
                    font = cv2.FONT_HERSHEY_SIMPLEX
                    text = "Dancer"
                    text_size = cv2.getTextSize(text, font, 2.5, 6)[0]
                    text_x = head_x - text_size[0] // 2
                    text_y = arrow_tip_y - 10
                    # Black border
                    cv2.putText(frame, text, (text_x, text_y), font, 2.5, (0, 0, 0), 15, cv2.LINE_AA)
                    # White fill
                    cv2.putText(frame, text, (text_x, text_y), font, 2.5, (255, 255, 255), 6, cv2.LINE_AA)

                # Check for dance events and display stats
                current_moves_completed = 0
                current_avg_score = 0
                current_feedback = None
                total_score = 0

                for event in dance_events:
                    if event['frame_number'] <= frame_count:
                        if event['frame_number'] == frame_count:
                            # New move detected
                            last_move_time = time.time()
                            last_move_result = event['score'] >= 70  # Good performance if score >= 70
                        current_moves_completed += 1
                        total_score += event['score']

                        # Check if we should show feedback
                        if event['frame_number'] <= frame_count <= event['feedback_end_frame']:
                            current_feedback = event['feedback']

                if current_moves_completed > 0:
                    current_avg_score = int(total_score / current_moves_completed)

                # Display dance statistics
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

                # Draw moves completed
                moves_text = f"Moves Completed: {current_moves_completed}"
                cv2.putText(frame, moves_text, (stats_x, stats_y), stats_font, stats_scale,
                           stats_border, stats_border_thickness, cv2.LINE_AA)
                cv2.putText(frame, moves_text, (stats_x, stats_y), stats_font, stats_scale,
                           current_color, stats_thickness, cv2.LINE_AA)

                # Draw average score
                score_text = f"Average Score: {current_avg_score}%"
                cv2.putText(frame, score_text, (stats_x, stats_y + stats_spacing), stats_font, stats_scale,
                           stats_border, stats_border_thickness, cv2.LINE_AA)
                cv2.putText(frame, score_text, (stats_x, stats_y + stats_spacing), stats_font, stats_scale,
                           current_color, stats_thickness, cv2.LINE_AA)

                # Display feedback if available
                if current_feedback:
                    feedback_font = cv2.FONT_HERSHEY_SIMPLEX
                    feedback_scale = 1.8
                    feedback_color = (255, 255, 255)
                    feedback_border = (0, 0, 0)
                    feedback_thickness = 4
                    feedback_border_thickness = 8
                    feedback_spacing = 60

                    max_width = int(width * 0.8)
                    wrapped_lines = wrap_text(current_feedback, feedback_font, feedback_scale,
                                            feedback_thickness, max_width)

                    total_height = len(wrapped_lines) * feedback_spacing
                    start_y = height - 90 - total_height

                    for i, line in enumerate(wrapped_lines):
                        text_size = cv2.getTextSize(line, feedback_font, feedback_scale, feedback_thickness)[0]
                        feedback_x = (width - text_size[0]) // 2
                        feedback_y = start_y + (i * feedback_spacing)

                        cv2.putText(frame, line, (feedback_x, feedback_y), feedback_font, feedback_scale,
                                   feedback_border, feedback_border_thickness, cv2.LINE_AA)
                        cv2.putText(frame, line, (feedback_x, feedback_y), feedback_font, feedback_scale,
                                   feedback_color, feedback_thickness, cv2.LINE_AA)

                out.write(frame)

            # Release resources
            cap.release()
            out.release()

            print("Dance video processing complete.")

            # Return the processed video file
            return FileResponse(
                temp_output_video_path,
                media_type="video/mp4",
                filename="processed_dance_video.mp4"
            )

        except Exception as e:
            print(f"Error processing video: {str(e)}")
            return {"error": f"Error processing video: {str(e)}"}
        finally:
            # Clean up temporary input file
            if os.path.exists(temp_input_video_path):
                os.unlink(temp_input_video_path)
            # Note: output file will be cleaned up by FastAPI after response is sent


    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    return app

app = create_app()