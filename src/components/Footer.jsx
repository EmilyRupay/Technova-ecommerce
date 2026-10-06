const REDES = [
  { nombre: 'Instagram', icono: 'instagram', url: 'https://www.instagram.com/' },
  { nombre: 'Facebook', icono: 'facebook', url: 'https://www.facebook.com/' },
  { nombre: 'X (Twitter)', icono: 'twitter-x', url: 'https://x.com/' },
  { nombre: 'YouTube', icono: 'youtube', url: 'https://www.youtube.com/' },
  { nombre: 'Twitch', icono: 'twitch', url: 'https://www.twitch.tv/' }
];

// COMPONENTE: pie de página.
export default function Footer() {
  return (
    <footer className="bg-tn text-body-secondary pt-5 pb-3 border-top border-secondary-subtle">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <h2 className="h5 text-white">
              <i className="bi bi-controller text-neon" aria-hidden="true"></i> TechNova <span className="text-neon">Games</span>
            </h2>
            <p className="mb-0">Tienda online de videojuegos. Proyecto académico para Desarrollo Frontend I (PFY2201) — Evaluación Final Transversal.</p>
          </div>
          <div className="col-6 col-md-4">
            <h2 className="h6 text-white text-uppercase">Datos de contacto</h2>
            <ul className="list-unstyled mb-0">
              <li><i className="bi bi-envelope me-2" aria-hidden="true"></i><a href="mailto:contacto@technovagames.cl" className="link-light">contacto@technovagames.cl</a></li>
              <li><i className="bi bi-telephone me-2" aria-hidden="true"></i>+56 2 2345 6789</li>
              <li><i className="bi bi-geo-alt me-2" aria-hidden="true"></i>Santiago, Chile</li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="h6 text-white text-uppercase">Síguenos</h2>
            <ul className="list-inline fs-4 mb-0">
              {REDES.map((r) => (
                <li className="list-inline-item" key={r.nombre}>
                  <a className="link-light" href={r.url} target="_blank" rel="noopener noreferrer" aria-label={r.nombre}>
                    <i className={`bi bi-${r.icono}`} aria-hidden="true"></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <p className="text-center small mb-0">&copy; 2026 TechNova Games. Sitio de demostración: los juegos y precios son ficticios.</p>
      </div>
    </footer>
  );
}
