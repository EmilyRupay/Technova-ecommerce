import { useState, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FiltroCategorias from './components/FiltroCategorias';
import ListaVideojuegos from './components/ListaVideojuegos';
import Carrito from './components/Carrito';
import FormularioVideojuego from './components/FormularioVideojuego';
import FormularioContacto from './components/FormularioContacto';
import Footer from './components/Footer';
import Toast from './components/Toast';
import useVideojuegos from './hooks/useVideojuegos';
import useCarrito from './hooks/useCarrito';
import { formatearPrecio, normalizarTexto } from './utils/helpers';
import { FILTROS } from './utils/constantes';

// COMPONENTE PRINCIPAL. Guarda el estado compartido y lo reparte
// a los demás componentes mediante PROPS.
export default function App() {
  // Estado del catálogo (se carga desde public/assets/data/videojuegos.json)
  const { videojuegos, cargando, error, agregar, eliminar, reintentar } = useVideojuegos();
  // Estado del carrito (se guarda en localStorage)
  const carrito = useCarrito();

  // Estado de la interfaz
  const [categoria, setCategoria] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [aviso, setAviso] = useState('');
  const cerrarAviso = useCallback(() => setAviso(''), []);

  // Lista filtrada por categoría y búsqueda. useMemo evita recalcular si nada cambió.
  const filtrados = useMemo(() => {
    const termino = normalizarTexto(busqueda);
    return videojuegos.filter((v) =>
      (categoria === 'Todos' || v.categoria === categoria) &&
      (termino === '' || normalizarTexto(`${v.nombre} ${v.categoria} ${v.plataforma}`).includes(termino))
    );
  }, [videojuegos, categoria, busqueda]);

  // Cantidad de juegos por categoría (se muestra en los botones del filtro).
  const conteo = useMemo(() => {
    const totales = Object.fromEntries(FILTROS.map((c) => [c, 0]));
    videojuegos.forEach((v) => { totales.Todos++; totales[v.categoria] = (totales[v.categoria] ?? 0) + 1; });
    return totales;
  }, [videojuegos]);

  // ----- Funciones que se pasan como props a los hijos -----
  const cambiarCategoria = (cat) => setCategoria(cat);
  const buscar = (texto) => { setBusqueda(texto); setCategoria('Todos'); };
  const limpiarFiltros = () => { setCategoria('Todos'); setBusqueda(''); };

  const agregarAlCarrito = (juego) => {
    carrito.agregar(juego);
    setAviso(`"${juego.nombre}" se agregó al carrito`);
  };

  const agregarVideojuego = (nuevo) => {
    agregar(nuevo);
    limpiarFiltros(); // así el juego nuevo se ve de inmediato al inicio de la lista
    setAviso(`"${nuevo.nombre}" se agregó al catálogo`);
    document.getElementById('catalogo')?.scrollIntoView();
  };

  const eliminarVideojuego = (juego) => {
    if (!window.confirm(`¿Eliminar "${juego.nombre}" del catálogo?`)) return;
    eliminar(juego.id);
    carrito.eliminar(juego.id); // si estaba en el carrito, también se quita
    setAviso(`"${juego.nombre}" se eliminó del catálogo`);
  };

  const finalizarCompra = () => {
    setAviso(`¡Gracias por tu compra! Total simulado: ${formatearPrecio(carrito.monto)}`);
    carrito.vaciar();
  };

  const textoEstado = cargando
    ? 'Cargando videojuegos…'
    : error ? '' : `${filtrados.length} ${filtrados.length === 1 ? 'videojuego' : 'videojuegos'}`;

  return (
    <>
      <a className="visually-hidden-focusable skip-link" href="#contenido">Saltar al contenido principal</a>

      <Navbar unidades={carrito.unidades} onBuscar={buscar} />

      <main id="contenido">
        <Hero totalJuegos={videojuegos.length} />

        {/* ===== CATÁLOGO ===== */}
        <section id="catalogo" className="container py-5" aria-labelledby="titulo-catalogo">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
            <div>
              <h2 id="titulo-catalogo" className="h2 mb-1">
                Catálogo{' '}
                {categoria !== 'Todos' && <span className="text-body-secondary fs-4">· {categoria}</span>}
              </h2>
              {busqueda && (
                <p className="mb-0 small">
                  Resultados para “{busqueda}”{' '}
                  <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={limpiarFiltros}>quitar búsqueda</button>
                </p>
              )}
            </div>
            <p className="mb-0 text-body-secondary" role="status" aria-live="polite">{textoEstado}</p>
          </div>

          <FiltroCategorias categoria={categoria} onCambiar={cambiarCategoria} conteo={conteo} />

          <div className="row g-4 mt-1">
            <div className="col-lg-8 col-xl-9">
              <ListaVideojuegos
                videojuegos={filtrados}
                cargando={cargando}
                error={error}
                onReintentar={reintentar}
                onLimpiar={limpiarFiltros}
                carrito={carrito.carrito}
                onAgregar={agregarAlCarrito}
                onEliminar={eliminarVideojuego}
              />
            </div>

            <Carrito
              carrito={carrito.carrito}
              unidades={carrito.unidades}
              monto={carrito.monto}
              onCambiarCantidad={carrito.cambiarCantidad}
              onEliminar={carrito.eliminar}
              onVaciar={carrito.vaciar}
              onFinalizar={finalizarCompra}
            />
          </div>
        </section>

        {/* ===== AGREGAR VIDEOJUEGO ===== */}
        <section id="administrar" className="seccion-alterna py-5" aria-labelledby="titulo-administrar">
          <div className="container">
            <div className="row g-4 align-items-start">
              <div className="col-lg-4">
                <h2 id="titulo-administrar" className="h2">Agregar videojuego</h2>
                <p className="text-body-secondary">
                  Panel de administración: completa el formulario y el juego aparecerá al inicio del catálogo.
                  Para quitar un juego usa el botón <i className="bi bi-trash text-danger" aria-hidden="true"></i><span className="visually-hidden">eliminar</span> de su tarjeta.
                </p>
              </div>
              <div className="col-lg-8">
                <FormularioVideojuego onAgregar={agregarVideojuego} />
              </div>
            </div>
          </div>
        </section>

        {/* ===== CONTACTO ===== */}
        <section id="contacto" className="container py-5" aria-labelledby="titulo-contacto">
          <div className="row g-4">
            <div className="col-lg-5">
              <h2 id="titulo-contacto" className="h2">Contacto</h2>
              <p className="text-body-secondary">
                ¿Buscas un juego que no está en el catálogo o tienes dudas con tu pedido? Escríbenos y el
                administrador del sitio te responderá a la brevedad.
              </p>
              <ul className="list-unstyled d-grid gap-2">
                <li><i className="bi bi-clock me-2 text-neon" aria-hidden="true"></i>Lunes a viernes, 9:00 a 18:00</li>
                <li><i className="bi bi-envelope me-2 text-neon" aria-hidden="true"></i>contacto@technovagames.cl</li>
                <li><i className="bi bi-geo-alt me-2 text-neon" aria-hidden="true"></i>Santiago, Chile</li>
              </ul>
            </div>
            <div className="col-lg-7">
              <FormularioContacto onEnviado={(nombre) => setAviso(`Mensaje enviado. ¡Gracias, ${nombre}!`)} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Toast mensaje={aviso} onCerrar={cerrarAviso} />
    </>
  );
}
