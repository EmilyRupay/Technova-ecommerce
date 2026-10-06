/* ==========================================================
   app.js - Lógica de la versión HTML + JavaScript
   1. Referencias al DOM y utilidades
   2. Generación dinámica de las tarjetas
   3. Filtro por categoría y búsqueda
   4. Validación del formulario de contacto
   5. Inicialización
   (El objeto `tienda` con los videojuegos está en datos.js)
   ========================================================== */
'use strict';

/* ---------- 1. REFERENCIAS AL DOM Y UTILIDADES ---------- */
const lista = document.getElementById('lista-videojuegos');
const estadoResultados = document.getElementById('estado-resultados');
const selectCategoria = document.getElementById('filtro-categoria');
const inputTexto = document.getElementById('filtro-texto');
const formFiltros = document.getElementById('form-filtros');
const formContacto = document.getElementById('form-contacto');
const alertaContacto = document.getElementById('alerta-contacto');

// Formato de peso chileno: 39990 -> "$39.990"
const formateadorCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

// Quita tildes y pasa a minúsculas: "accion" encuentra "Acción"
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

// Crea un elemento con clases y texto. textContent evita inyectar HTML.
function crear(etiqueta, clases = '', texto = '') {
  const nodo = document.createElement(etiqueta);
  if (clases) nodo.className = clases;
  if (texto) nodo.textContent = texto;
  return nodo;
}

/* ---------- 2. GENERACIÓN DINÁMICA DE TARJETAS ---------- */

// Crea la tarjeta (article.card de Bootstrap) de un videojuego.
function crearTarjeta(juego) {
  const tarjeta = crear('article', 'card tarjeta-juego h-100');

  const img = crear('img', 'card-img-top');
  img.src = juego.imagen;
  img.alt = juego.alt;
  img.loading = 'lazy';

  const cuerpo = crear('div', 'card-body d-flex flex-column');

  const fila = crear('div', 'd-flex justify-content-between align-items-center gap-2 mb-2');
  fila.append(crear('span', 'badge badge-categoria', juego.categoria));
  fila.append(crear('small', 'text-body-secondary text-end', juego.plataforma));

  cuerpo.append(
    fila,
    crear('h3', 'h5 card-title', juego.nombre),
    crear('p', 'card-text small text-body-secondary', juego.descripcion),
    crear('p', 'precio mt-auto mb-0', formateadorCLP.format(juego.precio))
  );

  tarjeta.append(img, cuerpo);
  return tarjeta;
}

// Recorre el arreglo recibido y dibuja una tarjeta por cada videojuego.
function mostrarVideojuegos(juegos) {
  lista.innerHTML = ''; // limpia las tarjetas anteriores

  if (juegos.length === 0) {
    const aviso = crear('div', 'alert alert-info', 'No encontramos videojuegos con ese criterio.');
    aviso.style.gridColumn = '1 / -1'; // ocupa todo el ancho de la grilla
    lista.append(aviso);
  } else {
    juegos.forEach((juego) => lista.append(crearTarjeta(juego)));
  }

  estadoResultados.textContent = `${juegos.length} ${juegos.length === 1 ? 'videojuego' : 'videojuegos'}`;
}

/* ---------- 3. FILTRO POR CATEGORÍA Y BÚSQUEDA ---------- */

// Llena el menú desplegable con las categorías del objeto `tienda`.
function cargarCategorias() {
  tienda.categorias.forEach((categoria) => {
    const opcion = crear('option', '', categoria);
    opcion.value = categoria;
    selectCategoria.append(opcion);
  });
}

// Aplica los dos filtros y vuelve a dibujar las tarjetas.
function filtrar() {
  const categoria = selectCategoria.value;
  const texto = normalizar(inputTexto.value);

  const resultado = tienda.videojuegos.filter((juego) => {
    const coincideCategoria = categoria === 'Todos' || juego.categoria === categoria;
    const coincideTexto = texto === '' || normalizar(juego.nombre).includes(texto);
    return coincideCategoria && coincideTexto;
  });

  mostrarVideojuegos(resultado);
}

/* ---------- 4. VALIDACIÓN DEL FORMULARIO DE CONTACTO ---------- */
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/;

// Devuelve un objeto { campo: mensaje } con los errores encontrados.
function validarContacto(datos) {
  const errores = {};

  if (!datos.nombre) errores.nombre = 'El nombre es obligatorio.';
  else if (datos.nombre.length < 3) errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
  else if (!REGEX_NOMBRE.test(datos.nombre)) errores.nombre = 'El nombre solo puede contener letras y espacios.';

  if (!datos.email) errores.email = 'El email es obligatorio.';
  else if (!REGEX_EMAIL.test(datos.email)) errores.email = 'Ingresa un email válido, por ejemplo nombre@correo.cl.';

  if (!datos.mensaje) errores.mensaje = 'El mensaje es obligatorio.';
  else if (datos.mensaje.length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';

  return errores;
}

// Marca en rojo (is-invalid de Bootstrap) los campos con error y muestra el texto.
function mostrarErrorCampo(campo, error) {
  const input = document.getElementById(campo);
  const mensaje = document.getElementById(`error-${campo}`);
  input.classList.toggle('is-invalid', Boolean(error));
  mensaje.textContent = error || '';
}

function mostrarErrores(errores) {
  ['nombre', 'email', 'mensaje'].forEach((campo) => mostrarErrorCampo(campo, errores[campo]));
}

function mostrarAlerta(tipo, texto) {
  alertaContacto.className = `alert alert-${tipo}`;
  alertaContacto.textContent = texto;
}

function enviarContacto(evento) {
  evento.preventDefault(); // detiene el envío hasta validar

  const datos = {
    nombre: formContacto.nombre.value.trim(),
    email: formContacto.email.value.trim(),
    mensaje: formContacto.mensaje.value.trim()
  };

  const errores = validarContacto(datos);
  mostrarErrores(errores);

  if (Object.keys(errores).length > 0) {
    mostrarAlerta('danger', 'Revisa los campos marcados en rojo antes de enviar.');
    // Lleva el foco al primer campo con error
    document.getElementById(Object.keys(errores)[0]).focus();
    return;
  }

  // Envío simulado (aquí se llamaría a un servidor)
  mostrarAlerta('success', `¡Gracias, ${datos.nombre}! Recibimos tu mensaje y te responderemos a ${datos.email}.`);
  formContacto.reset();
}

/* ---------- 5. INICIALIZACIÓN ---------- */
cargarCategorias();
mostrarVideojuegos(tienda.videojuegos);

selectCategoria.addEventListener('change', filtrar);
inputTexto.addEventListener('input', filtrar);
formFiltros.addEventListener('submit', (e) => e.preventDefault());
formContacto.addEventListener('submit', enviarContacto);

// Al corregir un campo, se quita su marca roja.
formContacto.addEventListener('input', (e) => {
  if (e.target.classList.contains('is-invalid')) {
    const errores = validarContacto({
      nombre: formContacto.nombre.value.trim(),
      email: formContacto.email.value.trim(),
      mensaje: formContacto.mensaje.value.trim()
    });
    mostrarErrorCampo(e.target.name, errores[e.target.name]);
  }
});
