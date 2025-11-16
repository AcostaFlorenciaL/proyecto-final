from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas

def get_personal(db: Session, skip: int = 0, limit: int = 100):
    """
    Obtiene todo el personal con paginación
    ✅ Agregado ORDER BY para SQL Server
    """
    return db.query(models.Personal)\
        .order_by(models.Personal.id_personal)\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_personal_by_puesto(db: Session, puesto: str):
    """
    Obtiene personal filtrado por puesto
    """
    return db.query(models.Personal)\
        .filter(models.Personal.puesto == puesto)\
        .order_by(models.Personal.nombre_completo)\
        .all()

def create_personal(db: Session, personal: schemas.PersonalCreate):
    """
    Crea un nuevo registro de personal
    """
    db_personal = models.Personal(**personal.dict())
    db.add(db_personal)
    db.commit()
    db.refresh(db_personal)
    return db_personal

def update_personal(db: Session, personal_id: int, personal: schemas.PersonalCreate):
    """
    Actualiza un registro de personal existente
    """
    db_personal = db.query(models.Personal)\
        .filter(models.Personal.id_personal == personal_id)\
        .first()
    
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
    """
    Elimina un registro de personal
    """
    db_personal = db.query(models.Personal)\
        .filter(models.Personal.id_personal == personal_id)\
        .first()
    
    if not db_personal:
        return None
    
    db.delete(db_personal)
    db.commit()
    return db_personal