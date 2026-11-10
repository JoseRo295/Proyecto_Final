const formularioLogin = document.getElementById("formulario_login");
const mensaje = document.getElementById("mensaje");

async function iniciarSesion(evento) {
  evento.preventDefault();

  const datos = new URLSearchParams();
  datos.append("username", document.getElementById("email").value.trim());
  datos.append("password", document.getElementById("password").value);

  try {
    const respuesta = await fetch(API_URL + "/auth/login", {
      method: "POST",
      body: datos,
    });

    if (!respuesta.ok) {
      mostrarMensaje(mensaje, "Email o contraseña incorrectos.", "error");
      return;
    }

    const token = await respuesta.json();
    localStorage.setItem("token", token.access_token);
    window.location.href = "index.html";
  } catch (error) {
    mostrarMensaje(mensaje, "No se pudo conectar con el servidor.", "error");
  }
}

formularioLogin.addEventListener("submit", iniciarSesion);

cargarEncabezado();
