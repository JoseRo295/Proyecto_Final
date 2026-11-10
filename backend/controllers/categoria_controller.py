from fastapi import APIRouter, HTTPException, status

from db.database import SessionDep
from dependencies.auth import AdminUser
from schemas.categoria import CategoriaCreate, CategoriaRead
from schemas.producto import ProductoRead
from services import categoria_service, producto_service


router = APIRouter(tags=["Categorias"], prefix="/categorias")


@router.get("/", response_model=list[CategoriaRead])
def obtener_categorias(session: SessionDep):
    return categoria_service.obtener_categorias(session)


@router.get("/{id_categoria}", response_model=CategoriaRead)
def obtener_categoria(id_categoria: int, session: SessionDep):
    categoria = categoria_service.obtener_categoria(id_categoria, session)

    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    return categoria


@router.get("/{id_categoria}/productos", response_model=list[ProductoRead])
def obtener_productos_de_categoria(id_categoria: int, session: SessionDep):
    categoria = categoria_service.obtener_categoria(id_categoria, session)

    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    return producto_service.obtener_productos(session, categoria_id=id_categoria)


@router.post(
    "/",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED
)
def crear_categoria(
    data: CategoriaCreate,
    admin: AdminUser,
    session: SessionDep
):
    return categoria_service.crear_categoria(data, session)


@router.put("/{id_categoria}", response_model=CategoriaRead)
def actualizar_categoria(
    id_categoria: int,
    data: CategoriaCreate,
    admin: AdminUser,
    session: SessionDep
):
    categoria = categoria_service.actualizar_categoria(id_categoria, data, session)

    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    return categoria


@router.delete("/{id_categoria}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(
    id_categoria: int,
    admin: AdminUser,
    session: SessionDep
):
    categoria = categoria_service.eliminar_categoria(id_categoria, session)

    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )
