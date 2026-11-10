const ESTADOS = ["pendiente", "procesando", "enviado", "entregado"];

const formularioCategoria = document.getElementById("formulario_categoria");
const listaCategorias = document.getElementById("lista_categorias");
const mensajeCategoria = document.getElementById("mensaje_categoria");
const cancelarCategoria = document.getElementById("cancelar_categoria");

const formularioProducto = document.getElementById("formulario_producto");
const listaProductos = document.getElementById("lista_productos");
const mensajeProducto = document.getElementById("mensaje_producto");
const cancelarProducto = document.getElementById("cancelar_producto");
const selectCategoria = document.getElementById("producto_categoria");

const listaPedidos = document.getElementById("lista_pedidos");
const mensajePedidos = document.getElementById("mensaje_pedidos");

let categorias = [];
let categoriaEditando = null;
let productoEditando = null;

function crearBoton(texto, clase, accion) {
  const boton = document.createElement("button");
  boton.className = "boton boton_pequeno " + clase;
  boton.textContent = texto;
  boton.addEventListener("click", accion);
  return boton;
}

function nombreCategoria(id) {
  const categoria = categorias.find((item) => item.id === id);
  return categoria ? categoria.nombre : "Sin categoría";
}

async function cargarCategorias() {
  const respuesta = await fetch(API_URL + "/categorias/");
  categorias = await respuesta.json();

  listaCategorias.replaceChildren();
  selectCategoria.replaceChildren();

  categorias.forEach((categoria) => {
    const fila = document.createElement("article");
    fila.className = "fila_item";

    const datos = document.createElement("div");
    datos.className = "datos";

    const nombre = document.createElement("h3");
    nombre.textContent = categoria.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = categoria.descripcion || "";

    datos.append(nombre, descripcion);

    const acciones = document.createElement("div");
    acciones.className = "acciones";
    acciones.append(
      crearBoton("Editar", "boton_gris", () => editarCategoria(categoria)),
      crearBoton("Eliminar", "boton_rojo", () => eliminarCategoria(categoria.id))
    );

    fila.append(datos, acciones);
    listaCategorias.append(fila);

    const opcion = document.createElement("option");
    opcion.value = categoria.id;
    opcion.textContent = categoria.nombre;
    selectCategoria.append(opcion);
  });
}

function editarCategoria(categoria) {
  categoriaEditando = categoria.id;
  document.getElementById("categoria_nombre").value = categoria.nombre;
  document.getElementById("categoria_descripcion").value = categoria.descripcion || "";
  document.getElementById("titulo_categoria").textContent = "Editar categoría #" + categoria.id;
  cancelarCategoria.classList.remove("oculto");
}

function limpiarCategoria() {
  categoriaEditando = null;
  formularioCategoria.reset();
  document.getElementById("titulo_categoria").textContent = "Nueva categoría";
  cancelarCategoria.classList.add("oculto");
}

