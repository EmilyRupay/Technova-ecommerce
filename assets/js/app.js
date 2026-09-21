/* ==========================================================
   TechNova - lógica de la tienda
   Secciones:
     1. Configuración y estado
     2. Utilidades
     3. Carga de datos (Fetch API)
     4. Renderizado de productos
     5. Carrito de compras
     6. Manejadores de eventos
     7. Inicialización
   ========================================================== */
'use strict';

/* ----------------------------------------------------------
   1. CONFIGURACIÓN Y ESTADO
   ---------------------------------------------------------- */
const RUTA_PRODUCTOS = 'assets/data/productos.json'; // archivo JSON local
const CLAVE_CARRITO = 'technova_carrito';             // clave de localStorage

// Estado central de la aplicación: una sola fuente de verdad.
const estado = {
  productos: [],       // catálogo cargado desde el JSON
  categoria: 'Todos',  // filtro de categoría activo
  busqueda: '',        // texto del buscador
  carrito: []          // [{ id, nombre, precio, imagen, alt, cantidad }]
};

// Referencias a elementos del DOM (se buscan una sola vez).
const el = {
  lista: document.getElementById('lista-productos'),
  estadoResultados: document.getElementById('estado-resultados'),
  tituloCategoria: document.getElementById('titulo-categoria'),
  formBusqueda: document.getElementById('form-busqueda'),
  inputBusqueda: document.getElementById('input-busqueda'),
  menuCategorias: document.getElementById('menu-categorias'),
  menuColapsable: document.getElementById('menu-principal'),
  listaCarrito: document.getElementById('lista-carrito'),
  carritoVacio: document.getElementById('carrito-vacio'),
  pieCarrito: document.getElementById('pie-carrito'),
  totalCarrito: document.getElementById('total-carrito'),
  contadorCarrito: document.getElementById('contador-carrito'),
  resumenCantidad: document.getElementById('resumen-cantidad'),
  btnVaciar: document.getElementById('btn-vaciar'),
  btnFinalizar: document.getElementById('btn-finalizar'),
  toast: document.getElementById('toast-aviso'),
  toastMensaje: document.getElementById('toast-mensaje')
};

/* ----------------------------------------------------------
   2. UTILIDADES
   ---------------------------------------------------------- */

// Da formato de peso chileno: 49990 -> "$49.990"
const formateadorCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});
function formatearPrecio(valor) {
  return formateadorCLP.format(valor);
}

// Crea un elemento HTML con clases y texto. Usar textContent (no innerHTML)
// evita inyectar HTML no deseado desde los datos.
function crearElemento(etiqueta, clases = '', texto = '') {
  const nodo = document.createElement(etiqueta);
  if (clases) nodo.className = clases;
  if (texto) nodo.textContent = texto;
  return nodo;
}

// Crea un ícono de Bootstrap Icons (decorativo, oculto a lectores de pantalla).
function crearIcono(nombre) {
  const icono = crearElemento('i', `bi bi-${nombre}`);
  icono.setAttribute('aria-hidden', 'true');
  return icono;
}

// Quita tildes y pasa a minúsculas para que "computacion" encuentre "Computación".
function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Muestra un aviso emergente (toast de Bootstrap).
function mostrarAviso(mensaje) {
  el.toastMensaje.textContent = mensaje;
  bootstrap.Toast.getOrCreateInstance(el.toast, { delay: 2500 }).show();
}

/* ----------------------------------------------------------
   3. CARGA DE DATOS (FETCH API)
   ---------------------------------------------------------- */

// Pide el catálogo al archivo JSON. Lanza un error si algo sale mal.
async function obtenerProductos() {
  const respuesta = await fetch(RUTA_PRODUCTOS);

  // fetch solo rechaza por fallos de red; los errores HTTP (404, 500)
  // hay que revisarlos manualmente con respuesta.ok.
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  const datos = await respuesta.json();
  if (!Array.isArray(datos)) {
    throw new Error('El JSON no tiene el formato esperado');
  }
  return datos;
}

