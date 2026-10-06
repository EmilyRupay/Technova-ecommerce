import { useState } from 'react';
import { CATEGORIAS, IMAGEN_POR_DEFECTO } from '../utils/constantes';
import { validarVideojuego } from '../utils/validaciones';

const VACIO = { nombre: '', categoria: '', plataforma: '', precio: '', descripcion: '', imagen: '' };

// COMPONENTE: formulario para AGREGAR un videojuego al catálogo.
// Prop: onAgregar -> función de App que agrega el juego al estado.
// Cuando se agrega, App actualiza su estado y la lista se vuelve a dibujar sola.
export default function FormularioVideojuego({ onAgregar }) {
  const [valores, setValores] = useState(VACIO);   // lo que escribe el usuario
  const [errores, setErrores] = useState({});      // mensajes de error por campo
  const [enviado, setEnviado] = useState(false);   // ¿ya intentó enviar?

  const cambiar = (e) => {
    const nuevos = { ...valores, [e.target.name]: e.target.value };
    setValores(nuevos);
    if (enviado) setErrores(validarVideojuego(nuevos)); // corrige errores en vivo
  };

  const enviar = (e) => {
    e.preventDefault();
    setEnviado(true);
    const encontrados = validarVideojuego(valores);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return; // hay errores: no se agrega

    onAgregar({
      nombre: valores.nombre.trim(),
      categoria: valores.categoria,
      plataforma: valores.plataforma.trim(),
      precio: Number(valores.precio),
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim() || IMAGEN_POR_DEFECTO,
      alt: `Portada de ${valores.nombre.trim()}`
    });
    setValores(VACIO);
    setErrores({});
    setEnviado(false);
  };

  // Devuelve las clases de Bootstrap para marcar un campo como inválido.
  const clase = (campo, base = 'form-control') => `${base} ${errores[campo] ? 'is-invalid' : ''}`;

  return (
    <form className="card card-body" noValidate onSubmit={enviar} aria-labelledby="titulo-administrar">
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="vj-nombre" className="form-label">Nombre *</label>
          <input id="vj-nombre" name="nombre" className={clase('nombre')} value={valores.nombre} onChange={cambiar} placeholder="Ej: Dragones del Sur" />
          <div className="invalid-feedback">{errores.nombre}</div>
        </div>
        <div className="col-md-6">
          <label htmlFor="vj-categoria" className="form-label">Categoría *</label>
          <select id="vj-categoria" name="categoria" className={clase('categoria', 'form-select')} value={valores.categoria} onChange={cambiar}>
            <option value="">Selecciona…</option>
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="invalid-feedback">{errores.categoria}</div>
        </div>
        <div className="col-md-6">
          <label htmlFor="vj-plataforma" className="form-label">Plataforma *</label>
          <input id="vj-plataforma" name="plataforma" className={clase('plataforma')} value={valores.plataforma} onChange={cambiar} placeholder="Ej: PS5 · PC" />
          <div className="invalid-feedback">{errores.plataforma}</div>
        </div>
        <div className="col-md-6">
          <label htmlFor="vj-precio" className="form-label">Precio (CLP) *</label>
          <div className="input-group has-validation">
            <span className="input-group-text">$</span>
            <input id="vj-precio" name="precio" type="number" min="1000" max="200000" step="1" className={clase('precio')} value={valores.precio} onChange={cambiar} placeholder="39990" />
            <div className="invalid-feedback">{errores.precio}</div>
          </div>
        </div>
        <div className="col-12">
          <label htmlFor="vj-descripcion" className="form-label">Descripción *</label>
          <textarea id="vj-descripcion" name="descripcion" rows="2" className={clase('descripcion')} value={valores.descripcion} onChange={cambiar} placeholder="¿De qué se trata el juego?"></textarea>
          <div className="invalid-feedback">{errores.descripcion}</div>
        </div>
        <div className="col-12">
          <label htmlFor="vj-imagen" className="form-label">URL de la portada <span className="text-body-secondary">(opcional)</span></label>
          <input id="vj-imagen" name="imagen" type="url" className="form-control" value={valores.imagen} onChange={cambiar} placeholder="https://… (si lo dejas vacío se usa una imagen genérica)" />
        </div>
        <div className="col-12 d-flex flex-wrap gap-2 justify-content-end">
          <button type="button" className="btn btn-outline-secondary" onClick={() => { setValores(VACIO); setErrores({}); setEnviado(false); }}>
            Limpiar
          </button>
          <button type="submit" className="btn btn-neon">
            <i className="bi bi-plus-circle" aria-hidden="true"></i> Agregar al catálogo
          </button>
        </div>
      </div>
    </form>
  );
}
