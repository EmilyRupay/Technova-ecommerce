import { useEffect } from 'react';

// Aviso emergente. Se oculta solo a los 2,5 s gracias a useEffect.
export default function Toast({ mensaje, onCerrar }) {
  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(onCerrar, 2500);
    return () => clearTimeout(t); // reinicia el temporizador si llega otro aviso
  }, [mensaje, onCerrar]);

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div className={`toast align-items-center text-bg-dark border-0 ${mensaje ? 'show' : ''}`} role="status" aria-live="polite" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">{mensaje}</div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Cerrar aviso" onClick={onCerrar}></button>
        </div>
      </div>
    </div>
  );
}
