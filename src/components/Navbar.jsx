import { useState } from 'react';

// Enlaces a las secciones de la página (se recorren con .map()).
const SECCIONES = [
  { id: 'inicio', texto: 'Inicio', icono: 'house' },
  { id: 'catalogo', texto: 'Catálogo', icono: 'controller' },
  { id: 'administrar', texto: 'Agregar juego', icono: 'plus-circle' },
  { id: 'contacto', texto: 'Contacto', icono: 'envelope' }
];

// COMPONENTE: barra de navegación.
// Props que recibe desde App:
//   - unidades: cantidad de productos en el carrito (para el contador)
//   - onBuscar: función que App ejecuta cuando el usuario busca un juego
export default function Navbar({ unidades, onBuscar }) {
  const [menuAbierto, setMenuAbierto] = useState(false); // menú colapsable en móvil
  const [texto, setTexto] = useState('');                // contenido del buscador

  const cerrarMenu = () => setMenuAbierto(false);

  const enviarBusqueda = (e) => {
    e.preventDefault();          // evita que el formulario recargue la página
    onBuscar(texto);             // le avisa a App (comunicación hijo -> padre)
    cerrarMenu();
    document.getElementById('catalogo')?.scrollIntoView();
  };

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg bg-tn border-bottom border-secondary-subtle" aria-label="Navegación principal">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#inicio" onClick={cerrarMenu}>
            <i className="bi bi-controller text-neon fs-4" aria-hidden="true"></i>
            <span>TechNova <span className="text-neon">Games</span></span>
          </a>

          <div className="d-flex align-items-center gap-2 order-lg-last">
            <a className="btn btn-outline-light position-relative" href="#carrito" onClick={cerrarMenu}>
              <i className="bi bi-cart3" aria-hidden="true"></i>
              <span className="visually-hidden">Ir al carrito. Productos en el carrito:</span>
              {/* key={unidades} reinicia la animación cada vez que cambia el número */}
              <span
                key={unidades}
                className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-neon text-dark ${unidades > 0 ? 'contador-rebote' : ''}`}
              >
                {unidades}
              </span>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              aria-controls="menu-principal"
              aria-expanded={menuAbierto}
              aria-label="Mostrar u ocultar el menú"
              onClick={() => setMenuAbierto((v) => !v)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`} id="menu-principal">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {SECCIONES.map((s) => (
                <li className="nav-item" key={s.id}>
                  <a className="nav-link text-nowrap" href={`#${s.id}`} onClick={cerrarMenu}>
                    <i className={`bi bi-${s.icono} me-1`} aria-hidden="true"></i>{s.texto}
                  </a>
                </li>
              ))}
              <li className="nav-item">
                <a className="nav-link text-nowrap" href="version-js/index.html" title="Versión hecha solo con HTML, CSS, Bootstrap y JavaScript">
                  <i className="bi bi-filetype-js me-1" aria-hidden="true"></i>Versión JS
                </a>
              </li>
            </ul>

            <form className="d-flex buscador" role="search" onSubmit={enviarBusqueda}>
              <label htmlFor="input-busqueda" className="visually-hidden">Buscar videojuegos por nombre</label>
              <input
                id="input-busqueda"
                className="form-control me-2"
                type="search"
                placeholder="Buscar videojuego…"
                autoComplete="off"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <button className="btn btn-neon text-nowrap" type="submit">
                <i className="bi bi-search" aria-hidden="true"></i>
                <span className="visually-hidden">Buscar</span>
              </button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
}
