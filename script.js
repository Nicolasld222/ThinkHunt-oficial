document.addEventListener("DOMContentLoaded", function () {
  // 🔁 Aplicar estilos globales si existen
  const coloresGlobales = JSON.parse(localStorage.getItem("coloresCustom"));
  if (coloresGlobales) {
    aplicarEstilos(coloresGlobales);
  }

  // 🧑‍💻 Registro de usuario
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

  // 🎨 Panel de administrador
  const esAdmin = window.location.pathname.includes("Admin.html");
  if (esAdmin) {
    const fondoBase = document.getElementById("colorFondoBase");
    const fondoGradiente = document.getElementById("colorFondoGradiente");
    const boton1 = document.getElementById("colorBoton1");
    const boton2 = document.getElementById("colorBoton2");
    const textoBoton = document.getElementById("colorTextoBoton");
    const textoGeneral = document.getElementById("colorTextoGeneral");
    const guardarBtn = document.getElementById("guardarEstilos");

    aplicarEstilosGuardados();

    if (guardarBtn) {
      guardarBtn.addEventListener("click", () => {
        const colores = {
          fondoBase: fondoBase.value,
          fondoGradiente: fondoGradiente.value,
          boton1: boton1.value,
          boton2: boton2.value,
          textoBoton: textoBoton.value,
          textoGeneral: textoGeneral.value,
        };

        localStorage.setItem("coloresCustom", JSON.stringify(colores));
        aplicarEstilos(colores);
        alert("Estilos guardados correctamente.");
      });
    }

    function aplicarEstilosGuardados() {
      const colores = JSON.parse(localStorage.getItem("coloresCustom"));
      if (!colores) return;

      fondoBase.value = colores.fondoBase;
      fondoGradiente.value = colores.fondoGradiente;
      boton1.value = colores.boton1;
      boton2.value = colores.boton2;
      textoBoton.value = colores.textoBoton;
      textoGeneral.value = colores.textoGeneral;

      aplicarEstilos(colores);
    }
  }

  // 🎮 Botones de categorías
  const categorias = [
    { id: 'button-animal', url: 'AnimalesCat.html' },
    { id: 'button-famoso', url: 'FamososCat.html' },
    { id: 'button-objeto', url: 'ObjectosCat.html' },
    { id: 'button-videojuego', url: 'VideoJuegosCat.html' }
  ];

  categorias.forEach(({ id, url }) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => window.location.href = url);
  });

  const esPaginaCategoria = categorias.some(c => window.location.pathname.includes(c.url));
  if (esPaginaCategoria) {
    inicializarJuegoBasico();
    const respuestas = [
      { id: 'Yes', val: 'Sí' },
      { id: 'No', val: 'No' },
      { id: 'NoSeSabe', val: 'No sé' },
      { id: 'Maybe', val: 'Tal vez' }
    ];
    respuestas.forEach(({ id, val }) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => procesarRespuestaBasica(val));
    });
  }
});

// 🎨 Aplicar estilos en cualquier página
function aplicarEstilos(colores) {
  const estilo = document.getElementById("estilo-admin") || document.createElement("style");
  estilo.id = "estilo-admin";
  estilo.innerHTML = `
    body {
    background: linear-gradient(180deg, ${colores.fondoBase} 65%, ${colores.fondoGradiente
    } 80%, ${colores.fondoGradiente} 100%) !important;
    }

    .particle {
      background: ${colores.fondoGradiente} !important;
      filter: drop-shadow(0 0 6px ${colores.fondoGradiente}) !important;
    }

    button, .button-green {
      background: linear-gradient(90deg, ${colores.boton1} 50%, ${colores.boton2} 100%) !important;
      color: ${colores.textoBoton} !important;
    }

    h1, h2, p, a, label {
      color: ${colores.textoGeneral} !important;
    }
  `;
  if (!document.getElementById("estilo-admin")) {
    document.head.appendChild(estilo);
  }
}

