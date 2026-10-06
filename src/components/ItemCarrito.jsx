import { formatearPrecio, rutaPublica } from '../utils/helpers';

// COMPONENTE: una fila del carrito (imagen, cantidad editable, subtotal y eliminar).
export default function ItemCarrito({ item, onCambiarCantidad, onEliminar }) {
  const src = /^https?:\/\//.test(item.imagen) ? item.imagen : rutaPublica(item.imagen);
  return (
    <li className="list-group-item">
      <div className="d-flex gap-2">
        <img className="item-carrito-img" src={src} alt="" />
        <div className="flex-grow-1">
          <div className="item-carrito-nombre fw-semibold">{item.nombre}</div>
          <small className="text-body-secondary">{formatearPrecio(item.precio)} c/u</small>
          <br />
          <div className="control-cantidad btn-group btn-group-sm mt-1" role="group" aria-label={`Cantidad de ${item.nombre}`}>
            <button type="button" className="btn btn-outline-secondary" aria-label={`Quitar una unidad de ${item.nombre}`} onClick={() => onCambiarCantidad(item.id, -1)}>
              <i className="bi bi-dash" aria-hidden="true"></i>
            </button>
            <span className="cantidad">{item.cantidad}</span>
            <button type="button" className="btn btn-outline-secondary" aria-label={`Agregar una unidad de ${item.nombre}`} onClick={() => onCambiarCantidad(item.id, 1)}>
              <i className="bi bi-plus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div className="text-end d-flex flex-column justify-content-between align-items-end">
          <span className="fw-bold small">{formatearPrecio(item.precio * item.cantidad)}</span>
          <button type="button" className="btn btn-sm btn-link text-danger p-0" aria-label={`Quitar ${item.nombre} del carrito`} onClick={() => onEliminar(item.id)}>
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </li>
  );
}
