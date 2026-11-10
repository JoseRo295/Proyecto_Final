from fastapi import APIRouter, HTTPException, status

from db.database import SessionDep
from dependencies.auth import AdminUser
from schemas.producto import ProductoCreate, ProductoRead
from services import producto_service, categoria_service


router = APIRouter(tags=["Productos"], prefix="/productos")


@router.get("/", response_model=list[ProductoRead])
def obtener_productos(
    session: SessionDep,
    buscar: str | None = None,
    categoria_id: int | None = None
):
    return producto_service.obtener_productos(session, buscar, categoria_id)


@router.get("/aleatorios", response_model=list[ProductoRead])
def obtener_productos_aleatorios(session: SessionDep, cantidad: int = 4):
    return producto_service.obtener_productos_aleatorios(cantidad, session)


@router.get("/{id_producto}", response_model=ProductoRead)
def obtener_producto(id_producto: int, session: SessionDep):
    producto = producto_service.obtener_producto(id_producto, session)

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    return producto


@router.post(
    "/",
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED
)
def crear_producto(
    data: ProductoCreate,
    admin: AdminUser,
    session: SessionDep
):
    if categoria_service.obtener_categoria(data.categoria_id, session) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    return producto_service.crear_producto(data, session)


@router.put("/{id_producto}", response_model=ProductoRead)
def actualizar_producto(
    id_producto: int,
    data: ProductoCreate,
    admin: AdminUser,
    session: SessionDep
):
    if categoria_service.obtener_categoria(data.categoria_id, session) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    producto = producto_service.actualizar_producto(id_producto, data, session)

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    return producto


@router.delete("/{id_producto}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    id_producto: int,
    admin: AdminUser,
    session: SessionDep
):
    producto = producto_service.eliminar_producto(id_producto, session)

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
