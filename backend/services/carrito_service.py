from sqlmodel import select

from models.carrito import Carrito, CarritoItem
from models.producto import Producto
from schemas.carrito import CarritoItemCreate


def obtener_o_crear_carrito(usuario_id: int, session):
    carrito = session.exec(
        select(Carrito).where(Carrito.usuario_id == usuario_id)
    ).first()

    if carrito is None:
        carrito = Carrito(usuario_id=usuario_id)
        session.add(carrito)
        session.commit()
        session.refresh(carrito)

    return carrito


def obtener_items(carrito_id: int, session):
    return session.exec(
        select(CarritoItem).where(CarritoItem.carrito_id == carrito_id)
    ).all()


def obtener_carrito(usuario_id: int, session):
    carrito = obtener_o_crear_carrito(usuario_id, session)

    items = []
    total = 0

    for item in obtener_items(carrito.id, session):
        producto = session.get(Producto, item.producto_id)
        subtotal = producto.precio * item.cantidad
        total = total + subtotal

        items.append({
            "id": item.id,
            "producto_id": producto.id,
            "nombre": producto.nombre,
            "imagen": producto.imagen,
            "precio": producto.precio,
            "stock": producto.stock,
            "cantidad": item.cantidad,
            "subtotal": round(subtotal, 2)
        })

    return {"items": items, "total": round(total, 2)}


def agregar_producto(usuario_id: int, data: CarritoItemCreate, session):
    carrito = obtener_o_crear_carrito(usuario_id, session)
    producto = session.get(Producto, data.producto_id)

    item = session.exec(
        select(CarritoItem).where(
            CarritoItem.carrito_id == carrito.id,
            CarritoItem.producto_id == data.producto_id
        )
    ).first()

    if item is None:
        item = CarritoItem(
            carrito_id=carrito.id,
            producto_id=data.producto_id,
            cantidad=data.cantidad
        )
    else:
        item.cantidad = item.cantidad + data.cantidad

    if item.cantidad > producto.stock:
        return None

    session.add(item)
    session.commit()
    session.refresh(item)

    return item


def obtener_item(usuario_id: int, id_item: int, session):
    carrito = obtener_o_crear_carrito(usuario_id, session)

    return session.exec(
        select(CarritoItem).where(
            CarritoItem.id == id_item,
            CarritoItem.carrito_id == carrito.id
        )
    ).first()


def actualizar_cantidad(usuario_id: int, id_item: int, cantidad: int, session):
    item = obtener_item(usuario_id, id_item, session)

    if item is None:
        return None

    producto = session.get(Producto, item.producto_id)

    if cantidad > producto.stock:
        return None

    item.cantidad = cantidad

    session.add(item)
    session.commit()
    session.refresh(item)

    return item


def eliminar_item(usuario_id: int, id_item: int, session):
    item = obtener_item(usuario_id, id_item, session)

    if item is None:
        return None

    session.delete(item)
    session.commit()

    return item
