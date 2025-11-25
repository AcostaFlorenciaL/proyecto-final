# sistema-de-gestion/backend/app/api/endpoints/turnos.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.database import get_db
from app.crud import crud_turnos

router = APIRouter()

@router.get("/", response_model=List[schemas.Turno])
def read_turnos(db: Session = Depends(get_db)):
    return crud_turnos.get_turnos(db)

@router.get("/personal/{personal_id}", response_model=List[schemas.Turno])
def read_turnos_by_personal(personal_id: int, db: Session = Depends(get_db)):
    return crud_turnos.get_turnos_by_personal(db, personal_id=personal_id)

@router.post("/", response_model=schemas.Turno)
def create_turno(turno: schemas.TurnoCreate, db: Session = Depends(get_db)):
    return crud_turnos.create_turno(db, turno=turno)

@router.put("/{turno_id}", response_model=schemas.Turno)
def update_turno(
    turno_id: int, 
    turno: schemas.TurnoCreate, 
    db: Session = Depends(get_db)
):
    db_turno = crud_turnos.update_turno(db, turno_id=turno_id, turno=turno)
    if not db_turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return db_turno

@router.delete("/{turno_id}")
def delete_turno(turno_id: int, db: Session = Depends(get_db)):
    db_turno = crud_turnos.delete_turno(db, turno_id=turno_id)
    if not db_turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return {"message": "Turno eliminado", "id": turno_id}