// 💬 IA lógica (no modificada, puedes mantener la tuya)
const GEMINI_API_KEY = 'AIzaSyDHXI-o5Seo3QuEanDaH6JgkbBRlc1OqZc';
let historialIA = [];
let preguntaActual = "";

async function inicializarJuegoBasico() {
  const categoria = obtenerCategoriaBasica();
  historialIA = [];

  const prompt = `
    Estás jugando a adivinar en qué está pensando el usuario en la categoría "${categoria}".
    Haz preguntas cerradas que puedan responderse con: Sí, No, Tal vez o No sé.
    Cuando creas que sabes la respuesta, haz una suposición final con este formato exacto:
    "He adivinado tu ${categoria}: es un [respuesta]".
    Solo responde con una pregunta o suposición. Responde en español.`;

  try {
    mostrarCargando();
    const pregunta = await llamarGemini(prompt);
    preguntaActual = pregunta.trim();
    mostrarPregunta(preguntaActual);
  } catch (error) {
    mostrarError('Error al inicializar la IA.');
  }
}

async function procesarRespuestaBasica(respuestaUsuario) {
  const categoria = obtenerCategoriaBasica();
  historialIA.push({ pregunta: preguntaActual, respuesta: respuestaUsuario });

  const historialTexto = historialIA.map(item => `IA: ${item.pregunta}\nUsuario: ${item.respuesta}`).join('\n');

  const prompt = `
    Estás jugando a adivinar en menos preguntas posibles en la categoría "${categoria}".
    Aquí está la conversación hasta ahora:
    ${historialTexto}
    Recuerda: responde con una nueva pregunta o con:
    "He adivinado tu ${categoria}: es un [respuesta]"`;

  try {
    mostrarCargando();
    const siguientePregunta = await llamarGemini(prompt);
    preguntaActual = siguientePregunta.trim();
    mostrarPregunta(preguntaActual);

    if (preguntaActual.toLowerCase().includes(`he adivinado tu ${categoria}`)) {
      mostrarAlerta(`🎯 ¡La IA adivinó tu ${categoria}!\n${preguntaActual}`);
      mostrarPregunta("🎉 ¡Gracias por jugar!");
      ['Yes', 'No', 'NoSeSabe', 'Maybe'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = true;
      });
    }

  } catch (error) {
    console.error("Error:", error);
    mostrarError('Error al generar la pregunta.');
  }
}

function obtenerCategoriaBasica() {
  const url = window.location.pathname;
  if (url.includes("AnimalesCat")) return "animales";
  if (url.includes("FamososCat")) return "famosos";
  if (url.includes("ObjetosCat")) return "objetos";
  if (url.includes("VideoJuegosCat")) return "videojuegos";
  return "general";
}

function mostrarPregunta(pregunta) {
  const respuestaDiv = document.getElementById('respuesta');
  if (respuestaDiv) {
    respuestaDiv.innerHTML = `<p>${pregunta}</p>`;
    respuestaDiv.style.display = 'block';
  }
}

function mostrarCargando() {
  const respuestaDiv = document.getElementById('respuesta');
  if (respuestaDiv) {
    respuestaDiv.innerHTML = '<p>Pensando... 🤔</p>';
    respuestaDiv.style.display = 'block';
  }
}

function mostrarError(mensaje) {
  const respuestaDiv = document.getElementById('respuesta');
  if (respuestaDiv) {
    respuestaDiv.innerHTML = `<p style="color: #ff6b6b;">${mensaje}</p>`;
    respuestaDiv.style.display = 'block';
  }
}

async function llamarGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const body = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta de Gemini.';
  } catch (error) {
    return "Error al conectar con la IA.";
  }
}

function mostrarAlerta(mensaje) {
  const alerta = document.getElementById('alerta-personalizada');
  const mensajeElemento = document.getElementById('mensaje-alerta');
  if (alerta && mensajeElemento) {
    mensajeElemento.textContent = mensaje;
    alerta.classList.remove('alerta-oculta');
  }
}

function ocultarAlerta() {
  const alerta = document.getElementById('alerta-personalizada');
  if (alerta) {
    alerta.classList.add('alerta-oculta');
  }
}
