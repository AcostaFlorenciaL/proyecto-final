from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.schemas import schemas
from app.database import get_db
from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.crud import crud_usuarios
from app.models import models

router = APIRouter()

@router.post("/registro", response_model=schemas.Usuario)
def register_user(user: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    db_user = crud_usuarios.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return crud_usuarios.create_user(db=db, user=user)

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = crud_usuarios.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Devolvemos el token Y los datos del usuario, tal como espera el frontend
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user # Esto pasará el objeto Usuario a Pydantic y lo serializará
    }

# ✅ Nuevo endpoint para obtener datos del usuario
@router.get("/usuarios/{user_id}", response_model=schemas.Usuario)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.id_usuarios == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return user

# ✅ Nuevo endpoint para obtener datos del cliente (dirección)
@router.get("/cliente/usuario/{user_id}")
def get_cliente_profile(user_id: int, db: Session = Depends(get_db)):
    cliente = db.query(models.Cliente).filter(models.Cliente.id_usuario == user_id).first()
    if not cliente:
        return {"direccion": ""}
    
    return {
        "id_cliente": cliente.id_cliente,
        "nombre_completo": cliente.nombre_completo,
        "telefono": cliente.telefono,
        "email": cliente.email,
        "direccion": cliente.direccion
    }

# ✅ Nuevo endpoint para actualizar perfil
@router.put("/usuarios/{user_id}")
def update_user_profile(user_id: int, user_data: dict = Body(...), db: Session = Depends(get_db)):
    try:
        print(f"📝 Actualizando usuario {user_id} con datos: {user_data}")
        
        nombreCompleto = user_data.get("nombreCompleto") or user_data.get("nombre")
        telefono = user_data.get("telefono")
        direccion = user_data.get("direccion")
        
        print(f"📝 Datos extraídos - Nombre: {nombreCompleto}, Tel: {telefono}, Dir: {direccion}")
        
        user = crud_usuarios.update_user_profile(db, user_id, nombreCompleto, telefono, direccion)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        print(f"✅ Usuario {user_id} actualizado correctamente")
        return {"message": "Perfil actualizado correctamente", "user": user}
    except Exception as e:
        print(f"❌ Error al actualizar perfil: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# ✅ Nuevo endpoint para cambiar contraseña
@router.post("/cambiar-contraseña/{user_id}")
def change_password(user_id: int, password_data: dict = Body(...), db: Session = Depends(get_db)):
    try:
        current_password = password_data.get("currentPassword")
        new_password = password_data.get("newPassword")
        
        if not current_password or not new_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Debe proporcionar contraseña actual y nueva"
            )
        
        success = crud_usuarios.change_password(db, user_id, current_password, new_password)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Contraseña actual incorrecta"
            )
        
        return {"message": "Contraseña cambiada correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )