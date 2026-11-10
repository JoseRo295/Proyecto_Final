from sqlmodel import select

from models.usuario import Usuario
from models.categoria import Categoria
from models.producto import Producto
from core.security import hash_password


def cargar_datos_iniciales(session):
    admin = session.exec(
        select(Usuario).where(Usuario.rol == "admin")
    ).first()

    if admin is None:
        admin = Usuario(
            nombre="Administrador",
            email="admin@tienda.com",
            password=hash_password("admin12345"),
            rol="admin"
        )
        session.add(admin)
        session.commit()

    if session.exec(select(Categoria)).first() is not None:
        return

    laptops = Categoria(nombre="Laptops", descripcion="Computadoras portátiles para trabajo y estudio")
    celulares = Categoria(nombre="Celulares", descripcion="Teléfonos inteligentes para todos los gustos")
    hogar = Categoria(nombre="Hogar", descripcion="Muebles para cada espacio de tu casa")
    deportes = Categoria(nombre="Deportes", descripcion="Artículos para practicar tu deporte favorito")

    for categoria in [laptops, celulares, hogar, deportes]:
        session.add(categoria)
    session.commit()

    productos = [
        Producto(nombre="MacBook Pro 14", descripcion="Laptop Apple con pantalla Retina de 14 pulgadas y 16 GB de RAM.", precio=1999.99, stock=5, imagen="Assets/laptops/macbook_pro.webp", categoria_id=laptops.id),
        Producto(nombre="Asus Zenbook Pro Duo", descripcion="Laptop con doble pantalla ideal para diseño y programación.", precio=1499.00, stock=4, imagen="Assets/laptops/asus_zenbook.webp", categoria_id=laptops.id),
        Producto(nombre="Huawei MateBook X Pro", descripcion="Laptop ultradelgada con pantalla táctil 3K.", precio=1199.50, stock=6, imagen="Assets/laptops/huawei_matebook.webp", categoria_id=laptops.id),
        Producto(nombre="iPhone 13 Pro", descripcion="Triple cámara, pantalla de 120 Hz y 128 GB de almacenamiento.", precio=999.00, stock=8, imagen="Assets/celulares/iphone_13_pro.webp", categoria_id=celulares.id),
        Producto(nombre="iPhone X", descripcion="Pantalla OLED de 5.8 pulgadas con Face ID.", precio=499.99, stock=3, imagen="Assets/celulares/iphone_x.webp", categoria_id=celulares.id),
        Producto(nombre="iPhone 6", descripcion="Celular de 4.7 pulgadas ideal para uso básico.", precio=149.90, stock=10, imagen="Assets/celulares/iphone_6.webp", categoria_id=celulares.id),
        Producto(nombre="Sofá de cuero", descripcion="Sofá de tres puestos tapizado en cuero.", precio=899.00, stock=2, imagen="Assets/hogar/sofa.webp", categoria_id=hogar.id),
        Producto(nombre="Cama de dos plazas", descripcion="Cama con cabecera acolchada y base de madera.", precio=749.00, stock=3, imagen="Assets/hogar/cama.webp", categoria_id=hogar.id),
        Producto(nombre="Velador de madera", descripcion="Mesa de noche de cerezo con un cajón.", precio=129.99, stock=7, imagen="Assets/hogar/velador.webp", categoria_id=hogar.id),
        Producto(nombre="Balón de básquet", descripcion="Balón tamaño 7 para interiores y exteriores.", precio=29.99, stock=20, imagen="Assets/deportes/balon_basket.webp", categoria_id=deportes.id),
        Producto(nombre="Guante de béisbol", descripcion="Guante de cuero para jugadores de campo.", precio=45.50, stock=12, imagen="Assets/deportes/guante_beisbol.webp", categoria_id=deportes.id),
        Producto(nombre="Balón de fútbol americano", descripcion="Balón de cuero con costuras reforzadas.", precio=34.99, stock=15, imagen="Assets/deportes/balon_futbol_americano.webp", categoria_id=deportes.id),
    ]

    for producto in productos:
        session.add(producto)
    session.commit()
