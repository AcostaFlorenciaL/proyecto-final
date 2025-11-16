from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Nuevas variables de Base de Datos
    DB_DRIVER: str
    DB_SERVER: str
    DB_NAME: str
    
    # Variables de JWT (Login)
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"

settings = Settings()