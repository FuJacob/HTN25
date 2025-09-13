from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users
from app.config.settings import settings
from google import genai
import tempfile
import os
import time


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


    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    return app

app = create_app()