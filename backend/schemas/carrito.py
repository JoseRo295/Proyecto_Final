from sqlmodel import SQLModel, Field


class CarritoItemCreate(SQLModel):
    producto_id: int
    cantidad: int = Field(default=1, gt=0)


class CarritoItemUpdate(SQLModel):
    cantidad: int = Field(gt=0)


class CarritoItemRead(SQLModel):
    id: int
    producto_id: int
    nombre: str
    imagen: str
    precio: float
    stock: int
    cantidad: int
    subtotal: float


class CarritoRead(SQLModel):
    items: list[CarritoItemRead]
    total: float
