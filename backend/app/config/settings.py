from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Application settings
    app_name: str = "HTN25 Backend API"
    debug: bool = False
    
    # CORS settings - simplified to avoid parsing issues
    allowed_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Database settings
    database_url: str = "sqlite:///./sql_app.db"
    
    # API settings
    api_v1_str: str = "/api/v1"
    # Gemini API key
    gemini_key: str = ""
    
    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"  # Ignore extra fields from .env

settings = Settings()