// Orquesta la carga: muestra "cargando", pide los datos y actualiza la vista.
async function cargarProductos() {
  mostrarCargando();
  try {
    estado.productos = await obtenerProductos();
    renderizarProductos();
  } catch (error) {
    console.error('No se pudieron cargar los productos:', error);
    mostrarError();
  }
}

// Muestra tarjetas "esqueleto" mientras llegan los datos.
function mostrarCargando() {
  el.lista.setAttribute('aria-busy', 'true');
  el.lista.replaceChildren();
  el.estadoResultados.textContent = 'Cargando productos…';

  for (let i = 0; i < 6; i++) {
    const col = crearElemento('div', 'col');
    const tarjeta = crearElemento('div', 'card h-100 border-0 shadow-sm');
    tarjeta.setAttribute('aria-hidden', 'true');
    tarjeta.innerHTML =
      '<div class="card-img-top bg-secondary-subtle" style="aspect-ratio:4/3"></div>' +
      '<div class="card-body placeholder-glow">' +
      '<span class="placeholder col-8 mb-2"></span>' +
      '<span class="placeholder col-12"></span>' +
      '<span class="placeholder col-5 mt-2"></span></div>';
    col.appendChild(tarjeta);
    el.lista.appendChild(col);
  }
}

// Mensaje amigable si los datos no se pudieron cargar.
function mostrarError() {
  el.lista.setAttribute('aria-busy', 'false');
  el.lista.replaceChildren();
  el.estadoResultados.textContent = '';

  const col = crearElemento('div', 'col-12 w-100');
  const alerta = crearElemento('div', 'alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center gap-3');
  alerta.setAttribute('role', 'alert');

  const texto = crearElemento('div', 'flex-grow-1');
  texto.appendChild(crearElemento('strong', '', 'No pudimos cargar los productos. '));
  texto.appendChild(document.createTextNode('Revisa tu conexión e inténtalo nuevamente.'));

  // Pista útil si se abrió el archivo directamente (file://), donde fetch está bloqueado.
  if (window.location.protocol === 'file:') {
    const pista = crearElemento('small', 'd-block mt-1',
      'Estás abriendo el archivo directamente. Usa un servidor local (por ejemplo, Live Server de VS Code) o GitHub Pages.');
    texto.appendChild(pista);
  }

  const btnReintentar = crearElemento('button', 'btn btn-danger flex-shrink-0');
  btnReintentar.type = 'button';
  btnReintentar.id = 'btn-reintentar';
  btnReintentar.appendChild(crearIcono('arrow-clockwise'));
  btnReintentar.appendChild(document.createTextNode(' Reintentar'));

  alerta.append(texto, btnReintentar);
  col.appendChild(alerta);
  el.lista.appendChild(col);
}

/* ----------------------------------------------------------
   4. RENDERIZADO DE PRODUCTOS
   ---------------------------------------------------------- */

// Devuelve los productos que cumplen la categoría y la búsqueda activas.
function obtenerProductosFiltrados() {
  const termino = normalizarTexto(estado.busqueda);

  return estado.productos.filter((producto) => {
    const coincideCategoria =
      estado.categoria === 'Todos' || producto.categoria === estado.categoria;
    // La búsqueda revisa el nombre y la categoría del producto.
    const coincideBusqueda =
      termino === '' ||
      normalizarTexto(`${producto.nombre} ${producto.categoria}`).includes(termino);
    return coincideCategoria && coincideBusqueda;
  });
}

