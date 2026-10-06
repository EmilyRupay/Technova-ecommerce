import { useState, useEffect, useCallback } from 'react';
import { rutaPublica } from '../utils/helpers';

const RUTA_DATOS = 'assets/data/videojuegos.json';
const RETARDO_SIMULADO = 600; // ms: simula la latencia de una API real

// Hook personalizado: carga los videojuegos desde un archivo JSON y los guarda
// en el ESTADO de React. También expone funciones para agregar y eliminar.
export default function useVideojuegos() {
  const [videojuegos, setVideojuegos] = useState([]); // lista del catálogo
  const [cargando, setCargando] = useState(true);     // ¿se está cargando?
  const [error, setError] = useState(null);           // mensaje de error, si hay
  const [intento, setIntento] = useState(0);          // cambia al presionar "Reintentar"

  // useEffect: se ejecuta al montar el componente (y cada vez que cambia `intento`).
  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);

    const temporizador = setTimeout(async () => {
      try {
        const respuesta = await fetch(rutaPublica(RUTA_DATOS));
        if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        if (!Array.isArray(datos)) throw new Error('El JSON no tiene el formato esperado');
        if (!cancelado) setVideojuegos(datos);
      } catch (e) {
        console.error('No se pudieron cargar los videojuegos:', e);
        if (!cancelado) setError(e.message);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }, RETARDO_SIMULADO);

    // Limpieza: evita actualizar el estado si el componente se desmonta.
    return () => {
      cancelado = true;
      clearTimeout(temporizador);
    };
  }, [intento]);

  // AGREGAR: crea una copia del arreglo con el nuevo videojuego al inicio.
  // El id es el mayor id existente + 1.
  const agregar = useCallback((datos) => {
    setVideojuegos((actual) => {
      const id = actual.reduce((max, v) => Math.max(max, v.id), 0) + 1;
      return [{ ...datos, id }, ...actual];
    });
  }, []);

  // ELIMINAR: filtra el arreglo dejando fuera el videojuego con ese id.
  const eliminar = useCallback((id) => {
    setVideojuegos((actual) => actual.filter((v) => v.id !== id));
  }, []);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  return { videojuegos, cargando, error, agregar, eliminar, reintentar };
}
