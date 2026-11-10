const listaProductos = document.getElementById("lista_productos");
const mensaje = document.getElementById("mensaje");
const campoBuscar = document.getElementById("buscar");
const selectCategoria = document.getElementById("categoria");

const parametros = new URLSearchParams(window.location.search);
const buscar = parametros.get("buscar") || "";
const categoria = parametros.get("categoria") || "";

campoBuscar.value = buscar;

async function cargarCategorias() {
  const respuesta = await fetch(API_URL + "/categorias/");
  const categorias = await respuesta.json();

  categorias.forEach((item) => {
    const opcion = document.createElement("option");
    opcion.value = item.id;
    opcion.textContent = item.nombre;
    selectCategoria.append(opcion);
  });

  selectCategoria.value = categoria;
}

async function cargarProductos() {
  const consulta = new URLSearchParams();
  if (buscar) {
    consulta.append("buscar", buscar);
  }
  if (categoria) {
    consulta.append("categoria_id", categoria);
  }

  try {
    const respuesta = await fetch(API_URL + "/productos/?" + consulta.toString());
    const productos = await respuesta.json();

    listaProductos.replaceChildren();

    if (productos.length === 0) {
      mostrarMensaje(mensaje, "No se encontraron productos.", "");
      return;
    }

    mostrarMensaje(mensaje, productos.length + " producto(s) encontrados.", "");
    productos.forEach((producto) => {
      listaProductos.append(crearTarjeta(producto));
    });
  } catch (error) {
    mostrarMensaje(mensaje, "No se pudo conectar con el servidor.", "error");
  }
}

cargarEncabezado();
cargarCategorias();
cargarProductos();
