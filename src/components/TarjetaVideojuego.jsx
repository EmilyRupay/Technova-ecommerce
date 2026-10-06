import { formatearPrecio, rutaPublica } from '../utils/helpers';
import { ICONOS_CATEGORIA } from '../utils/constantes';

// COMPONENTE: tarjeta de un videojuego (imagen, nombre, precio y descripción).
// Props:
//   - juego: objeto con los datos del videojuego
//   - cantidadEnCarrito: para cambiar el texto del botón
//   - onAgregar / onEliminar: funciones que vienen desde App
export default function TarjetaVideojuego({ juego, cantidadEnCarrito, onAgregar, onEliminar }) {
  const enCarrito = cantidadEnCarrito > 0;
  // Si la imagen es una URL completa (http...), se usa tal cual.
  const src = /^https?:\/\//.test(juego.imagen) ? juego.imagen : rutaPublica(juego.imagen);

  return (
    <article className="card tarjeta-juego h-100">
      <img className="card-img-top" src={src} alt={juego.alt || `Portada de ${juego.nombre}`} loading="lazy" />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
          <span className="badge badge-categoria">
            <i className={`bi bi-${ICONOS_CATEGORIA[juego.categoria] ?? 'tag'} me-1`} aria-hidden="true"></i>
            {juego.categoria}
          </span>
          <small className="text-body-secondary text-end">{juego.plataforma}</small>
        </div>
        <h3 className="h5 card-title">{juego.nombre}</h3>
        <p className="card-text small text-body-secondary">{juego.descripcion}</p>
        <p className="precio mt-auto mb-3">{formatearPrecio(juego.precio)}</p>

        <div className="d-flex gap-2">
          <button
            type="button"
            className={`btn flex-grow-1 ${enCarrito ? 'btn-success' : 'btn-neon'}`}
            onClick={() => onAgregar(juego)}
          >
            {enCarrito ? (
              <><i className="bi bi-check2-circle" aria-hidden="true"></i> En el carrito ({cantidadEnCarrito})</>
            ) : (
              <><i className="bi bi-cart-plus" aria-hidden="true"></i> Agregar</>
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            title="Eliminar del catálogo"
            aria-label={`Eliminar ${juego.nombre} del catálogo`}
            onClick={() => onEliminar(juego)}
          >
            <i className="bi bi-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </article>
  );
}
