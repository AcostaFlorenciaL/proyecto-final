from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.database import get_db
from app.crud import crud_productos

router = APIRouter()

@router.get("/", response_model=List[schemas.Producto])
def read_productos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    productos = crud_productos.get_productos(db, skip=skip, limit=limit)
    return productos