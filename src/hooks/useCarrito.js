import { useState, useEffect, useMemo } from 'react';

const CLAVE_CARRITO = 'technovagames_carrito'; // clave de localStorage

// Lee el carrito guardado (si existe y es válido).
function leerCarritoGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    if (!Array.isArray(guardado)) return [];
    return guardado.filter(
      (i) => i && Number.isFinite(i.precio) && Number.isInteger(i.cantidad) && i.cantidad > 0
    );
  } catch {
    return [];
  }
}

// Hook personalizado: concentra toda la lógica del carrito.
export default function useCarrito() {
  // useState con función inicial: lee localStorage solo una vez.
  const [carrito, setCarrito] = useState(leerCarritoGuardado);

  // useEffect: cada vez que cambia el carrito, se guarda en localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (e) {
      console.warn('No se pudo guardar el carrito:', e);
    }
  }, [carrito]);

  // Agrega un producto: si ya existe, suma una unidad.
  const agregar = (producto) =>
    setCarrito((actual) => {
      if (actual.some((i) => i.id === producto.id)) {
        return actual.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      const { id, nombre, precio, imagen, alt } = producto;
      return [...actual, { id, nombre, precio, imagen, alt, cantidad: 1 }];
    });

  // Suma o resta unidades; si llega a 0 se elimina el producto.
  const cambiarCantidad = (id, cambio) =>
    setCarrito((actual) =>
      actual
        .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + cambio } : i))
        .filter((i) => i.cantidad > 0)
    );

  const eliminar = (id) => setCarrito((actual) => actual.filter((i) => i.id !== id));
  const vaciar = () => setCarrito([]);

  // useMemo: recalcula los totales solo cuando cambia el carrito.
  const { unidades, monto } = useMemo(
    () =>
      carrito.reduce(
        (t, i) => ({ unidades: t.unidades + i.cantidad, monto: t.monto + i.precio * i.cantidad }),
        { unidades: 0, monto: 0 }
      ),
    [carrito]
  );

  return { carrito, unidades, monto, agregar, cambiarCantidad, eliminar, vaciar };
}
