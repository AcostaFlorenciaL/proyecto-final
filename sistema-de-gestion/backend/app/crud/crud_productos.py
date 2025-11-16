from sqlalchemy.orm import Session
from app.models import models

def get_productos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Producto).offset(skip).limit(limit).all()

def get_producto(db: Session, producto_id: int):
    return db.query(models.Producto).filter(models.Producto.id_producto == producto_id).first()