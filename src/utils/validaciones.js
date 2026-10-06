// Funciones de validación. Cada una recibe los valores del formulario
// y devuelve un objeto { campo: 'mensaje de error' }.
// Si el objeto está vacío, el formulario es válido.

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/;

export function validarContacto({ nombre, email, mensaje }) {
  const errores = {};
  const n = nombre.trim();
  const m = mensaje.trim();

  if (!n) errores.nombre = 'El nombre es obligatorio.';
  else if (n.length < 3) errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
  else if (!REGEX_NOMBRE.test(n)) errores.nombre = 'El nombre solo puede contener letras y espacios.';

  if (!email.trim()) errores.email = 'El email es obligatorio.';
  else if (!REGEX_EMAIL.test(email.trim())) errores.email = 'Ingresa un email válido, por ejemplo nombre@correo.cl.';

  if (!m) errores.mensaje = 'El mensaje es obligatorio.';
  else if (m.length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  else if (m.length > 500) errores.mensaje = 'El mensaje no puede superar los 500 caracteres.';

  return errores;
}

export function validarVideojuego({ nombre, categoria, plataforma, precio, descripcion }) {
  const errores = {};
  const valorPrecio = Number(precio);

  if (nombre.trim().length < 2) errores.nombre = 'Ingresa el nombre del videojuego (mínimo 2 caracteres).';
  if (!categoria) errores.categoria = 'Selecciona una categoría.';
  if (!plataforma.trim()) errores.plataforma = 'Indica al menos una plataforma.';
  if (precio === '' || !Number.isFinite(valorPrecio)) errores.precio = 'Ingresa un precio.';
  else if (!Number.isInteger(valorPrecio) || valorPrecio < 1000 || valorPrecio > 200000) {
    errores.precio = 'El precio debe ser un número entero entre $1.000 y $200.000.';
  }
  if (descripcion.trim().length < 10) errores.descripcion = 'La descripción debe tener al menos 10 caracteres.';

  return errores;
}
