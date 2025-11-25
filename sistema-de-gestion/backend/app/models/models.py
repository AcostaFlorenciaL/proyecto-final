# sistema-de-gestion/backend/app/models/models.py
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DECIMAL, DATETIME, TEXT, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id_usuarios = Column(Integer, primary_key=True, index=True, autoincrement=True)
    rol = Column(String(50), default='cliente')
    email = Column(String(50), unique=True, index=True, nullable=False)
    contraseña = Column(String(255), nullable=False)
    nombreCompleto = Column(String(100))
    telefono = Column(String(20))

    pedidos = relationship("Pedido", back_populates="usuario")
    cliente_info = relationship("Cliente", uselist=False, back_populates="usuario")
    personal_info = relationship("Personal", uselist=False, back_populates="usuario")

class Cliente(Base):
    __tablename__ = "cliente"
    id_cliente = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuarios"))
    nombre_completo = Column(String(50), nullable=False)
    telefono = Column(String(15))
    email = Column(String(50))
    direccion = Column(String(255))
    fecha_registro = Column(DATETIME, default=func.now())

    usuario = relationship("Usuario", back_populates="cliente_info")
    pedidos = relationship("Pedido", back_populates="cliente")

class Categoria(Base):
    __tablename__ = "categoria"
    id_categoria = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre_categoria = Column(String(50), nullable=False)
    descripcion = Column(String(255))

    productos = relationship("Producto", back_populates="categoria")

class Producto(Base):
    __tablename__ = "producto"
    id_producto = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    precio = Column(DECIMAL(10, 2), nullable=False)
    descripcion = Column(String(255))
    id_categoria = Column(Integer, ForeignKey("categoria.id_categoria"))
    imagen = Column(String(255))
    disponible = Column(Boolean, default=True)

    categoria = relationship("Categoria", back_populates="productos")
    detalles_pedido = relationship("DetallePedido", back_populates="producto")

class Personal(Base):
    __tablename__ = "personal"
    id_personal = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuarios"))
    nombre_completo = Column(String(50), nullable=False)
    puesto = Column(String(50), nullable=False)
    telefono = Column(String(15))
    email = Column(String(50), nullable=False)
    puede_acceder = Column(Boolean, default=True)  # ← Campo para control de acceso

    usuario = relationship("Usuario", back_populates="personal_info")
    turnos = relationship("Turno", back_populates="personal")  # ← Relación con turnos

class Turno(Base):
    __tablename__ = "turnos"
    id_turno = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_personal = Column(Integer, ForeignKey("personal.id_personal"), nullable=False)
    sector = Column(String(50), nullable=False)
    turno = Column(String(20), nullable=False)  # 'mañana', 'tarde', 'noche'
    dia_semana = Column(String(20))  # 'lunes', 'martes', etc.
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    activo = Column(Boolean, default=True)

    personal = relationship("Personal", back_populates="turnos")

class Pedido(Base):
    __tablename__ = "pedidos"
    id_pedido = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuarios"))
    id_cliente = Column(Integer, ForeignKey("cliente.id_cliente"))
    fecha = Column(DATETIME, default=func.now())
    total = Column(DECIMAL(10, 2))
    estado = Column(String(20), default='Pendiente')
    notas = Column(TEXT)

    usuario = relationship("Usuario", back_populates="pedidos")
    cliente = relationship("Cliente", back_populates="pedidos")
    detalles = relationship("DetallePedido", back_populates="pedido")

class DetallePedido(Base):
    __tablename__ = "detallePedido"
    id_detalle = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido"), nullable=False)
    id_producto = Column(Integer, ForeignKey("producto.id_producto"), nullable=False)
    cantidad = Column(Integer, nullable=False, default=1)
    subtotal = Column(DECIMAL(10, 2))

    pedido = relationship("Pedido", back_populates="detalles")
    producto = relationship("Producto", back_populates="detalles_pedido")