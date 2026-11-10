import random

from sqlmodel import select, or_

from models.producto import Producto
from models.carrito import CarritoItem
from schemas.producto import ProductoCreate


def obtener_productos(session, buscar: str | None = None, categoria_id: int | None = None):
    consulta = select(Producto)

    if buscar:
        consulta = consulta.where(
            or_(
                Producto.nombre.contains(buscar),
                Producto.descripcion.contains(buscar)
            )
        )

    if categoria_id:
        consulta = consulta.where(Producto.categoria_id == categoria_id)

    return session.exec(consulta).all()


def obtener_productos_aleatorios(cantidad: int, session):
    productos = session.exec(select(Producto)).all()

    return random.sample(productos, min(cantidad, len(productos)))


def obtener_producto(id_producto: int, session):
    return session.exec(
        select(Producto).where(Producto.id == id_producto)
    ).first()


def crear_producto(data: ProductoCreate, session):
    producto = Producto(**data.model_dump())

    session.add(producto)
    session.commit()
    session.refresh(producto)

    return producto


def actualizar_producto(id_producto: int, data: ProductoCreate, session):
    producto = obtener_producto(id_producto, session)

    if producto is None:
        return None

    producto.sqlmodel_update(data.model_dump())

    session.add(producto)
    session.commit()
    session.refresh(producto)

    return producto


def eliminar_producto(id_producto: int, session):
    producto = obtener_producto(id_producto, session)

    if producto is None:
        return None

    items = session.exec(
        select(CarritoItem).where(CarritoItem.producto_id == id_producto)
    ).all()

    for item in items:
        session.delete(item)

    session.delete(producto)
    session.commit()

    return producto
