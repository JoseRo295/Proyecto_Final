from datetime import datetime
from sqlmodel import SQLModel, Field


class Pedido(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    fecha: datetime
    total: float = Field(ge=0)
    estado: str = Field(default="pendiente")


class PedidoItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedido.id")
    producto_id: int = Field(foreign_key="producto.id")
    nombre: str
    cantidad: int = Field(gt=0)
    precio: float = Field(gt=0)
    subtotal: float = Field(gt=0)
