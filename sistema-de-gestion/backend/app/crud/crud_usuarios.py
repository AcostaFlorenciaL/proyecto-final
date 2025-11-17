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

def update_user_profile(db: Session, user_id: int, nombreCompleto: str, telefono: str, direccion: str):
    """Actualiza el perfil del usuario y su dirección"""
    try:
        print(f"🔄 Iniciando actualización del usuario {user_id}")
        
        # Actualizar datos del usuario
        user = db.query(models.Usuario).filter(models.Usuario.id_usuarios == user_id).first()
        if not user:
            print(f"❌ Usuario {user_id} no encontrado")
            return None
        
        print(f"📝 Actualizando usuario: {nombreCompleto}, {telefono}")
        user.nombreCompleto = nombreCompleto
        user.telefono = telefono
        db.add(user)
        
        # Actualizar dirección en la tabla cliente
        cliente = db.query(models.Cliente).filter(models.Cliente.id_usuario == user_id).first()
        if cliente:
            print(f"📝 Actualizando cliente: dirección = {direccion}")
            cliente.nombre_completo = nombreCompleto
            cliente.telefono = telefono
            cliente.direccion = direccion
            db.add(cliente)
        else:
            print(f"⚠️ No se encontró cliente para usuario {user_id}")
        
        db.commit()
        print(f"✅ Usuario {user_id} actualizado exitosamente en la BD")
        return user
    except Exception as e:
        db.rollback()
        print(f"❌ Error al actualizar perfil: {e}")
        raise

def change_password(db: Session, user_id: int, old_password: str, new_password: str):
    """Cambia la contraseña del usuario"""
    try:
        user = db.query(models.Usuario).filter(models.Usuario.id_usuarios == user_id).first()
        if not user:
            return False
        
        # Verificar contraseña actual
        if not verify_password(old_password, user.contraseña):
            return False
        
        # Guardar nueva contraseña hasheada
        user.contraseña = get_password_hash(new_password)
        db.add(user)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"❌ Error al cambiar contraseña: {e}")
        return False