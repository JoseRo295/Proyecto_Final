from fastapi import APIRouter, HTTPException, status

from db.database import SessionDep
from dependencies.auth import CurrentUser, AdminUser
from schemas.pedido import PedidoRead, PedidoDetalle, PedidoEstado
from services import pedido_service


router = APIRouter(tags=["Pedidos"], prefix="/pedidos")


@router.post(
    "/",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED
)
def crear_pedido(current_user: CurrentUser, session: SessionDep):
    pedido = pedido_service.crear_pedido(current_user.id, session)

    if pedido is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El carrito está vacío o no hay stock suficiente"
        )

    return pedido


@router.get("/", response_model=list[PedidoRead])
def obtener_mis_pedidos(current_user: CurrentUser, session: SessionDep):
    return pedido_service.obtener_pedidos_usuario(current_user.id, session)


@router.get("/todos", response_model=list[PedidoRead])
def obtener_todos_pedidos(admin: AdminUser, session: SessionDep):
    return pedido_service.obtener_todos_pedidos(session)


@router.get("/{id_pedido}", response_model=PedidoDetalle)
def obtener_pedido(
    id_pedido: int,
    current_user: CurrentUser,
    session: SessionDep
):
    pedido = pedido_service.obtener_detalle(id_pedido, current_user, session)

    if pedido is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado"
        )

    return pedido


@router.put("/{id_pedido}/estado", response_model=PedidoRead)
def actualizar_estado(
    id_pedido: int,
    data: PedidoEstado,
    admin: AdminUser,
    session: SessionDep
):
    pedido = pedido_service.actualizar_estado(id_pedido, data.estado, session)

    if pedido is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado"
        )

    return pedido
