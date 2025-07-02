document.addEventListener("DOMContentLoaded", function () {
const botonReg = document.getElementById("CrearUs");
  if (botonReg) {
    botonReg.addEventListener("click", function (e) {
      e.preventDefault();
      const usuario = document.getElementById("usuarioReg").value;
      const email = document.getElementById("emailReg").value;
      const contrasena = document.getElementById("contrasenaReg").value;

      localStorage.setItem("usuario", usuario);
      localStorage.setItem("email", email);
      localStorage.setItem("contrasena", contrasena);

      mostrarAlerta(`Usuario ${usuario} creado correctamente.`);
    });
  }

  // 🔐 Login
  const botonLogin = document.getElementById("btnlogin");
  if (botonLogin) {
    botonLogin.addEventListener("click", function (e) {
      e.preventDefault();

      const usuarioIngresado = document.getElementById("usuarioLogin").value;
      const contrasenaIngresada = document.getElementById("contrasenaLogin").value;
      const usuarioGuardado = localStorage.getItem("usuario");
      const contrasenaGuardada = localStorage.getItem("contrasena");

      if (usuarioIngresado === usuarioGuardado && contrasenaIngresada === contrasenaGuardada) {
        mostrarAlerta('Inicio de sesión exitoso');
        localStorage.setItem('usuarioActual', usuarioIngresado);

        if (usuarioIngresado === 'admin') {
          localStorage.setItem('isAdmin', 'true');
          window.location.href = 'Admin.html';
        } else {
          localStorage.removeItem('isAdmin');
          window.location.href = 'categorias.html';
        }
      } else {
        mostrarAlerta('Usuario o contraseña incorrectos');
      }
    });
  }
});