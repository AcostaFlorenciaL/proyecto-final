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


# 🔥 NUEVO: Endpoint para obtener TODOS los pedidos (historial completo)
@router.get("/todos", response_model=List[schemas.Pedido])
def read_all_pedidos(db: Session = Depends(get_db)):
    """
    Obtiene todos los pedidos del sistema (para historial admin)
    """
    pedidos = crud_pedidos.get_all_pedidos(db)
    return pedidos


# 🔥 NUEVO: Endpoint para obtener pedidos ACTIVOS (para gestión de ventas)
@router.get("/activos", response_model=List[schemas.Pedido])
def read_pedidos_activos(db: Session = Depends(get_db)):
    """
    Obtiene solo los pedidos activos (Pendiente, En preparación, Listo)
    Para la gestión de ventas en tiempo real
    """
    pedidos = crud_pedidos.get_pedidos_activos(db)
    return pedidos


# 🔥 Endpoint para cambiar el estado de un pedido
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


# 🔥 NUEVO: Endpoint para editar un pedido completo
@router.put("/{pedido_id}", response_model=schemas.Pedido)
def update_pedido(
    pedido_id: int,
    pedido_update: schemas.PedidoUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualiza los datos de un pedido (notas, total, etc.)
    """
    pedido = crud_pedidos.update_pedido(db, pedido_id=pedido_id, pedido_update=pedido_update)
    
    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado"
        )
    
    return pedido