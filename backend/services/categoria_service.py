from sqlmodel import select

from models.categoria import Categoria
from schemas.categoria import CategoriaCreate


def obtener_categorias(session):
    return session.exec(select(Categoria)).all()


def obtener_categoria(id_categoria: int, session):
    return session.exec(
        select(Categoria).where(Categoria.id == id_categoria)
    ).first()


def crear_categoria(data: CategoriaCreate, session):
    categoria = Categoria(**data.model_dump())

    session.add(categoria)
    session.commit()
    session.refresh(categoria)

    return categoria


def actualizar_categoria(id_categoria: int, data: CategoriaCreate, session):
    categoria = obtener_categoria(id_categoria, session)

    if categoria is None:
        return None

    categoria.sqlmodel_update(data.model_dump())

    session.add(categoria)
    session.commit()
    session.refresh(categoria)

    return categoria


def eliminar_categoria(id_categoria: int, session):
    categoria = obtener_categoria(id_categoria, session)

    if categoria is None:
        return None

    session.delete(categoria)
    session.commit()

    return categoria
