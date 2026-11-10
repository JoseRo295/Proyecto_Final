from typing import Annotated
from fastapi import FastAPI, Depends
from sqlmodel import SQLModel, Session, create_engine
from core.config import DATABASE_URL
from db.datos_iniciales import cargar_datos_iniciales

engine = create_engine(
    DATABASE_URL
)

def crear_tablas(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        cargar_datos_iniciales(session)
    yield

def obtener_sesion():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(obtener_sesion)]
