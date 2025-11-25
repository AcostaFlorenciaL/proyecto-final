# sistema-de-gestion/backend/app/api/endpoints/productos.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.database import get_db
from app.crud import crud_productos

router = APIRouter()

@router.get("/", response_model=List[schemas.Producto])
def read_productos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    productos = crud_productos.get_productos(db, skip=skip, limit=limit)
    return productos

@router.get("/{producto_id}", response_model=schemas.Producto)
def read_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = crud_productos.get_producto(db, producto_id=producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@router.post("/", response_model=schemas.Producto)
def create_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    return crud_productos.create_producto(db, producto=producto)

@router.put("/{producto_id}", response_model=schemas.Producto)
def update_producto(
    producto_id: int, 
    producto: schemas.ProductoCreate, 
    db: Session = Depends(get_db)
):
    db_producto = crud_productos.update_producto(db, producto_id=producto_id, producto=producto)
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

@router.delete("/{producto_id}")
def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = crud_productos.delete_producto(db, producto_id=producto_id)
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"message": "Producto eliminado", "id": producto_id}

# Obtener categorías
@router.get("/categorias/list", response_model=List[schemas.Categoria])
def read_categorias(db: Session = Depends(get_db)):
    return crud_productos.get_categorias(db)