// Construye la tarjeta (card de Bootstrap) de un producto.
function crearTarjetaProducto(producto) {
  const col = crearElemento('div', 'col');
  const tarjeta = crearElemento('article', 'card card-producto h-100 shadow-sm');

  const imagen = crearElemento('img', 'card-img-top');
  imagen.src = producto.imagen;
  imagen.alt = producto.alt || producto.nombre;
  imagen.loading = 'lazy';

  const cuerpo = crearElemento('div', 'card-body d-flex flex-column');
  const categoria = crearElemento('span', 'badge text-bg-light border align-self-start mb-2', producto.categoria);
  const titulo = crearElemento('h3', 'h6 card-title', producto.nombre);
  const descripcion = crearElemento('p', 'card-text small text-body-secondary', producto.descripcion);
  const precio = crearElemento('p', 'precio mt-auto mb-2', formatearPrecio(producto.precio));

  // El botón guarda el id del producto en data-id; el clic se maneja por delegación.
  const boton = crearElemento('button', 'btn btn-primary w-100');
  boton.type = 'button';
  boton.dataset.id = producto.id;
  boton.dataset.accion = 'agregar';
  boton.setAttribute('aria-label', `Agregar ${producto.nombre} al carrito`);
  boton.append(crearIcono('cart-plus'), document.createTextNode(' Agregar al carrito'));

  cuerpo.append(categoria, titulo, descripcion, precio, boton);
  tarjeta.append(imagen, cuerpo);
  col.appendChild(tarjeta);
  return col;
}

// Dibuja la lista de productos (o un mensaje si no hay resultados).
function renderizarProductos() {
  const filtrados = obtenerProductosFiltrados();

  el.lista.replaceChildren();
  el.lista.setAttribute('aria-busy', 'false');
  el.tituloCategoria.textContent =
    estado.categoria === 'Todos' ? '' : `· ${estado.categoria}`;

  if (filtrados.length === 0) {
    const col = crearElemento('div', 'col-12 w-100');
    const aviso = crearElemento('div', 'alert alert-info mb-0');
    aviso.appendChild(crearElemento('strong', '', 'Sin resultados. '));
    aviso.appendChild(document.createTextNode('No encontramos productos con ese criterio. '));
    const btnLimpiar = crearElemento('button', 'btn btn-link p-0 align-baseline', 'Ver todos los productos');
    btnLimpiar.type = 'button';
    btnLimpiar.id = 'btn-limpiar-filtros';
    aviso.appendChild(btnLimpiar);
    col.appendChild(aviso);
    el.lista.appendChild(col);
    el.estadoResultados.textContent = '0 productos encontrados';
    return;
  }

  // DocumentFragment: se arma todo fuera del DOM y se inserta una sola vez (mejor rendimiento).
  const fragmento = document.createDocumentFragment();
  filtrados.forEach((producto) => fragmento.appendChild(crearTarjetaProducto(producto)));
  el.lista.appendChild(fragmento);

  el.estadoResultados.textContent =
    `${filtrados.length} ${filtrados.length === 1 ? 'producto' : 'productos'}`;
}

// Marca visualmente (y para lectores de pantalla) la categoría activa en la navbar.
function marcarCategoriaActiva() {
  el.menuCategorias.querySelectorAll('.nav-link').forEach((enlace) => {
    const activo = enlace.dataset.categoria === estado.categoria;
    enlace.classList.toggle('active', activo);
    if (activo) {
      enlace.setAttribute('aria-current', 'true');
    } else {
      enlace.removeAttribute('aria-current');
    }
  });
}

/* ----------------------------------------------------------
   5. CARRITO DE COMPRAS
   ---------------------------------------------------------- */

// Guarda el carrito en localStorage para que sobreviva a recargar la página.
function guardarCarrito() {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(estado.carrito));
  } catch (error) {
    console.warn('No se pudo guardar el carrito:', error);
  }
}

// Recupera el carrito guardado (si existe y es válido).
function cargarCarritoGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    if (Array.isArray(guardado)) {
      estado.carrito = guardado.filter(
        (item) => item && Number.isFinite(item.precio) && Number.isInteger(item.cantidad) && item.cantidad > 0
      );
    }
  } catch (error) {
    estado.carrito = [];
  }
}

// Agrega un producto: si ya está en el carrito, suma una unidad.
function agregarAlCarrito(idProducto) {
  const producto = estado.productos.find((p) => p.id === idProducto);
  if (!producto) return;

  const existente = estado.carrito.find((item) => item.id === idProducto);
  if (existente) {
    existente.cantidad += 1;
  } else {
    estado.carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      alt: producto.alt,
      cantidad: 1
    });
  }

  actualizarCarrito();
  animarContador();
  mostrarAviso(`"${producto.nombre}" se agregó al carrito`);
}

