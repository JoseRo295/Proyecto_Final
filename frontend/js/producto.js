const detalle = document.getElementById("detalle");
const mensajeProducto = document.getElementById("mensaje_producto");
const mensaje = document.getElementById("mensaje");
const campoCantidad = document.getElementById("cantidad");
const botonAgregar = document.getElementById("boton_agregar");

const idProducto = new URLSearchParams(window.location.search).get("id");

let producto = null;
let usuario = null;

async function cargarProducto() {
  try {
    const respuesta = await fetch(API_URL + "/productos/" + idProducto);

    if (!respuesta.ok) {
      mostrarMensaje(mensajeProducto, "Producto no encontrado.", "error");
      return;
    }

    producto = await respuesta.json();

    document.getElementById("imagen").src = producto.imagen;
    document.getElementById("imagen").alt = producto.nombre;
    document.getElementById("nombre").textContent = producto.nombre;
    document.getElementById("descripcion").textContent = producto.descripcion || "";
    document.getElementById("precio").textContent = formatearPrecio(producto.precio);

    const stock = document.getElementById("stock");
    if (producto.stock > 0) {
      stock.className = "disponible";
      stock.textContent = "Stock disponible: " + producto.stock + " unidades";
      campoCantidad.max = producto.stock;
    } else {
      stock.className = "agotado";
      stock.textContent = "Producto agotado";
      campoCantidad.disabled = true;
      botonAgregar.disabled = true;
    }

    const respuestaCategoria = await fetch(API_URL + "/categorias/" + producto.categoria_id);
    if (respuestaCategoria.ok) {
      const categoria = await respuestaCategoria.json();
      document.getElementById("categoria").textContent = "Categoría: " + categoria.nombre;
    }

    detalle.classList.remove("oculto");
  } catch (error) {
    mostrarMensaje(mensajeProducto, "No se pudo conectar con el servidor.", "error");
  }
}

async function agregarAlCarrito() {
  if (!usuario) {
    mostrarMensaje(mensaje, "Debes iniciar sesión para agregar productos al carrito.", "error");
    return;
  }

  const cantidad = Number(campoCantidad.value);

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    mostrarMensaje(mensaje, "Ingresa una cantidad válida.", "error");
    return;
  }

  if (cantidad > producto.stock) {
    mostrarMensaje(mensaje, "Solo hay " + producto.stock + " unidades disponibles.", "error");
    return;
  }

  try {
    const respuesta = await fetch(API_URL + "/carrito/items", {
      method: "POST",
      headers: cabeceras(),
      body: JSON.stringify({ producto_id: producto.id, cantidad: cantidad }),
    });

    if (!respuesta.ok) {
      mostrarMensaje(mensaje, await leerError(respuesta), "error");
      return;
    }

    mostrarMensaje(mensaje, "Producto agregado al carrito.", "exito");
  } catch (error) {
    mostrarMensaje(mensaje, "No se pudo conectar con el servidor.", "error");
  }
}

async function iniciar() {
  usuario = await cargarEncabezado();
  cargarProducto();
}

botonAgregar.addEventListener("click", agregarAlCarrito);

iniciar();
