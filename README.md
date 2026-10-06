# 🎮 TechNova Games — Tienda de videojuegos online

Proyecto de la **Evaluación Final Transversal (EFT)** de la asignatura **Desarrollo Frontend I (PFY2201)** — Duoc UC.

Sitio web para una tienda de videojuegos que muestra el catálogo en tarjetas, permite **filtrar por categoría**, **buscar**, **agregar y eliminar videojuegos**, usar un **carrito de compras** y enviar un **formulario de contacto validado**.

El proyecto tiene dos versiones que comparten los mismos estilos e imágenes:

| Versión | Tecnologías | Ruta |
|---|---|---|
| **React (principal)** | React 18 + Vite, Bootstrap 5, CSS3 | `index.html` → `src/` |
| **HTML + JavaScript** | HTML5 semántico, CSS3, Bootstrap 5, JavaScript puro | `public/version-js/index.html` |

Desde la barra de navegación se puede pasar de una versión a la otra (enlaces **"Versión JS"** y **"Versión React"**).

---

## ✨ Funcionalidades

- **Página principal** con portada y catálogo de 10 videojuegos en tarjetas (imagen, nombre, categoría, plataforma, precio y descripción).
- **Barra de navegación** responsiva con enlaces a Inicio, Catálogo, Agregar juego y Contacto, buscador y contador del carrito.
- **Filtro por categoría**: Acción, Aventura, Deportes, Carreras y Estrategia (botones en React, menú desplegable en la versión JS).
- **Búsqueda** por nombre que ignora mayúsculas y tildes.
- **Agregar videojuegos** con un formulario validado y **eliminarlos** desde su tarjeta (manejo con `state` de React).
- **Carrito**: agregar, sumar/restar unidades, quitar, vaciar y total en pesos chilenos. Se guarda en `localStorage`.
- **Formulario de contacto** (nombre, email y mensaje) que valida antes de enviar y muestra mensajes de error por campo.
- **Diseño responsivo** con Bootstrap 5, **CSS Grid** (grilla de juegos y portada) y **Flexbox** (filtros, tarjetas).
- Accesibilidad: enlace "saltar al contenido", etiquetas `label`, `aria-*`, foco visible y textos alternativos.

---

## 🧩 Componentes React

```
App (estado principal: videojuegos, categoría, búsqueda, carrito, avisos)
├── Navbar               props: unidades, onBuscar
├── Hero                 props: totalJuegos
├── FiltroCategorias     props: categoria, onCambiar, conteo
├── ListaVideojuegos     props: videojuegos, cargando, error, carrito, onAgregar, onEliminar…
│   └── TarjetaVideojuego   props: juego, cantidadEnCarrito, onAgregar, onEliminar
├── Carrito              props: carrito, unidades, monto, onCambiarCantidad, onEliminar…
│   └── ItemCarrito         props: item, onCambiarCantidad, onEliminar
├── FormularioVideojuego props: onAgregar
├── FormularioContacto   props: onEnviado
├── Footer
└── Toast                props: mensaje, onCerrar
```

**State y props:** `App` guarda el estado y lo reparte con props. Cuando un hijo necesita cambiar algo (por ejemplo, `FiltroCategorias` al elegir una categoría), llama a una función que recibió por props; `App` actualiza su estado y React vuelve a dibujar `ListaVideojuegos` con la lista filtrada.

**Hooks personalizados:**
- `useVideojuegos` — carga `public/assets/data/videojuegos.json` con `fetch` (`useEffect`) y guarda la lista en `useState`. Expone `agregar` y `eliminar`.
- `useCarrito` — lógica del carrito y persistencia en `localStorage`.

---

## 📁 Estructura del proyecto

```
Technova-ecommerce/
├── index.html                  Punto de entrada de React
├── package.json / vite.config.js
├── src/
│   ├── main.jsx                Monta <App /> en #root
│   ├── App.jsx                 Componente principal (estado + secciones)
│   ├── components/             Navbar, Hero, FiltroCategorias, ListaVideojuegos,
│   │                           TarjetaVideojuego, Carrito, ItemCarrito,
│   │                           FormularioVideojuego, FormularioContacto, Footer, Toast
│   ├── hooks/                  useVideojuegos.js, useCarrito.js
│   ├── utils/                  helpers.js, constantes.js, validaciones.js
│   └── styles/                 bootstrap.min.css, bootstrap-icons, styles.css
└── public/
    ├── assets/data/videojuegos.json   Datos del catálogo (React)
    ├── assets/img/                    Portadas de los juegos (SVG)
    └── version-js/                    Versión HTML + CSS + Bootstrap + JavaScript
        ├── index.html
        ├── css/styles.css
        └── js/datos.js (objeto `tienda` con los videojuegos) y app.js (lógica)
```

---

## ▶️ Instalación y uso

Requisitos: **Node.js 18 o superior** y **npm**.

```bash
# 1. Clonar el repositorio
git clone https://github.com/EmilyRupay/Technova-ecommerce.git
cd Technova-ecommerce

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

Abrir la dirección que muestra la terminal (normalmente `http://localhost:5173`).

- Versión React: `http://localhost:5173/`
- Versión HTML + JS: `http://localhost:5173/version-js/index.html`

Otros comandos:

```bash
npm run build     # genera la carpeta /dist lista para publicar
npm run preview   # sirve /dist localmente para probar el build
npm run deploy    # publica /dist en GitHub Pages (rama gh-pages)
```

> La versión HTML + JS también puede abrirse con la extensión **Live Server** de VS Code sobre `public/version-js/index.html`.

---

## 🧪 Pruebas realizadas

| Prueba | Resultado esperado |
|---|---|
| Hacer clic en "Deportes" | Solo se muestran los 2 juegos de deportes |
| Buscar "rally" | Aparece "Turbo Rally" |
| Enviar el formulario de contacto vacío | Los 3 campos se marcan en rojo con su mensaje |
| Escribir `correo@` en email | "Ingresa un email válido…" |
| Completar bien el formulario | Mensaje de éxito y formulario limpio |
| Agregar un videojuego sin datos | Se marcan los campos obligatorios |
| Agregar un videojuego válido | Aparece primero en el catálogo y aumenta el contador |
| Eliminar un videojuego | Desaparece del catálogo (y del carrito, si estaba) |
| Ver el sitio a 390 px de ancho | Menú hamburguesa, tarjetas en una columna, sin scroll horizontal |

---

## 👩‍💻 Autora

**Emily Rupay** — Desarrollo Frontend I (PFY2201), Duoc UC, 2026.

> Los videojuegos, portadas y precios son ficticios y se usan solo con fines académicos.