// Suma o resta unidades; si llega a 0, se elimina el producto.
function cambiarCantidad(idProducto, cambio) {
  const item = estado.carrito.find((i) => i.id === idProducto);
  if (!item) return;

  item.cantidad += cambio;
  if (item.cantidad <= 0) {
    eliminarDelCarrito(idProducto);
    return;
  }
  actualizarCarrito();
}

function eliminarDelCarrito(idProducto) {
  estado.carrito = estado.carrito.filter((item) => item.id !== idProducto);
  actualizarCarrito();
}

function vaciarCarrito() {
  estado.carrito = [];
  actualizarCarrito();
}

// Calcula la cantidad total de unidades y el monto total a pagar.
function calcularTotales() {
  return estado.carrito.reduce(
    (totales, item) => {
      totales.unidades += item.cantidad;
      totales.monto += item.precio * item.cantidad;
      return totales;
    },
    { unidades: 0, monto: 0 }
  );
}

// Construye una fila (<li>) del carrito.
function crearItemCarrito(item) {
  const fila = crearElemento('li', 'list-group-item');
  const contenedor = crearElemento('div', 'd-flex gap-2');

  const imagen = crearElemento('img', 'item-carrito-img');
  imagen.src = item.imagen;
  imagen.alt = '';  // decorativa: el nombre ya aparece como texto al lado

  const info = crearElemento('div', 'flex-grow-1');
  const nombre = crearElemento('div', 'item-carrito-nombre fw-semibold', item.nombre);
  const precioUnitario = crearElemento('small', 'text-body-secondary', `${formatearPrecio(item.precio)} c/u`);

  // Control de cantidad: [-] n [+]
  const control = crearElemento('div', 'control-cantidad btn-group btn-group-sm mt-1');
  control.setAttribute('role', 'group');
  control.setAttribute('aria-label', `Cantidad de ${item.nombre}`);

  const btnMenos = crearElemento('button', 'btn btn-outline-secondary');
  btnMenos.type = 'button';
  btnMenos.dataset.accion = 'restar';
  btnMenos.dataset.id = item.id;
  btnMenos.setAttribute('aria-label', `Quitar una unidad de ${item.nombre}`);
  btnMenos.appendChild(crearIcono('dash'));

  const cantidad = crearElemento('span', 'cantidad', String(item.cantidad));

  const btnMas = crearElemento('button', 'btn btn-outline-secondary');
  btnMas.type = 'button';
  btnMas.dataset.accion = 'sumar';
  btnMas.dataset.id = item.id;
  btnMas.setAttribute('aria-label', `Agregar una unidad de ${item.nombre}`);
  btnMas.appendChild(crearIcono('plus'));

  control.append(btnMenos, cantidad, btnMas);
  info.append(nombre, precioUnitario, document.createElement('br'), control);

  // Subtotal y botón eliminar
  const derecha = crearElemento('div', 'text-end d-flex flex-column justify-content-between align-items-end');
  const subtotal = crearElemento('span', 'fw-bold small', formatearPrecio(item.precio * item.cantidad));
  const btnEliminar = crearElemento('button', 'btn btn-sm btn-link text-danger p-0');
  btnEliminar.type = 'button';
  btnEliminar.dataset.accion = 'eliminar';
  btnEliminar.dataset.id = item.id;
  btnEliminar.setAttribute('aria-label', `Eliminar ${item.nombre} del carrito`);
  btnEliminar.appendChild(crearIcono('x-lg'));
  derecha.append(subtotal, btnEliminar);

  contenedor.append(imagen, info, derecha);
  fila.appendChild(contenedor);
  return fila;
}

