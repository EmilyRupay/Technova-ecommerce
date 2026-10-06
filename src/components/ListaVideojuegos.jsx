import TarjetaVideojuego from './TarjetaVideojuego';

// Tarjetas "esqueleto" que se ven mientras llegan los datos.
function Esqueletos() {
  return Array.from({ length: 6 }, (_, i) => (
    <div className="card h-100 border-0" aria-hidden="true" key={i}>
      <div className="card-img-top bg-secondary-subtle" style={{ aspectRatio: '4/3' }}></div>
      <div className="card-body placeholder-glow">
        <span className="placeholder col-8 mb-2"></span>
        <span className="placeholder col-12"></span>
        <span className="placeholder col-5 mt-2"></span>
      </div>
    </div>
  ));
}

// COMPONENTE: lista de videojuegos.
// Recibe por props la lista YA FILTRADA desde App y dibuja una tarjeta por juego.
// Tiene 4 estados posibles: cargando, error, sin resultados o con resultados.
export default function ListaVideojuegos({ videojuegos, cargando, error, onReintentar, onLimpiar, carrito, onAgregar, onEliminar }) {
  if (error) {
    return (
      <div className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center gap-3" role="alert">
        <div className="flex-grow-1">
          <strong>No pudimos cargar los videojuegos. </strong>Revisa tu conexión e inténtalo nuevamente.
        </div>
        <button type="button" className="btn btn-danger flex-shrink-0" onClick={onReintentar}>
          <i className="bi bi-arrow-clockwise" aria-hidden="true"></i> Reintentar
        </button>
      </div>
    );
  }

  if (!cargando && videojuegos.length === 0) {
    return (
      <div className="alert alert-info mb-0">
        <strong>Sin resultados. </strong>No encontramos videojuegos con ese criterio.{' '}
        <button type="button" className="btn btn-link p-0 align-baseline" onClick={onLimpiar}>
          Ver todo el catálogo
        </button>
      </div>
    );
  }

  return (
    // .grid-juegos usa CSS Grid: las columnas se ajustan solas al ancho de la pantalla.
    <div className="grid-juegos" aria-busy={cargando}>
      {cargando ? (
        <Esqueletos />
      ) : (
        videojuegos.map((juego) => (
          <TarjetaVideojuego
            key={juego.id}
            juego={juego}
            cantidadEnCarrito={carrito.find((i) => i.id === juego.id)?.cantidad ?? 0}
            onAgregar={onAgregar}
            onEliminar={onEliminar}
          />
        ))
      )}
    </div>
  );
}
