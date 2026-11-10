const API_URL = "http://127.0.0.1:8000";

function obtenerToken() {
  return localStorage.getItem("token");
}

function cabeceras() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + obtenerToken(),
  };
}

function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = "mensaje " + tipo;
}

function formatearPrecio(valor) {
  return "$" + valor.toFixed(2);
}

async function leerError(respuesta) {
  const datos = await respuesta.json();
  if (typeof datos.detail === "string") {
    return datos.detail;
  }
  return "Revisa los datos ingresados.";
}

function crearTarjeta(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta_producto";

  const imagen = document.createElement("img");
  imagen.className = "imagen_producto";
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;

  const nombre = document.createElement("h3");
  nombre.className = "nombre_producto";
  nombre.textContent = producto.nombre;

  const descripcion = document.createElement("p");
  descripcion.className = "descripcion_producto";
  let texto = producto.descripcion || "";
  if (texto.length > 60) {
    texto = texto.slice(0, 60) + "...";
  }
  descripcion.textContent = texto;

  const precio = document.createElement("p");
  precio.className = "precio_producto";
  precio.textContent = formatearPrecio(producto.precio);

  const stock = document.createElement("p");
  if (producto.stock > 0) {
    stock.className = "disponible";
    stock.textContent = "Disponible: " + producto.stock + " unidades";
  } else {
    stock.className = "agotado";
    stock.textContent = "Agotado";
  }

  const enlace = document.createElement("a");
  enlace.className = "boton";
  enlace.href = "producto.html?id=" + producto.id;
  enlace.textContent = "Ver detalle";

  tarjeta.append(imagen, nombre, descripcion, precio, stock, enlace);
  return tarjeta;
}

async function obtenerUsuario() {
  if (!obtenerToken()) {
    return null;
  }

  try {
    const respuesta = await fetch(API_URL + "/auth/me", { headers: cabeceras() });

    if (!respuesta.ok) {
      localStorage.removeItem("token");
      return null;
    }

    return await respuesta.json();
  } catch (error) {
    return null;
  }
}

function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

async function cargarEncabezado() {
  const usuario = await obtenerUsuario();

  if (usuario) {
    document.getElementById("enlace_login").classList.add("oculto");
    document.getElementById("enlace_registro").classList.add("oculto");
    document.getElementById("enlace_carrito").classList.remove("oculto");
    document.getElementById("enlace_pedidos").classList.remove("oculto");
    document.getElementById("sesion").classList.remove("oculto");
    document.getElementById("usuario_nombre").textContent = "Hola, " + usuario.nombre;

    if (usuario.rol === "admin") {
      document.getElementById("enlace_admin").classList.remove("oculto");
    }
  }

  return usuario;
}

document.getElementById("boton_salir").addEventListener("click", cerrarSesion);
