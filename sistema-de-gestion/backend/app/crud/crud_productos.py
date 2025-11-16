from sqlalchemy.orm import Session
from app.models import models

def get_productos(db: Session, skip: int = 0, limit: int = 100):
    """
    Obtiene todos los productos con paginación
    ✅ Agregado ORDER BY para SQL Server
    """
    return db.query(models.Producto)\
        .order_by(models.Producto.id_producto)\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_producto(db: Session, producto_id: int):
    """
    Obtiene un producto por su ID
    """
    return db.query(models.Producto)\
        .filter(models.Producto.id_producto == producto_id)\
        .first()