// Redibuja el resumen del carrito, el contador y guarda los cambios.
function actualizarCarrito() {
  const { unidades, monto } = calcularTotales();
  const hayProductos = estado.carrito.length > 0;

  el.listaCarrito.replaceChildren(...estado.carrito.map(crearItemCarrito));
  el.carritoVacio.classList.toggle('d-none', hayProductos);
  el.pieCarrito.classList.toggle('d-none', !hayProductos);

  el.totalCarrito.textContent = formatearPrecio(monto);
  el.contadorCarrito.textContent = unidades;
  el.resumenCantidad.textContent = `${unidades} ${unidades === 1 ? 'ítem' : 'ítems'}`;

  guardarCarrito();
}

// Pequeña animación en el contador de la navbar.
function animarContador() {
  el.contadorCarrito.classList.remove('contador-rebote');
  void el.contadorCarrito.offsetWidth; // fuerza reflow para reiniciar la animación
  el.contadorCarrito.classList.add('contador-rebote');
}

// Simula el pago: confirma y limpia el carrito.
function finalizarCompra() {
  const { monto } = calcularTotales();
  vaciarCarrito();
  mostrarAviso(`¡Gracias por tu compra! Total simulado: ${formatearPrecio(monto)}`);
}

/* ----------------------------------------------------------
   6. MANEJADORES DE EVENTOS
   ---------------------------------------------------------- */

// EVENTO SUBMIT: procesa el formulario de búsqueda sin recargar la página.
function manejarBusqueda(evento) {
  evento.preventDefault();
  estado.busqueda = el.inputBusqueda.value;
  estado.categoria = 'Todos'; // la búsqueda se hace sobre todo el catálogo
  marcarCategoriaActiva();
  renderizarProductos();

  // Lleva al usuario a los resultados y cierra el menú en móviles.
  document.getElementById('productos').scrollIntoView();
  bootstrap.Collapse.getInstance(el.menuColapsable)?.hide();
}

// Cambia la categoría al hacer clic en la navbar.
function manejarClickCategoria(evento) {
  const enlace = evento.target.closest('[data-categoria]');
  if (!enlace) return;

  estado.categoria = enlace.dataset.categoria;
  estado.busqueda = '';
  el.inputBusqueda.value = '';
  marcarCategoriaActiva();
  renderizarProductos();
  bootstrap.Collapse.getInstance(el.menuColapsable)?.hide();
}

// EVENTO CLICK (delegación): un solo listener para todos los botones "Agregar".
function manejarClickProductos(evento) {
  const boton = evento.target.closest('button');
  if (!boton) return;

  if (boton.dataset.accion === 'agregar') {
    agregarAlCarrito(Number(boton.dataset.id));
  } else if (boton.id === 'btn-reintentar') {
    cargarProductos();
  } else if (boton.id === 'btn-limpiar-filtros') {
    estado.categoria = 'Todos';
    estado.busqueda = '';
    el.inputBusqueda.value = '';
    marcarCategoriaActiva();
    renderizarProductos();
  }
}

// EVENTO CLICK (delegación) en el carrito: sumar, restar y eliminar.
function manejarClickCarrito(evento) {
  const boton = evento.target.closest('button[data-accion]');
  if (!boton) return;

  const id = Number(boton.dataset.id);
  switch (boton.dataset.accion) {
    case 'sumar':    cambiarCantidad(id, 1);  break;
    case 'restar':   cambiarCantidad(id, -1); break;
    case 'eliminar': eliminarDelCarrito(id);  break;
  }
}

// Conecta todos los eventos.
function registrarEventos() {
  el.formBusqueda.addEventListener('submit', manejarBusqueda);
  el.menuCategorias.addEventListener('click', manejarClickCategoria);
  el.lista.addEventListener('click', manejarClickProductos);
  el.listaCarrito.addEventListener('click', manejarClickCarrito);
  el.btnVaciar.addEventListener('click', vaciarCarrito);
  el.btnFinalizar.addEventListener('click', finalizarCompra);
}

/* ----------------------------------------------------------
   7. INICIALIZACIÓN
   ---------------------------------------------------------- */
function iniciar() {
  registrarEventos();
  cargarCarritoGuardado();
  actualizarCarrito();
  cargarProductos();
}

document.addEventListener('DOMContentLoaded', iniciar);
