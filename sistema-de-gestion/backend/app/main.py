from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.api import api_router
from app.database import Base, engine

# Esto crea las tablas en la base de datos (basado en models.py)
# create_all() verifica si existen y solo crea las que falten
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas verificadas/creadas exitosamente")
except Exception as e:
    print(f"⚠️ Error al crear tablas: {e}")

app = FastAPI(
    title="Sistema de Gestión API",
    description="Backend para el sistema de gestión de pedidos.",
    version="1.0.0"
)

# ⭐ CORS DEBE IR ANTES QUE LAS RUTAS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluye todas las rutas de la API
app.include_router(api_router, prefix="/api")

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Bienvenido al API del Sistema de Gestión"}