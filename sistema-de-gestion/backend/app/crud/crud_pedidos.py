from sqlalchemy.orm import Session, joinedload
from app.models import models
from app.schemas import schemas

def create_pedido(db: Session, pedido: schemas.PedidoCreate, user_id: int):
    """
    Crea un nuevo pedido (SIMPLIFICADO)
    ✅ Sin método de pago - se elige al momento de entregar
    ✅ La dirección está en la tabla cliente
    """
    try:
        # Buscar el cliente del usuario
        cliente = db.query(models.Cliente).filter(
            models.Cliente.id_usuario == user_id
        ).first()
        
        if not cliente:
            # Crear cliente si no existe (por seguridad)
            usuario = db.query(models.Usuario).filter(
                models.Usuario.id_usuarios == user_id
            ).first()
            
            if not usuario:
                raise ValueError(f"Usuario {user_id} no encontrado")
            
            cliente = models.Cliente(
                id_usuario=user_id,
                nombre_completo=usuario.nombreCompleto or "Cliente",
                telefono=usuario.telefono or "",
                email=usuario.email,
                direccion=""  # Sin dirección por defecto
            )
            db.add(cliente)
            db.commit()
            db.refresh(cliente)
            print(f"⚠️ Cliente {cliente.id_cliente} creado sin dirección")
        
        # Crear el pedido
        db_pedido = models.Pedido(
            id_usuario=user_id,
            id_cliente=cliente.id_cliente,
            total=pedido.total,
            estado="Pendiente",
            notas=pedido.notas
        )
        db.add(db_pedido)
        db.commit()
        db.refresh(db_pedido)

        # Crear detalles
        for detalle in pedido.detalles:
            db_detalle = models.DetallePedido(
                id_pedido=db_pedido.id_pedido,
                id_producto=detalle.id_producto,
                cantidad=detalle.cantidad,
                subtotal=detalle.subtotal
            )
            db.add(db_detalle)
        
        db.commit()
        db.refresh(db_pedido)
        
        print(f"✅ Pedido {db_pedido.id_pedido} creado - Total: ${pedido.total}")
        return db_pedido
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error al crear pedido: {str(e)}")
        raise

def get_pedidos_by_usuario(db: Session, user_id: int):
    """Obtiene pedidos del usuario con sus detalles"""
    return db.query(models.Pedido)\
        .filter(models.Pedido.id_usuario == user_id)\
        .options(
            joinedload(models.Pedido.detalles)
            .joinedload(models.DetallePedido.producto)
        )\
        .order_by(models.Pedido.fecha.desc())\
        .all()


# 🔥 NUEVAS FUNCIONES PARA ADMIN

def get_all_pedidos(db: Session):
    """
    Obtiene TODOS los pedidos del sistema con sus relaciones
    Para vista de administrador
    """
    return db.query(models.Pedido)\
        .options(
            joinedload(models.Pedido.detalles)
            .joinedload(models.DetallePedido.producto),
            joinedload(models.Pedido.cliente),
            joinedload(models.Pedido.usuario)
        )\
        .order_by(models.Pedido.fecha.desc())\
        .all()


def update_pedido_estado(db: Session, pedido_id: int, nuevo_estado: str):
    """
    Actualiza el estado de un pedido
    """
    pedido = db.query(models.Pedido).filter(
        models.Pedido.id_pedido == pedido_id
    ).first()
    
    if not pedido:
        return None
    
    pedido.estado = nuevo_estado
    db.commit()
    db.refresh(pedido)
    
    print(f"✅ Pedido {pedido_id} actualizado a estado: {nuevo_estado}")
    return pedido