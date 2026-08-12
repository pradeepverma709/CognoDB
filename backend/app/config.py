from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    COGNO_DB_URI: str = os.getenv("COGNO_DB_URI", "bolt://localhost:7687")
    COGNO_DB_USER: str = os.getenv("COGNO_DB_USER", "neo4j")
    COGNO_DB_PASSWORD: str = os.getenv("COGNO_DB_PASSWORD", "password")
    PORT: int = int(os.getenv("PORT", 8000))
    ENV: str = os.getenv("ENV", "development")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
