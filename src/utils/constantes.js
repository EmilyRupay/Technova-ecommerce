// Valores compartidos por varios componentes.

// Categorías de la tienda. "Todos" se usa solo para el filtro.
export const CATEGORIAS = ['Acción', 'Aventura', 'Deportes', 'Carreras', 'Estrategia'];
export const FILTROS = ['Todos', ...CATEGORIAS];

// Íconos de Bootstrap Icons asociados a cada categoría.
export const ICONOS_CATEGORIA = {
  Todos: 'grid-3x3-gap',
  Acción: 'lightning-charge',
  Aventura: 'compass',
  Deportes: 'trophy',
  Carreras: 'speedometer2',
  Estrategia: 'puzzle'
};

// Imagen que se usa cuando un videojuego nuevo no trae portada.
export const IMAGEN_POR_DEFECTO = 'assets/img/sin-portada.svg';
