from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import crear_tablas
from controllers.auth_controller import router as auth_router
from controllers.categoria_controller import router as categoria_router
from controllers.producto_controller import router as producto_router
from controllers.carrito_controller import router as carrito_router
from controllers.pedido_controller import router as pedido_router

app = FastAPI(title="Tienda Virtual", lifespan=crear_tablas)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(carrito_router)
app.include_router(pedido_router)
