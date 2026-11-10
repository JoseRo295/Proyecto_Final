from sqlmodel import SQLModel, Field


class CategoriaCreate(SQLModel):
    nombre: str = Field(min_length=2, max_length=50)
    descripcion: str | None = Field(default=None, max_length=300)


class CategoriaRead(SQLModel):
    id: int
    nombre: str
    descripcion: str | None
