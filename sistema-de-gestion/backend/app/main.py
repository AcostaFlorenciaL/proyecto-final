from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.api import api_router
from app.database import Base, engine

# Esto crea las tablas en la base de datos (basado en models.py)
# La primera vez que ejecutes la app, esto creará el archivo sql_app.db
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Gestión API",
    description="Backend para el sistema de gestión de pedidos.",
    version="1.0.0"
)

# Configuración de CORS
# Permite que el frontend de React (ej. localhost:5173) se comunique con el backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], # Añade aquí el puerto de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluye todas las rutas de la API
app.include_router(api_router, prefix="/api")

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Bienvenido al API del Sistema de Gestión"}