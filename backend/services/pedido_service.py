from datetime import datetime, timezone
from sqlmodel import select

from models.pedido import Pedido, PedidoItem
from models.producto import Producto
from services.carrito_service import obtener_o_crear_carrito, obtener_items


def crear_pedido(usuario_id: int, session):
    carrito = obtener_o_crear_carrito(usuario_id, session)
    items = obtener_items(carrito.id, session)

    if len(items) == 0:
        return None

    total = 0

    for item in items:
        producto = session.get(Producto, item.producto_id)

        if item.cantidad > producto.stock:
            return None

        total = total + producto.precio * item.cantidad

    pedido = Pedido(
        usuario_id=usuario_id,
        fecha=datetime.now(timezone.utc),
        total=round(total, 2)
    )

    session.add(pedido)
    session.commit()
    session.refresh(pedido)

    for item in items:
        producto = session.get(Producto, item.producto_id)

        pedido_item = PedidoItem(
            pedido_id=pedido.id,
            producto_id=producto.id,
            nombre=producto.nombre,
            cantidad=item.cantidad,
            precio=producto.precio,
            subtotal=round(producto.precio * item.cantidad, 2)
        )

        producto.stock = producto.stock - item.cantidad

        session.add(pedido_item)
        session.add(producto)
        session.delete(item)

    session.commit()
    session.refresh(pedido)

    return pedido


def obtener_pedidos_usuario(usuario_id: int, session):
    return session.exec(
        select(Pedido).where(Pedido.usuario_id == usuario_id)
    ).all()


def obtener_todos_pedidos(session):
    return session.exec(select(Pedido)).all()


def obtener_pedido(id_pedido: int, session):
    return session.exec(
        select(Pedido).where(Pedido.id == id_pedido)
    ).first()


def obtener_detalle(id_pedido: int, usuario, session):
    pedido = obtener_pedido(id_pedido, session)

    if pedido is None:
        return None

    if usuario.rol != "admin" and pedido.usuario_id != usuario.id:
        return None

    items = session.exec(
        select(PedidoItem).where(PedidoItem.pedido_id == pedido.id)
    ).all()

    detalle = pedido.model_dump()
    detalle["items"] = items

    return detalle


def actualizar_estado(id_pedido: int, estado: str, session):
    pedido = obtener_pedido(id_pedido, session)

    if pedido is None:
        return None

    pedido.estado = estado

    session.add(pedido)
    session.commit()
    session.refresh(pedido)

    return pedido
