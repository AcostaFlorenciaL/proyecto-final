from fastapi import APIRouter
from app.api.endpoints import auth, productos, pedidos, personal

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(productos.router, prefix="/productos", tags=["Productos"])
api_router.include_router(pedidos.router, prefix="/pedidos", tags=["Pedidos"])
api_router.include_router(personal.router, prefix="/personal", tags=["Personal"])