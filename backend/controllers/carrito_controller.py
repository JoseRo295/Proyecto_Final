from fastapi import APIRouter, HTTPException, status

from db.database import SessionDep
from dependencies.auth import CurrentUser
from schemas.carrito import CarritoItemCreate, CarritoItemUpdate, CarritoRead
from services import carrito_service, producto_service


router = APIRouter(tags=["Carrito"], prefix="/carrito")


@router.get("/", response_model=CarritoRead)
def obtener_carrito(current_user: CurrentUser, session: SessionDep):
    return carrito_service.obtener_carrito(current_user.id, session)


@router.post(
    "/items",
    response_model=CarritoRead,
    status_code=status.HTTP_201_CREATED
)
def agregar_producto(
    data: CarritoItemCreate,
    current_user: CurrentUser,
    session: SessionDep
):
    if producto_service.obtener_producto(data.producto_id, session) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    item = carrito_service.agregar_producto(current_user.id, data, session)

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No hay stock suficiente"
        )

    return carrito_service.obtener_carrito(current_user.id, session)


@router.put("/items/{id_item}", response_model=CarritoRead)
def actualizar_cantidad(
    id_item: int,
    data: CarritoItemUpdate,
    current_user: CurrentUser,
    session: SessionDep
):
    if carrito_service.obtener_item(current_user.id, id_item, session) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado en el carrito"
        )

    item = carrito_service.actualizar_cantidad(current_user.id, id_item, data.cantidad, session)

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No hay stock suficiente"
        )

    return carrito_service.obtener_carrito(current_user.id, session)


@router.delete("/items/{id_item}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_item(
    id_item: int,
    current_user: CurrentUser,
    session: SessionDep
):
    item = carrito_service.eliminar_item(current_user.id, id_item, session)

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado en el carrito"
        )
