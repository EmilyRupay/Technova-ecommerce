import { useState } from 'react';
import { validarContacto } from '../utils/validaciones';

const VACIO = { nombre: '', email: '', mensaje: '' };
const MAX_MENSAJE = 500;

// COMPONENTE: formulario de contacto con validación.
// Prop: onEnviado -> función de App que muestra un aviso cuando el envío es correcto.
export default function FormularioContacto({ onEnviado }) {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});      // campos que el usuario ya visitó
  const [exito, setExito] = useState('');          // mensaje de envío correcto

  const cambiar = (e) => {
    const nuevos = { ...valores, [e.target.name]: e.target.value };
    setValores(nuevos);
    setExito('');
    setErrores(validarContacto(nuevos));
  };

  // Al salir de un campo (blur) se marca como "tocado" y se muestran sus errores.
  const salir = (e) => {
    setTocados({ ...tocados, [e.target.name]: true });
    setErrores(validarContacto(valores));
  };

  const enviar = (e) => {
    e.preventDefault();
    const encontrados = validarContacto(valores);
    setErrores(encontrados);
    setTocados({ nombre: true, email: true, mensaje: true });

    if (Object.keys(encontrados).length > 0) return; // no se envía si hay errores

    // Aquí iría la llamada a un servidor. En este proyecto el envío es simulado.
    const nombre = valores.nombre.trim().split(' ')[0];
    setExito(`¡Gracias, ${nombre}! Recibimos tu mensaje y te responderemos a ${valores.email.trim()}.`);
    onEnviado(nombre);
    setValores(VACIO);
    setTocados({});
    setErrores({});
  };

  // Un campo se marca en rojo solo si ya fue tocado y tiene error.
  const invalido = (campo) => tocados[campo] && errores[campo];
  const hayErroresVisibles = ['nombre', 'email', 'mensaje'].some(invalido);

  return (
    <form className="card card-body d-flex flex-column" noValidate onSubmit={enviar} aria-labelledby="titulo-contacto">
      {exito && (
        <div className="alert alert-success d-flex gap-2 align-items-start" role="status">
          <i className="bi bi-check-circle-fill" aria-hidden="true"></i><span>{exito}</span>
        </div>
      )}
      {hayErroresVisibles && (
        <div className="alert alert-danger py-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-1" aria-hidden="true"></i>
          Revisa los campos marcados en rojo antes de enviar.
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="contacto-nombre" className="form-label">Nombre *</label>
        <input
          id="contacto-nombre" name="nombre" type="text" autoComplete="name"
          className={`form-control ${invalido('nombre') ? 'is-invalid' : ''}`}
          value={valores.nombre} onChange={cambiar} onBlur={salir}
          aria-describedby="error-nombre"
        />
        <div id="error-nombre" className="invalid-feedback">{errores.nombre}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="contacto-email" className="form-label">Email *</label>
        <input
          id="contacto-email" name="email" type="email" autoComplete="email"
          className={`form-control ${invalido('email') ? 'is-invalid' : ''}`}
          value={valores.email} onChange={cambiar} onBlur={salir}
          placeholder="nombre@correo.cl" aria-describedby="error-email"
        />
        <div id="error-email" className="invalid-feedback">{errores.email}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="contacto-mensaje" className="form-label">Mensaje *</label>
        <textarea
          id="contacto-mensaje" name="mensaje" rows="4" maxLength={MAX_MENSAJE}
          className={`form-control ${invalido('mensaje') ? 'is-invalid' : ''}`}
          value={valores.mensaje} onChange={cambiar} onBlur={salir}
          aria-describedby="error-mensaje ayuda-mensaje"
        ></textarea>
        <div id="error-mensaje" className="invalid-feedback">{errores.mensaje}</div>
        <div id="ayuda-mensaje" className="form-text text-end">{valores.mensaje.length}/{MAX_MENSAJE}</div>
      </div>

      <button type="submit" className="btn btn-neon align-self-start">
        <i className="bi bi-send" aria-hidden="true"></i> Enviar mensaje
      </button>
    </form>
  );
}
