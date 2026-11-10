from datetime import datetime
from typing import Literal
from sqlmodel import SQLModel


class PedidoRead(SQLModel):
    id: int
    usuario_id: int
    fecha: datetime
    total: float
    estado: str


class PedidoItemRead(SQLModel):
    producto_id: int
    nombre: str
    cantidad: int
    precio: float
    subtotal: float


class PedidoDetalle(PedidoRead):
    items: list[PedidoItemRead]


class PedidoEstado(SQLModel):
    estado: Literal["pendiente", "procesando", "enviado", "entregado"]
