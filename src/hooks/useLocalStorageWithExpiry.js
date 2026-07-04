import { useCallback, useEffect } from 'react';

const DEFAULT_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24h

export function getExpiryMs() {
  try {
    const raw = localStorage.getItem('__store__');
    const store = raw ? JSON.parse(raw) : {};
    const hours = store['settings']?.value?.retentionHours;
    if (hours && Number(hours) > 0) return Number(hours) * 60 * 60 * 1000;
  } catch {
    // ignore
  }
  return DEFAULT_EXPIRY_MS;
}

function readAll() {
  try {
    const raw = localStorage.getItem('__store__');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(store) {
  localStorage.setItem('__store__', JSON.stringify(store));
}

export function clearExpiredData() {
  const store = readAll();
  const now = Date.now();
  let changed = false;
  Object.keys(store).forEach((key) => {
    const entry = store[key];
    if (entry && entry.expiresAt && entry.expiresAt < now) {
      delete store[key];
      changed = true;
    }
  });
  if (changed) writeAll(store);
}

export function useLocalStorageWithExpiry() {
  useEffect(() => {
    clearExpiredData();
  }, []);

  const saveData = useCallback((key, value) => {
    const store = readAll();
    const now = Date.now();
    store[key] = {
      value,
      createdAt: now,
      updatedAt: now,
      expiresAt: now + getExpiryMs(),
    };
    writeAll(store);
    return store[key];
  }, []);

  const getData = useCallback((key, fallback = null) => {
    clearExpiredData();
    const store = readAll();
    const entry = store[key];
    return entry ? entry.value : fallback;
  }, []);

  const updateData = useCallback((key, updater) => {
    const store = readAll();
    const now = Date.now();
    const existing = store[key];
    const prevValue = existing ? existing.value : null;
    const nextValue = typeof updater === 'function' ? updater(prevValue) : updater;
    store[key] = {
      value: nextValue,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
      expiresAt: now + getExpiryMs(),
    };
    writeAll(store);
    return store[key];
  }, []);

  const deleteData = useCallback((key) => {
    const store = readAll();
    delete store[key];
    writeAll(store);
  }, []);

  return { saveData, getData, updateData, deleteData, clearExpiredData };
}

export default useLocalStorageWithExpiry;
