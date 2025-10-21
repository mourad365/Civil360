/**
 * Hook personnalisé pour la persistance des données dans localStorage
 * avec support TypeScript et gestion d'erreurs
 */

import { useState, useEffect, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
}

/**
 * Hook pour stocker et récupérer des données dans localStorage
 * @param key Clé de stockage
 * @param initialValue Valeur initiale si aucune donnée n'existe
 * @param options Options de sérialisation
 * @returns [valeur, setter, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Serializers par défaut
  const serializer = options?.serializer ?? JSON.stringify;
  const deserializer = options?.deserializer ?? JSON.parse;

  // État local
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Setter personnalisé qui sauvegarde dans localStorage
   */
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permettre la valeur d'être une fonction comme useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Sauvegarder dans l'état
        setStoredValue(valueToStore);

        // Sauvegarder dans localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serializer(valueToStore));
          
          // Dispatcher un événement pour synchroniser entre onglets
          window.dispatchEvent(
            new CustomEvent('local-storage-change', {
              detail: { key, value: valueToStore },
            })
          );
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serializer, storedValue]
  );

  /**
   * Supprimer la valeur du localStorage
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        window.dispatchEvent(
          new CustomEvent('local-storage-change', {
            detail: { key, value: null },
          })
        );
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  /**
   * Écouter les changements dans localStorage (synchronisation entre onglets)
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key && e.key !== key) {
        return;
      }

      try {
        const detail = 'detail' in e ? e.detail : null;
        const newValue = detail?.value;

        if (newValue !== null && newValue !== undefined) {
          setStoredValue(newValue);
        } else if ('newValue' in e && e.newValue) {
          setStoredValue(deserializer(e.newValue));
        }
      } catch (error) {
        console.warn(`Error syncing localStorage key "${key}":`, error);
      }
    };

    // Écouter les événements natifs et personnalisés
    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('local-storage-change', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('local-storage-change', handleStorageChange as EventListener);
    };
  }, [key, deserializer]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook pour sauvegarder automatiquement avec debounce
 * @param key Clé de stockage
 * @param value Valeur à sauvegarder
 * @param delay Délai de debounce en ms (défaut: 500ms)
 */
export function useAutoSave<T>(key: string, value: T, delay: number = 500): void {
  const [, setValue] = useLocalStorage(key, value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, setValue]);
}

/**
 * Hook pour obtenir toutes les clés de localStorage avec un préfixe
 * @param prefix Préfixe des clés
 * @returns Liste des clés
 */
export function useLocalStorageKeys(prefix: string): string[] {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const filteredKeys = allKeys.filter(key => key.startsWith(prefix));
    setKeys(filteredKeys);
  }, [prefix]);

  return keys;
}

/**
 * Hook pour la sauvegarde avec état de chargement
 * @param key Clé de stockage
 * @param initialValue Valeur initiale
 * @returns [valeur, setter, removeValue, isLoading, error]
 */
export function useLocalStorageWithStatus<T>(
  key: string,
  initialValue: T
): [
  T,
  (value: T | ((val: T) => T)) => Promise<void>,
  () => Promise<void>,
  boolean,
  Error | null
] {
  const [storedValue, setStoredValue, removeStoredValue] = useLocalStorage(key, initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simuler async
        setStoredValue(value);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [setStoredValue]
  );

  const removeValue = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      removeStoredValue();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [removeStoredValue]);

  return [storedValue, setValue, removeValue, isLoading, error];
}

/**
 * Utilitaire pour exporter toutes les données localStorage
 * @param prefix Préfixe des clés à exporter (optionnel)
 * @returns Objet avec toutes les données
 */
export function exportLocalStorage(prefix?: string): Record<string, any> {
  const exported: Record<string, any> = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (!prefix || key.startsWith(prefix))) {
      try {
        const value = localStorage.getItem(key);
        exported[key] = value ? JSON.parse(value) : null;
      } catch {
        exported[key] = localStorage.getItem(key);
      }
    }
  }
  
  return exported;
}

/**
 * Utilitaire pour importer des données dans localStorage
 * @param data Données à importer
 * @param overwrite Si true, écrase les données existantes
 */
export function importLocalStorage(data: Record<string, any>, overwrite: boolean = false): void {
  Object.entries(data).forEach(([key, value]) => {
    if (overwrite || !localStorage.getItem(key)) {
      try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      } catch (error) {
        console.error(`Error importing key "${key}":`, error);
      }
    }
  });
}

/**
 * Utilitaire pour nettoyer localStorage selon un préfixe
 * @param prefix Préfixe des clés à nettoyer
 */
export function clearLocalStorage(prefix?: string): void {
  if (!prefix) {
    localStorage.clear();
    return;
  }

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
}
