# sistema-de-gestion/backend/app/schemas/schemas.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from decimal import Decimal
from datetime import datetime, date

# --- Usuario con dirección ---
class UsuarioBase(BaseModel):
    email: EmailStr
    nombreCompleto: Optional[str] = None
    telefono: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    contraseña: str
    direccion: Optional[str] = None

class Usuario(UsuarioBase):
    id_usuarios: int
    rol: str

    class Config:
        from_attributes = True

# --- Cliente (para enviar en respuestas) ---
class ClienteBase(BaseModel):
    nombre_completo: str
    telefono: Optional[str] = None
    email: str
    direccion: Optional[str] = None

class Cliente(ClienteBase):
    id_cliente: int
    id_usuario: int

    class Config:
        from_attributes = True

# --- Token (para Login) ---
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Usuario

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Categoría ---
class CategoriaBase(BaseModel):
    nombre_categoria: str
    descripcion: Optional[str] = None

class Categoria(CategoriaBase):
    id_categoria: int

    class Config:
        from_attributes = True

# --- Producto ---
class ProductoBase(BaseModel):
    nombre: str
    precio: Decimal
    descripcion: Optional[str] = None
    id_categoria: Optional[int] = None
    imagen: Optional[str] = None
    disponible: bool = True

class ProductoCreate(ProductoBase):
    pass

class Producto(ProductoBase):
    id_producto: int

    class Config:
        from_attributes = True

# --- Personal ---
class PersonalBase(BaseModel):
    nombre_completo: str
    puesto: str
    telefono: Optional[str] = None
    email: str
    puede_acceder: Optional[bool] = True

class PersonalCreate(PersonalBase):
    id_usuario: Optional[int] = None

class Personal(PersonalBase):
    id_personal: int
    id_usuario: Optional[int] = None

    class Config:
        from_attributes = True

# --- Turno ---
class TurnoBase(BaseModel):
    id_personal: int
    sector: str
    turno: str  # 'mañana', 'tarde', 'noche'
    dia_semana: Optional[str] = None  # 'lunes', 'martes', etc.
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    activo: Optional[bool] = True

class TurnoCreate(TurnoBase):
    pass

class Turno(TurnoBase):
    id_turno: int
    personal: Optional[Personal] = None

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
    producto: Optional[Producto] = None

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

# 🔥 Schema para actualizar pedidos
class PedidoUpdate(BaseModel):
    """
    Schema para actualizar campos de un pedido
    """
    total: Optional[Decimal] = None
    estado: Optional[str] = None
    notas: Optional[str] = None

class Pedido(BaseModel):
    id_pedido: int
    id_usuario: int
    id_cliente: Optional[int] = None
    fecha: datetime
    total: Decimal
    estado: str
    notas: Optional[str] = None
    detalles: List[DetallePedido] = []
    cliente: Optional[Cliente] = None
    usuario: Optional[Usuario] = None

    class Config:
        from_attributes = True