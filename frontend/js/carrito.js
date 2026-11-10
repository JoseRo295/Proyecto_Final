const listaItems = document.getElementById("lista_items");
const mensaje = document.getElementById("mensaje");
const total = document.getElementById("total");
const botonComprar = document.getElementById("boton_comprar");

function crearFila(item) {
  const fila = document.createElement("article");
  fila.className = "fila_item";

  const imagen = document.createElement("img");
  imagen.src = item.imagen;
  imagen.alt = item.nombre;

  const datos = document.createElement("div");
  datos.className = "datos";

  const nombre = document.createElement("h3");
  nombre.textContent = item.nombre;

  const precio = document.createElement("p");
  precio.textContent = "Precio: " + formatearPrecio(item.precio) + " | Stock: " + item.stock;

  const subtotal = document.createElement("p");
  subtotal.textContent = "Subtotal: " + formatearPrecio(item.subtotal);

  datos.append(nombre, precio, subtotal);

  const cantidad = document.createElement("input");
  cantidad.type = "number";
  cantidad.min = 1;
  cantidad.max = item.stock;
  cantidad.value = item.cantidad;
  cantidad.addEventListener("change", () => actualizarCantidad(item, cantidad.value));

  const botonEliminar = document.createElement("button");
  botonEliminar.className = "boton boton_rojo boton_pequeno";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.addEventListener("click", () => eliminarItem(item.id));

  fila.append(imagen, datos, cantidad, botonEliminar);
  return fila;
}

async function cargarCarrito() {
  try {
    const respuesta = await fetch(API_URL + "/carrito/", { headers: cabeceras() });
    const carrito = await respuesta.json();

    listaItems.replaceChildren();
    total.textContent = formatearPrecio(carrito.total);

    if (carrito.items.length === 0) {
      mostrarMensaje(mensaje, "Tu carrito está vacío.", "");
      botonComprar.disabled = true;
      return;
    }

    botonComprar.disabled = false;
    carrito.items.forEach((item) => {
      listaItems.append(crearFila(item));
    });
  } catch (error) {
    mostrarMensaje(mensaje, "No se pudo conectar con el servidor.", "error");
  }
}

async function actualizarCantidad(item, valor) {
  const cantidad = Number(valor);

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    mostrarMensaje(mensaje, "Ingresa una cantidad válida.", "error");
    cargarCarrito();
    return;
  }

  if (cantidad > item.stock) {
    mostrarMensaje(mensaje, "Solo hay " + item.stock + " unidades de " + item.nombre + ".", "error");
    cargarCarrito();
    return;
  }

  const respuesta = await fetch(API_URL + "/carrito/items/" + item.id, {
    method: "PUT",
    headers: cabeceras(),
    body: JSON.stringify({ cantidad: cantidad }),
  });

  if (!respuesta.ok) {
    mostrarMensaje(mensaje, await leerError(respuesta), "error");
  } else {
    mostrarMensaje(mensaje, "Cantidad actualizada.", "exito");
  }

  cargarCarrito();
}

async function eliminarItem(id) {
  const respuesta = await fetch(API_URL + "/carrito/items/" + id, {
    method: "DELETE",
    headers: cabeceras(),
  });

  if (respuesta.ok) {
    mostrarMensaje(mensaje, "Producto eliminado del carrito.", "exito");
  }

  cargarCarrito();
}

async function confirmarCompra() {
  if (!confirm("¿Deseas confirmar la compra?")) {
    return;
  }

  const respuesta = await fetch(API_URL + "/pedidos/", {
    method: "POST",
    headers: cabeceras(),
  });

  if (!respuesta.ok) {
    mostrarMensaje(mensaje, await leerError(respuesta), "error");
    return;
  }

  window.location.href = "pedidos.html";
}

async function iniciar() {
  const usuario = await cargarEncabezado();

  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  cargarCarrito();
}

botonComprar.addEventListener("click", confirmarCompra);

iniciar();
