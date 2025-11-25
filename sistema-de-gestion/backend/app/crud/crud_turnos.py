# sistema-de-gestion/backend/app/crud/crud_turnos.py
from sqlalchemy.orm import Session, joinedload
from app.models import models
from app.schemas import schemas

def get_turnos(db: Session):
    return db.query(models.Turno)\
        .options(joinedload(models.Turno.personal))\
        .filter(models.Turno.activo == True)\
        .order_by(models.Turno.id_turno)\
        .all()

def get_turnos_by_personal(db: Session, personal_id: int):
    return db.query(models.Turno)\
        .filter(models.Turno.id_personal == personal_id, models.Turno.activo == True)\
        .all()

def create_turno(db: Session, turno: schemas.TurnoCreate):
    db_turno = models.Turno(**turno.dict())
    db.add(db_turno)
    db.commit()
    db.refresh(db_turno)
    return db_turno

def update_turno(db: Session, turno_id: int, turno: schemas.TurnoCreate):
    db_turno = db.query(models.Turno)\
        .filter(models.Turno.id_turno == turno_id)\
        .first()
    
    if not db_turno:
        return None
    
    update_data = turno.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_turno, key, value)
    
    db.commit()
    db.refresh(db_turno)
    return db_turno

def delete_turno(db: Session, turno_id: int):
    db_turno = db.query(models.Turno)\
        .filter(models.Turno.id_turno == turno_id)\
        .first()
    
    if not db_turno:
        return None
    
    # Soft delete
    db_turno.activo = False
    db.commit()
    return db_turno