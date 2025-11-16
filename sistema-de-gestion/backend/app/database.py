from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings # Importamos 'settings'
import urllib # Importamos urllib para manejar caracteres especiales

# --- CONSTRUIR LA DATABASE_URL ---

# 1. "Escapamos" el nombre del driver para que no haya errores con los espacios
# (ej. "ODBC Driver 17 for SQL Server" se convierte en "ODBC+Driver+17+for+SQL+Server")
driver_safe = urllib.parse.quote_plus(settings.DB_DRIVER)

# 2. Creamos la URL de conexión para SQL Server con Autenticación de Windows
DATABASE_URL = (
    f"mssql+pyodbc://{settings.DB_SERVER}/{settings.DB_NAME}?"
    f"driver={driver_safe}&trusted_connection=yes"
)
# ---------------------------------

# 3. Creamos el 'engine' con la URL que acabamos de construir
engine = create_engine(DATABASE_URL) 

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()