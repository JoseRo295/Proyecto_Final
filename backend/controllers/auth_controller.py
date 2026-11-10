from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from db.database import SessionDep
from dependencies.auth import CurrentUser
from schemas.usuario import UsuarioCreate, UsuarioRead, Token
from services import auth_service
from core.security import crear_token

router = APIRouter(tags=["Auth"], prefix="/auth")


@router.post(
    "/register",
    response_model=UsuarioRead,
    status_code=status.HTTP_201_CREATED
)
def registrar(data: UsuarioCreate, session: SessionDep):
    usuario = auth_service.registrar_usuario(data, session)

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )

    return usuario


@router.post("/login", response_model=Token)
def login(
    data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep
):
    usuario = auth_service.autenticar_usuario(
        data.username,
        data.password,
        session
    )

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = crear_token({"sub": usuario.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UsuarioRead)
def obtener_mi_usuario(current_user: CurrentUser):
    return current_user
