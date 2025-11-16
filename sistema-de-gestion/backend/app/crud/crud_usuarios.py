from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.core.security import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str):
    return db.query(models.Usuario).filter(models.Usuario.email == email).first()

def create_user(db: Session, user: schemas.UsuarioCreate):
    hashed_password = get_password_hash(user.contraseña)
    db_user = models.Usuario(
        email=user.email,
        contraseña=hashed_password,
        nombreCompleto=user.nombreCompleto,
        telefono=user.telefono,
        rol='cliente' # Rol por defecto
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email=email)
    if not user:
        return False
    if not verify_password(password, user.contraseña):
        return False
    return user