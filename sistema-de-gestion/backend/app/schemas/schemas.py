from pydantic import BaseModel, EmailStr
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

# --- Usuario con dirección ---
class UsuarioBase(BaseModel):
    email: EmailStr
    nombreCompleto: Optional[str] = None
    telefono: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    contraseña: str
    direccion: Optional[str] = None  # ✅ AGREGADO

class Usuario(UsuarioBase):
    id_usuarios: int
    rol: str

    class Config:
        from_attributes = True

# --- Pedido simplificado ---
class DetallePedidoBase(BaseModel):
    id_producto: int
    cantidad: int
    subtotal: Decimal

class DetallePedidoCreate(DetallePedidoBase):
    pass

class DetallePedido(DetallePedidoBase):
    id_detalle: int
    id_pedido: int
    producto: str

    class Config:
        from_attributes = True

class PedidoCreate(BaseModel):
    """
    ✅ SUPER SIMPLIFICADO
    Solo lo esencial - todo lo demás lo calcula el backend
    """
    total: Decimal
    detalles: List[DetallePedidoCreate]
    notas: Optional[str] = None

class Pedido(BaseModel):
    id_pedido: int
    id_usuario: int
    id_cliente: Optional[int] = None
    fecha: datetime
    total: Decimal
    estado: str
    # ❌ metodo_pago eliminado
    notas: Optional[str] = None
    detalles: List[DetallePedido] = []

    class Config:
        from_attributes = True