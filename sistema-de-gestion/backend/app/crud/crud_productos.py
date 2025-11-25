# sistema-de-gestion/backend/app/crud/crud_productos.py
from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas

def get_productos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Producto)\
        .order_by(models.Producto.id_producto)\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_producto(db: Session, producto_id: int):
    return db.query(models.Producto)\
        .filter(models.Producto.id_producto == producto_id)\
        .first()

def create_producto(db: Session, producto: schemas.ProductoCreate):
    db_producto = models.Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

def update_producto(db: Session, producto_id: int, producto: schemas.ProductoCreate):
    db_producto = db.query(models.Producto)\
        .filter(models.Producto.id_producto == producto_id)\
        .first()
    
    if not db_producto:
        return None
    
    update_data = producto.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_producto, key, value)
    
    db.commit()
    db.refresh(db_producto)
    return db_producto

def delete_producto(db: Session, producto_id: int):
    db_producto = db.query(models.Producto)\
        .filter(models.Producto.id_producto == producto_id)\
        .first()
    
    if not db_producto:
        return None
    
    db.delete(db_producto)
    db.commit()
    return db_producto

def get_categorias(db: Session):
    return db.query(models.Categoria).all()