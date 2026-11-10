const listaDestacados = document.getElementById("lista_destacados");
const mensajeDestacados = document.getElementById("mensaje_destacados");
const listaCategorias = document.getElementById("lista_categorias");

async function cargarDestacados() {
  try {
    const respuesta = await fetch(API_URL + "/productos/aleatorios?cantidad=4");
    const productos = await respuesta.json();

    listaDestacados.replaceChildren();
    productos.forEach((producto) => {
      listaDestacados.append(crearTarjeta(producto));
    });
  } catch (error) {
    mostrarMensaje(mensajeDestacados, "No se pudo conectar con el servidor.", "error");
  }
}

async function cargarCategorias() {
  try {
    const respuesta = await fetch(API_URL + "/categorias/");
    const categorias = await respuesta.json();

    listaCategorias.replaceChildren();
    categorias.forEach((categoria) => {
      const tarjeta = document.createElement("a");
      tarjeta.className = "tarjeta_categoria";
      tarjeta.href = "catalogo.html?categoria=" + categoria.id;

      const nombre = document.createElement("h3");
      nombre.textContent = categoria.nombre;

      const descripcion = document.createElement("p");
      descripcion.textContent = categoria.descripcion || "";

      tarjeta.append(nombre, descripcion);
      listaCategorias.append(tarjeta);
    });
  } catch (error) {
    mostrarMensaje(mensajeDestacados, "No se pudo conectar con el servidor.", "error");
  }
}

cargarEncabezado();
cargarDestacados();
cargarCategorias();
