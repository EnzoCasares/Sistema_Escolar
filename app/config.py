from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Instituto RME"
    SECRET_KEY: str = "changeme-super-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    GOOGLE_API_KEY: Optional[str] = None

    DB_HOST: str
    DB_PORT: int = 5432
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    DB_SSL_MODE: str = "require"

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            f"?sslmode={self.DB_SSL_MODE}"
        )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.GOOGLE_API_KEY:
            self.GOOGLE_API_KEY = self.GOOGLE_API_KEY.strip('"' + "'")

    class Config:
        env_file = ".env"

settings = Settings()
