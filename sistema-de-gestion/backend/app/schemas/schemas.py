from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from decimal import Decimal
from datetime import datetime

# --- Producto y Categoria ---
class ProductoBase(BaseModel):
    nombre: str
    precio: Decimal
    descripcion: Optional[str] = None
    id_categoria: int
    imagen: Optional[str] = None
    disponible: Optional[bool] = True

class Producto(ProductoBase):
    id_producto: int

    class Config:
        from_attributes = True

class Categoria(BaseModel):
    id_categoria: int
    nombre_categoria: str
    descripcion: Optional[str] = None
    productos: List[Producto] = []

    class Config:
        from_attributes = True

# --- Usuario y Auth ---
class UsuarioBase(BaseModel):
    email: EmailStr
    nombreCompleto: Optional[str] = None
    telefono: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    contraseña: str

class Usuario(UsuarioBase):
    id_usuarios: int
    rol: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Usuario

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Personal ---
class PersonalBase(BaseModel):
    nombre_completo: str
    puesto: str
    email: EmailStr
    telefono: Optional[str] = None
    id_usuario: Optional[int] = None

class PersonalCreate(PersonalBase):
    pass

class Personal(PersonalBase):
    id_personal: int

    class Config:
        from_attributes = True
        
# --- Pedido y Detalle ---
class DetallePedidoBase(BaseModel):
    id_producto: int
    cantidad: int
    subtotal: Decimal

class DetallePedidoCreate(DetallePedidoBase):
    pass

class DetallePedido(DetallePedidoBase):
    id_detalle: int
    id_pedido: int
    producto: Optional[Producto] # Para incluir detalles del producto

    class Config:
        from_attributes = True

class PedidoBase(BaseModel):
    total: Decimal
    metodo_pago: Optional[str] = "Efectivo"
    notas: Optional[str] = None
    estado: Optional[str] = "Pendiente"

class PedidoCreate(PedidoBase):
    # id_cliente es el id_usuarios
    id_cliente: int 
    detalles: List[DetallePedidoCreate]

class Pedido(PedidoBase):
    id_pedido: int
    id_usuario: int
    fecha: datetime
    detalles: List[DetallePedido] = []

    class Config:
        from_attributes = True