from pydantic import EmailStr
from sqlmodel import SQLModel, Field


class UsuarioCreate(SQLModel):
    nombre: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)


class UsuarioRead(SQLModel):
    id: int
    nombre: str
    email: str
    rol: str


class Token(SQLModel):
    access_token: str
    token_type: str
