from sqlmodel import select

from models.usuario import Usuario
from schemas.usuario import UsuarioCreate
from core.security import hash_password, verify_password


def registrar_usuario(data: UsuarioCreate, session):
    usuario_existente = session.exec(
        select(Usuario).where(Usuario.email == data.email)
    ).first()

    if usuario_existente:
        return None

    usuario = Usuario(
        nombre=data.nombre,
        email=data.email,
        password=hash_password(data.password)
    )

    session.add(usuario)
    session.commit()
    session.refresh(usuario)

    return usuario


def autenticar_usuario(email: str, password: str, session):
    usuario = session.exec(
        select(Usuario).where(Usuario.email == email)
    ).first()

    if usuario is None:
        return None

    if not verify_password(password, usuario.password):
        return None

    return usuario
