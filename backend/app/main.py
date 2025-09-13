from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users
from app.config.settings import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title="HTN25 Backend API",
        description="Backend API for HTN25 project",
        version="1.0.0",
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(users.router)

    @app.get("/")
    def read_root():
        return {"message": "Hello from HTN25 FastAPI Backend!", "version": "1.0.0"}

    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    return app

app = create_app()
