from sqlalchemy.orm import Session, joinedload
from app.models import models
from app.schemas import schemas

def create_pedido(db: Session, pedido: schemas.PedidoCreate, user_id: int):
    # Crear el Pedido principal
    db_pedido = models.Pedido(
        id_usuario=user_id,
        id_cliente=pedido.id_cliente, # Asumiendo que el id_cliente es el id_usuario
        total=pedido.total,
        estado=pedido.estado,
        metodo_pago=pedido.metodo_pago,
        notas=pedido.notas
    )
    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)

    # Crear los Detalles del Pedido
    for detalle in pedido.detalles:
        db_detalle = models.DetallePedido(
            id_pedido=db_pedido.id_pedido,
            id_producto=detalle.id_producto,
            cantidad=detalle.cantidad,
            subtotal=detalle.subtotal
        )
        db.add(db_detalle)
    
    db.commit()
    db.refresh(db_pedido) # Refrescar para cargar la relación 'detalles'
    return db_pedido

def get_pedidos_by_usuario(db: Session, user_id: int):
    return db.query(models.Pedido).filter(models.Pedido.id_usuario == user_id)\
        .options(
            joinedload(models.Pedido.detalles)\
            .joinedload(models.DetallePedido.producto) # Carga anidada: Pedido -> Detalles -> Producto
        )\
        .order_by(models.Pedido.fecha.desc())\
        .all()