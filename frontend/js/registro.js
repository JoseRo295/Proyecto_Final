const formularioRegistro = document.getElementById("formulario_registro");
const mensaje = document.getElementById("mensaje");

async function registrar(evento) {
  evento.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (password.length < 8) {
    mostrarMensaje(mensaje, "La contraseña debe tener al menos 8 caracteres.", "error");
    return;
  }

  try {
    const respuesta = await fetch(API_URL + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    if (!respuesta.ok) {
      mostrarMensaje(mensaje, await leerError(respuesta), "error");
      return;
    }

    formularioRegistro.reset();
    mostrarMensaje(mensaje, "Cuenta creada correctamente. Ya puedes iniciar sesión.", "exito");
  } catch (error) {
    mostrarMensaje(mensaje, "No se pudo conectar con el servidor.", "error");
  }
}

formularioRegistro.addEventListener("submit", registrar);

cargarEncabezado();
