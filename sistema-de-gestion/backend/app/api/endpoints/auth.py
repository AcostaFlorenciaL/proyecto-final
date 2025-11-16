from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.schemas import schemas
from app.database import get_db
from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.crud import crud_usuarios

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