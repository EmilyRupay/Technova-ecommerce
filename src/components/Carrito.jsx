import ItemCarrito from './ItemCarrito';
import { formatearPrecio } from '../utils/helpers';

// COMPONENTE: resumen del carrito.
// Renderizado condicional: mensaje de carrito vacío o lista + total.
export default function Carrito({ carrito, unidades, monto, onCambiarCantidad, onEliminar, onVaciar, onFinalizar }) {
  const hayProductos = carrito.length > 0;

  return (
    <aside id="carrito" className="col-lg-4 col-xl-3" aria-labelledby="titulo-carrito">
      <div className="card carrito-sticky">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 id="titulo-carrito" className="h5 mb-0"><i className="bi bi-cart3" aria-hidden="true"></i> Tu carrito</h2>
          <span className="badge text-bg-secondary">{unidades} {unidades === 1 ? 'ítem' : 'ítems'}</span>
        </div>

        <div className="card-body p-0">
          {hayProductos ? (
            <ul className="list-group list-group-flush" aria-live="polite">
              {carrito.map((item) => (
                <ItemCarrito key={item.id} item={item} onCambiarCantidad={onCambiarCantidad} onEliminar={onEliminar} />
              ))}
            </ul>
          ) : (
            <p className="text-center text-body-secondary p-4 mb-0">
              <i className="bi bi-controller fs-1 d-block mb-2" aria-hidden="true"></i>
              Tu carrito está vacío.<br />Agrega videojuegos para verlos aquí.
            </p>
          )}
        </div>

        {hayProductos && (
          <div className="card-footer">
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>
              <span>{formatearPrecio(monto)}</span>
            </div>
            <div className="d-grid gap-2">
              <button type="button" className="btn btn-neon" onClick={onFinalizar}>
                <i className="bi bi-credit-card" aria-hidden="true"></i> Finalizar compra
              </button>
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={onVaciar}>
                <i className="bi bi-trash" aria-hidden="true"></i> Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
