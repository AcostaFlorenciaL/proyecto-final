from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas

def get_personal(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Personal).offset(skip).limit(limit).all()

def get_personal_by_puesto(db: Session, puesto: str):
    return db.query(models.Personal).filter(models.Personal.puesto == puesto).all()

def create_personal(db: Session, personal: schemas.PersonalCreate):
    db_personal = models.Personal(**personal.dict())
    db.add(db_personal)
    db.commit()
    db.refresh(db_personal)
    return db_personal

def update_personal(db: Session, personal_id: int, personal: schemas.PersonalCreate):
    db_personal = db.query(models.Personal).filter(models.Personal.id_personal == personal_id).first()
    if not db_personal:
        return None
    
    update_data = personal.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_personal, key, value)
        
    db.add(db_personal)
    db.commit()
    db.refresh(db_personal)
    return db_personal

def delete_personal(db: Session, personal_id: int):
    db_personal = db.query(models.Personal).filter(models.Personal.id_personal == personal_id).first()
    if not db_personal:
        return None
    db.delete(db_personal)
    db.commit()
    return db_personal