async function guardarCategoria(evento) {
  evento.preventDefault();

  const datos = {
    nombre: document.getElementById("categoria_nombre").value.trim(),
    descripcion: document.getElementById("categoria_descripcion").value.trim(),
  };

  const editando = categoriaEditando !== null;
  const url = editando ? API_URL + "/categorias/" + categoriaEditando : API_URL + "/categorias/";

  const respuesta = await fetch(url, {
    method: editando ? "PUT" : "POST",
    headers: cabeceras(),
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    mostrarMensaje(mensajeCategoria, await leerError(respuesta), "error");
    return;
  }

  limpiarCategoria();
  mostrarMensaje(mensajeCategoria, editando ? "Categoría actualizada." : "Categoría creada.", "exito");
  await cargarCategorias();
  cargarProductos();
}

async function eliminarCategoria(id) {
  if (!confirm("¿Deseas eliminar esta categoría?")) {
    return;
  }

  const respuesta = await fetch(API_URL + "/categorias/" + id, {
    method: "DELETE",
    headers: cabeceras(),
  });

  if (!respuesta.ok) {
    mostrarMensaje(mensajeCategoria, await leerError(respuesta), "error");
    return;
  }

  mostrarMensaje(mensajeCategoria, "Categoría eliminada.", "exito");
  await cargarCategorias();
  cargarProductos();
}

async function cargarProductos() {
  const respuesta = await fetch(API_URL + "/productos/");
  const productos = await respuesta.json();

  listaProductos.replaceChildren();

  productos.forEach((producto) => {
    const fila = document.createElement("article");
    fila.className = "fila_item";

    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;

    const datos = document.createElement("div");
    datos.className = "datos";

    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre;

    const detalle = document.createElement("p");
    detalle.textContent =
      nombreCategoria(producto.categoria_id) + " | " + formatearPrecio(producto.precio) + " | Stock: " + producto.stock;

    datos.append(nombre, detalle);

    const acciones = document.createElement("div");
    acciones.className = "acciones";
    acciones.append(
      crearBoton("Editar", "boton_gris", () => editarProducto(producto)),
      crearBoton("Eliminar", "boton_rojo", () => eliminarProducto(producto.id))
    );

    fila.append(imagen, datos, acciones);
    listaProductos.append(fila);
  });
}

function editarProducto(producto) {
  productoEditando = producto.id;
  document.getElementById("producto_nombre").value = producto.nombre;
  document.getElementById("producto_descripcion").value = producto.descripcion || "";
  document.getElementById("producto_precio").value = producto.precio;
  document.getElementById("producto_stock").value = producto.stock;
  document.getElementById("producto_imagen").value = producto.imagen;
  selectCategoria.value = producto.categoria_id;
  document.getElementById("titulo_producto").textContent = "Editar producto #" + producto.id;
  cancelarProducto.classList.remove("oculto");
  formularioProducto.scrollIntoView();
}

function limpiarProducto() {
  productoEditando = null;
  formularioProducto.reset();
  document.getElementById("titulo_producto").textContent = "Nuevo producto";
  cancelarProducto.classList.add("oculto");
}

async function guardarProducto(evento) {
  evento.preventDefault();

  const datos = {
    nombre: document.getElementById("producto_nombre").value.trim(),
    descripcion: document.getElementById("producto_descripcion").value.trim(),
    precio: Number(document.getElementById("producto_precio").value),
    stock: Number(document.getElementById("producto_stock").value),
    imagen: document.getElementById("producto_imagen").value.trim(),
    categoria_id: Number(selectCategoria.value),
  };

  if (datos.precio <= 0 || !Number.isInteger(datos.stock) || datos.stock < 0) {
    mostrarMensaje(mensajeProducto, "Revisa el precio y el stock.", "error");
    return;
  }

  const editando = productoEditando !== null;
  const url = editando ? API_URL + "/productos/" + productoEditando : API_URL + "/productos/";

  const respuesta = await fetch(url, {
    method: editando ? "PUT" : "POST",
    headers: cabeceras(),
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    mostrarMensaje(mensajeProducto, await leerError(respuesta), "error");
    return;
  }

  limpiarProducto();
  mostrarMensaje(mensajeProducto, editando ? "Producto actualizado." : "Producto creado.", "exito");
  cargarProductos();
}

async function eliminarProducto(id) {
  if (!confirm("¿Deseas eliminar este producto?")) {
    return;
  }

  const respuesta = await fetch(API_URL + "/productos/" + id, {
    method: "DELETE",
    headers: cabeceras(),
  });

  if (!respuesta.ok) {
    mostrarMensaje(mensajeProducto, await leerError(respuesta), "error");
    return;
  }

  mostrarMensaje(mensajeProducto, "Producto eliminado.", "exito");
  cargarProductos();
}

async function cargarPedidos() {
  const respuesta = await fetch(API_URL + "/pedidos/todos", { headers: cabeceras() });
  const pedidos = await respuesta.json();

  listaPedidos.replaceChildren();

  if (pedidos.length === 0) {
    mostrarMensaje(mensajePedidos, "No hay pedidos registrados.", "");
    return;
  }

  pedidos.forEach((pedido) => {
    const fila = document.createElement("article");
    fila.className = "fila_item";

    const datos = document.createElement("div");
    datos.className = "datos";

    const titulo = document.createElement("h3");
    titulo.textContent = "Pedido #" + pedido.id + " - Usuario #" + pedido.usuario_id;

    const detalle = document.createElement("p");
    detalle.textContent = new Date(pedido.fecha).toLocaleString() + " | Total: " + formatearPrecio(pedido.total);

    datos.append(titulo, detalle);

    const selectEstado = document.createElement("select");
    ESTADOS.forEach((estado) => {
      const opcion = document.createElement("option");
      opcion.value = estado;
      opcion.textContent = estado;
      selectEstado.append(opcion);
    });
    selectEstado.value = pedido.estado;

    fila.append(
      datos,
      selectEstado,
      crearBoton("Guardar estado", "", () => cambiarEstado(pedido.id, selectEstado.value))
    );
    listaPedidos.append(fila);
  });
}

async function cambiarEstado(id, estado) {
  const respuesta = await fetch(API_URL + "/pedidos/" + id + "/estado", {
    method: "PUT",
    headers: cabeceras(),
    body: JSON.stringify({ estado: estado }),
  });

  if (!respuesta.ok) {
    mostrarMensaje(mensajePedidos, await leerError(respuesta), "error");
    return;
  }

  mostrarMensaje(mensajePedidos, "Estado del pedido #" + id + " actualizado a " + estado + ".", "exito");
}

async function iniciar() {
  const usuario = await cargarEncabezado();

  if (!usuario || usuario.rol !== "admin") {
    window.location.href = "index.html";
    return;
  }

  await cargarCategorias();
  cargarProductos();
  cargarPedidos();
}

formularioCategoria.addEventListener("submit", guardarCategoria);
cancelarCategoria.addEventListener("click", limpiarCategoria);
formularioProducto.addEventListener("submit", guardarProducto);
cancelarProducto.addEventListener("click", limpiarProducto);

iniciar();
