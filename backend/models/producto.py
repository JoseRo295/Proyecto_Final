from sqlmodel import SQLModel, Field


class Producto(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = Field(default=None, max_length=300)
    precio: float = Field(gt=0)
    stock: int = Field(default=0, ge=0)
    imagen: str
    categoria_id: int | None = Field(default=None, foreign_key="categoria.id")
