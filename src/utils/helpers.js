// Funciones auxiliares reutilizables.

// Da formato de peso chileno: 49990 -> "$49.990"
const formateadorCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});
export const formatearPrecio = (valor) => formateadorCLP.format(valor);

// Quita tildes y pasa a minúsculas: "computacion" encuentra "Computación".
export const normalizarTexto = (texto) =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// Las rutas del JSON son relativas (assets/img/...). BASE_URL las ajusta
// para que también funcionen cuando el sitio se publica en GitHub Pages.
export const rutaPublica = (ruta) => `${import.meta.env.BASE_URL}${ruta}`;
