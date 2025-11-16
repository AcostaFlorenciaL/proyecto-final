from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.database import get_db
from app.crud import crud_pedidos

router = APIRouter()

@router.post("/", response_model=schemas.Pedido)
def create_pedido(
    pedido: schemas.PedidoCreate,
    user_id: int = Query(...), # Obtenemos user_id del query param
    db: Session = Depends(get_db)
):
    # En un mundo real, validaríamos que el user_id provenga de un token JWT
    # Por ahora, confiamos en el user_id enviado
    try:
        return crud_pedidos.create_pedido(db=db, pedido=pedido, user_id=user_id)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error al crear el pedido: {e}")


@router.get("/usuario/{user_id}", response_model=List[schemas.Pedido])
def read_pedidos_usuario(user_id: int, db: Session = Depends(get_db)):
    # Aquí también deberíamos validar el token
    pedidos = crud_pedidos.get_pedidos_by_usuario(db, user_id=user_id)
    if not pedidos:
        # Devolver una lista vacía es mejor que un 404
        return []
    return pedidos