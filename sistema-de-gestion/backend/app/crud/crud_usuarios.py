from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.core.security import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str):
    """Obtiene un usuario por su email"""
    return db.query(models.Usuario).filter(models.Usuario.email == email).first()

def create_user(db: Session, user: schemas.UsuarioCreate):
    """
    Crea un nuevo usuario Y su registro de cliente con dirección
    ✅ La dirección se guarda en la tabla cliente
    """
    try:
        # 1. Crear el usuario
        hashed_password = get_password_hash(user.contraseña)
        db_user = models.Usuario(
            email=user.email,
            contraseña=hashed_password,
            nombreCompleto=user.nombreCompleto,
            telefono=user.telefono,
            rol='cliente'
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # 2. ✅ Crear el cliente con la dirección
        db_cliente = models.Cliente(
            id_usuario=db_user.id_usuarios,
            nombre_completo=user.nombreCompleto or "Cliente",
            telefono=user.telefono or "",
            email=user.email,
            direccion=user.direccion or ""  # ✅ Guardar dirección del registro
        )
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        
        print(f"✅ Usuario {db_user.id_usuarios} y cliente {db_cliente.id_cliente} creados con dirección")
        return db_user
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error al crear usuario: {e}")
        raise

def authenticate_user(db: Session, email: str, password: str):
    """Autentica un usuario verificando email y contraseña"""
    user = get_user_by_email(db, email=email)
    if not user:
        return False
    if not verify_password(password, user.contraseña):
        return False
    return user