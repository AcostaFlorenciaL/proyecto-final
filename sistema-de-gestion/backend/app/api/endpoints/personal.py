from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.database import get_db
from app.crud import crud_personal

router = APIRouter()

@router.get("/", response_model=List[schemas.Personal])
def read_all_personal(db: Session = Depends(get_db)):
    return crud_personal.get_personal(db)

@router.get("/puesto/{puesto}", response_model=List[schemas.Personal])
def read_personal_by_puesto(puesto: str, db: Session = Depends(get_db)):
    return crud_personal.get_personal_by_puesto(db, puesto=puesto)

@router.post("/", response_model=schemas.Personal)
def create_personal(personal: schemas.PersonalCreate, db: Session = Depends(get_db)):
    # Aquí deberíamos validar que el usuario sea Admin
    return crud_personal.create_personal(db, personal=personal)

@router.put("/{personal_id}", response_model=schemas.Personal)
def update_personal(personal_id: int, personal: schemas.PersonalCreate, db: Session = Depends(get_db)):
    db_personal = crud_personal.update_personal(db, personal_id=personal_id, personal=personal)
    if db_personal is None:
        raise HTTPException(status_code=404, detail="Personal not found")
    return db_personal

@router.delete("/{personal_id}", response_model=schemas.Personal)
def delete_personal(personal_id: int, db: Session = Depends(get_db)):
    db_personal = crud_personal.delete_personal(db, personal_id=personal_id)
    if db_personal is None:
        raise HTTPException(status_code=404, detail="Personal not found")
    return db_personal