import { useEffect, RefObject } from 'react';

type Handler = () => void;

function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  excludeRefs: RefObject<HTMLElement>[] = []
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Si le ref n'est pas initialisé ou si on clique sur l'élément lui-même
      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      // Vérifie si le clic est sur un des éléments exclus
      const isExcluded = excludeRefs.some(
        excludeRef => excludeRef.current && excludeRef.current.contains(target)
      );

      if (isExcluded) {
        return;
      }

      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, excludeRefs]);
}

export default useClickOutside; 