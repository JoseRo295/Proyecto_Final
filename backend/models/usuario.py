from sqlmodel import SQLModel, Field


class Usuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=100)
    email: str = Field(max_length=100, unique=True, index=True)
    password: str
    rol: str = Field(default="cliente")
