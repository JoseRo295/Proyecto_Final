const listaPedidos = document.getElementById("lista_pedidos");
const mensaje = document.getElementById("mensaje");
const seccionDetalle = document.getElementById("seccion_detalle");
const listaDetalle = document.getElementById("lista_detalle");

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString();
}

function crearFilaPedido(pedido) {
  const fila = document.createElement("article");
  fila.className = "fila_item";

  const datos = document.createElement("div");
  datos.className = "datos";

  const titulo = document.createElement("h3");
  titulo.textContent = "Pedido #" + pedido.id;

  const fecha = document.createElement("p");
  fecha.textContent = formatearFecha(pedido.fecha) + " | Total: " + formatearPrecio(pedido.total);

  datos.append(titulo, fecha);

  const estado = document.createElement("span");
  estado.className = "estado";
  estado.textContent = pedido.estado;

  const boton = document.createElement("button");
  boton.className = "boton boton_pequeno";
  boton.textContent = "Ver detalle";
  boton.addEventListener("click", () => verDetalle(pedido.id));

  fila.append(datos, estado, boton);
  return fila;
}

async function cargarPedidos() {
  try {
    const respuesta = await fetch(API_URL + "/pedidos/", { headers: cabeceras() });
    const pedidos = await respuesta.json();

    listaPedidos.replaceChildren();

    if (pedidos.length === 0) {
      mostrarMensaje(mensaje, "Todavía no has realizado pedidos.", "");
      return;
    }

    pedidos.forEach((pedido) => {
      listaPedidos.append(crearFilaPedido(pedido));
    });
  } catch (error) {
    mostrarMensaje(mensaje, "No se pudo conectar con el servidor.", "error");
  }
}

async function verDetalle(id) {
  const respuesta = await fetch(API_URL + "/pedidos/" + id, { headers: cabeceras() });

  if (!respuesta.ok) {
    mostrarMensaje(mensaje, await leerError(respuesta), "error");
    return;
  }

  const pedido = await respuesta.json();

  document.getElementById("titulo_detalle").textContent = "Detalle del pedido #" + pedido.id;
  document.getElementById("total_detalle").textContent = "Total: " + formatearPrecio(pedido.total);
  document.getElementById("estado_detalle").textContent = pedido.estado;

  listaDetalle.replaceChildren();
  pedido.items.forEach((item) => {
    const fila = document.createElement("article");
    fila.className = "fila_item";

    const datos = document.createElement("div");
    datos.className = "datos";

    const nombre = document.createElement("h3");
    nombre.textContent = item.nombre;

    const cantidad = document.createElement("p");
    cantidad.textContent = item.cantidad + " x " + formatearPrecio(item.precio);

    datos.append(nombre, cantidad);

    const subtotal = document.createElement("p");
    subtotal.textContent = formatearPrecio(item.subtotal);

    fila.append(datos, subtotal);
    listaDetalle.append(fila);
  });

  seccionDetalle.classList.remove("oculto");
  seccionDetalle.scrollIntoView();
}

async function iniciar() {
  const usuario = await cargarEncabezado();

  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("cuenta_nombre").textContent = usuario.nombre;
  document.getElementById("cuenta_email").textContent = usuario.email;
  document.getElementById("cuenta_rol").textContent = usuario.rol;

  cargarPedidos();
}

iniciar();
