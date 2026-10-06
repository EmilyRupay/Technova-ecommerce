// COMPONENTE: portada de la tienda.
// Recibe por props la cantidad de juegos para mostrarla como dato destacado.
export default function Hero({ totalJuegos }) {
  return (
    <section id="inicio" className="hero" aria-labelledby="titulo-hero">
      <div className="container py-5">
        <div className="hero-grid">
          <div>
            <p className="text-uppercase fw-semibold mb-2 hero-kicker">Envíos a todo Chile · Pago seguro</p>
            <h1 id="titulo-hero" className="display-5 fw-bold">Tu próxima partida empieza aquí</h1>
            <p className="lead mb-4">
              Acción, aventura, deportes, carreras y estrategia para PlayStation, Xbox, Nintendo Switch y PC.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <a href="#catalogo" className="btn btn-neon btn-lg">
                Ver catálogo <i className="bi bi-arrow-down-short" aria-hidden="true"></i>
              </a>
              <a href="#contacto" className="btn btn-outline-light btn-lg">Contáctanos</a>
            </div>
          </div>

          {/* Datos destacados organizados con CSS Grid (ver .hero-datos en styles.css) */}
          <ul className="hero-datos list-unstyled mb-0" aria-label="Datos de la tienda">
            <li><strong>{totalJuegos}</strong><span>juegos disponibles</span></li>
            <li><strong>5</strong><span>categorías</span></li>
            <li><strong>24 h</strong><span>despacho en Santiago</span></li>
            <li><strong>100%</strong><span>originales</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
