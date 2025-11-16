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
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    try:
        return crud_pedidos.create_pedido(db=db, pedido=pedido, user_id=user_id)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error al crear el pedido: {e}")


@router.get("/usuario/{user_id}", response_model=List[schemas.Pedido])
def read_pedidos_usuario(user_id: int, db: Session = Depends(get_db)):
    pedidos = crud_pedidos.get_pedidos_by_usuario(db, user_id=user_id)
    if not pedidos:
        return []
    return pedidos


# 🔥 NUEVO: Endpoint para obtener TODOS los pedidos (para admin)
@router.get("/todos", response_model=List[schemas.Pedido])
def read_all_pedidos(db: Session = Depends(get_db)):
    """
    Obtiene todos los pedidos del sistema (para administradores)
    """
    pedidos = crud_pedidos.get_all_pedidos(db)
    return pedidos


# 🔥 NUEVO: Endpoint para cambiar el estado de un pedido
@router.put("/{pedido_id}/estado")
def update_pedido_estado(
    pedido_id: int,
    estado_data: dict,
    db: Session = Depends(get_db)
):
    """
    Actualiza el estado de un pedido
    """
    nuevo_estado = estado_data.get("estado")
    
    if not nuevo_estado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe proporcionar un estado"
        )
    
    pedido = crud_pedidos.update_pedido_estado(db, pedido_id=pedido_id, nuevo_estado=nuevo_estado)
    
    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado"
        )
    
    return {"message": "Estado actualizado", "pedido_id": pedido_id, "nuevo_estado": nuevo_estado}