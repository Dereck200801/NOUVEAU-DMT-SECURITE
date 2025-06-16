import { useState, useEffect, useMemo } from 'react';

type SearchableObject = Record<string, any>;

interface UseSearchOptions<T extends SearchableObject> {
  items: T[];
  searchableFields: (keyof T)[];
  initialSearchTerm?: string;
  debounceTime?: number;
}

/**
 * Hook personnalisé pour implémenter une fonctionnalité de recherche
 * @param options Options de configuration
 * @returns Objet contenant les résultats filtrés et les fonctions de gestion
 */
export function useSearch<T extends SearchableObject>({
  items,
  searchableFields,
  initialSearchTerm = '',
  debounceTime = 300
}: UseSearchOptions<T>) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);
  const [isSearching, setIsSearching] = useState(false);

  // Gestion du debounce pour éviter trop de recherches pendant la saisie
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, debounceTime);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, debounceTime]);

  // Filtrer les éléments en fonction du terme de recherche
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm) return items;

    return items.filter(item => {
      return searchableFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        
        // Gestion des tableaux
        if (Array.isArray(value)) {
          return value.some(v => 
            String(v).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          );
        }
        
        // Gestion des valeurs simples
        return String(value).toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      });
    });
  }, [items, debouncedSearchTerm, searchableFields]);

  // Réinitialiser la recherche
  const resetSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    isSearching,
    resetSearch,
    hasResults: filteredItems.length > 0,
    resultsCount: filteredItems.length
  };
} 