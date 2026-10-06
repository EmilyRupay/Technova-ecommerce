import { FILTROS, ICONOS_CATEGORIA } from '../utils/constantes';

// COMPONENTE: botones para filtrar por categoría.
// Props:
//   - categoria: categoría activa (viene del estado de App)
//   - onCambiar: función de App que actualiza ese estado
//   - conteo: cuántos juegos hay en cada categoría
// Al hacer clic, este componente NO guarda nada: avisa a App, App cambia su
// estado y React vuelve a dibujar la lista filtrada.
export default function FiltroCategorias({ categoria, onCambiar, conteo }) {
  return (
    <div className="filtro-categorias" role="group" aria-label="Filtrar videojuegos por categoría">
      {FILTROS.map((cat) => {
        const activa = categoria === cat;
        return (
          <button
            key={cat}
            type="button"
            className={`btn btn-sm ${activa ? 'btn-neon' : 'btn-outline-secondary'}`}
            aria-pressed={activa}
            onClick={() => onCambiar(cat)}
          >
            <i className={`bi bi-${ICONOS_CATEGORIA[cat]} me-1`} aria-hidden="true"></i>
            {cat}
            <span className="badge rounded-pill text-bg-dark ms-2">{conteo[cat] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
