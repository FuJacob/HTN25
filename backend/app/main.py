from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users
from app.config.settings import settings
from google import genai
import tempfile
import os
import time
import json


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

        def wait_for_active(client, file_obj, timeout=30, poll_interval=2):
            start = time.time()
            file_id = file_obj.name.split('/')[-1]
            while time.time() - start < timeout:
                status = client.files.get(name=file_id).state
                if status == "ACTIVE":
                    return client.files.get(name=file_id)
                time.sleep(poll_interval)
            raise RuntimeError(f"File {file_id} did not become ACTIVE in time (last state: {status})")

        try:
            gemini_key = os.getenv("GEMINI_KEY", getattr(settings, "gemini_key", None))
            if not gemini_key:
                raise ValueError("GEMINI_KEY not set in environment or settings")
            client = genai.Client(api_key=gemini_key)
            referencefile = client.files.upload(file=temp_video1_path)
            print("Reference file upload result:", referencefile)
            recording = client.files.upload(file=temp_video2_path)
            print("Recording file upload result:", recording)

            # Wait for both files to become ACTIVE
            referencefile_active = wait_for_active(client, referencefile)
            recording_active = wait_for_active(client, recording)

            prompt = (
                "Analyze the dance movements in the reference video and compare them to the recording. "
                "Output a JSON object with a 'dance_analysis' array, where each item includes: "
                "timestamp_of_outcome, result (reference or recording), move_type, and feedback. "
                "Format the output exactly like this example: "
                '{"dance_analysis": [{"timestamp_of_outcome": "0:05.0", "result": "reference", "move_type": "Spin", "feedback": "Reference spin is smooth and centered."}, {"timestamp_of_outcome": "0:05.0", "result": "recording", "move_type": "Spin", "feedback": "Recording spin is slightly off-balance, try to keep your core engaged."}]}'
            )
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt, referencefile_active, recording_active]
            )
            return response
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

        def wait_for_active(client, file_obj, timeout=30, poll_interval=2):
            start = time.time()
            file_id = file_obj.name.split('/')[-1]
            while time.time() - start < timeout:
                status = client.files.get(name=file_id).state
                if status == "ACTIVE":
                    return client.files.get(name=file_id)
                time.sleep(poll_interval)
            raise RuntimeError(f"File {file_id} did not become ACTIVE in time (last state: {status})")

        try:
            gemini_key = os.getenv("GEMINI_KEY", getattr(settings, "gemini_key", None))
            if not gemini_key:
                raise ValueError("GEMINI_KEY not set in environment or settings")
            client = genai.Client(api_key=gemini_key)

            # Upload user video
            user_video_file = client.files.upload(file=temp_user_video_path)
            print("User video upload result:", user_video_file)

            # Wait for file to become ACTIVE
            user_video_active = wait_for_active(client, user_video_file)

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
                model="gemini-2.5-flash",
                contents=[prompt, user_video_active]
            )
            return response
        finally:
            # Clean up temporary file
            os.unlink(temp_user_video_path)


    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    return app

app = create_app()