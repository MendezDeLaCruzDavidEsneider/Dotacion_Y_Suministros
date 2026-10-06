'use client';

import { useState, useEffect } from 'react';

/**
 * Hook que devuelve `true` solo después de que el componente se haya montado
 * en el cliente. Esto evita errores de hydration mismatch cuando se usa
 * estado persistido en localStorage (ej: Zustand persist).
 *
 * Uso: Renderiza contenido dependiente de localStorage solo cuando `hasMounted` es `true`.
 */
export function useHydration() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
