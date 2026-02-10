import { useState, useEffect } from 'react';

// This hook provides a state that is persisted in the browser's localStorage.
// It ensures that any data managed by this hook (like user profiles, journal entries, etc.)
// is saved across browser sessions, making the user's data persistent on their device.
// FIX: Update function signature to allow a function updater for the value.
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prevState: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // ! FIX: Use functional updater to avoid stale closure race condition.
  // * Previous implementation captured `storedValue` via closure, so rapid
  //   sequential updates (e.g. XP + stardust + achievement in one tick) would
  //   all read the same stale value, causing data loss.
  const setValue = (value: T | ((prevState: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;