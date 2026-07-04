import { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorageWithExpiry } from '../hooks/useLocalStorageWithExpiry';
import { DEFAULT_QUESTIONNAIRE } from '../data/sgyQuestionnaire';

const DataContext = createContext(null);

const DEFAULT_SETTINGS = {
  platformName: 'الإعمار الذكي',
  logo: '',
  defaultLanguage: 'fr',
  retentionHours: 24,
};

// Helper: read raw value from __store__
function rawGet(key, fallback) {
  try {
    const store = JSON.parse(localStorage.getItem('__store__') || '{}');
    const entry = store[key];
    if (!entry) return fallback;
    if (entry.expiresAt && entry.expiresAt < Date.now()) return fallback;
    return entry.value ?? fallback;
  } catch {
    return fallback;
  }
}

function rawSet(key, value) {
  try {
    const store = JSON.parse(localStorage.getItem('__store__') || '{}');
    const now = Date.now();
    // get retention hours from settings
    let retentionMs = 24 * 60 * 60 * 1000;
    try {
      const h = store['settings']?.value?.retentionHours;
      if (h && Number(h) > 0) retentionMs = Number(h) * 60 * 60 * 1000;
    } catch {}
    const existing = store[key];
    store[key] = {
      value,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      expiresAt: now + retentionMs,
    };
    localStorage.setItem('__store__', JSON.stringify(store));
  } catch {}
}

export function DataProvider({ children }) {
  // Reactive state slices - each is an array or object stored in state
  const [terrains, setTerrains] = useState(() => rawGet('terrains', []));
  const [projets, setProjets] = useState(() => rawGet('projets', []));
  const [evaluations, setEvaluations] = useState(() => rawGet('evaluations', []));
  const [documents, setDocuments] = useState(() => rawGet('documents', []));
  const [annonces, setAnnonces] = useState(() => rawGet('annonces', []));

  const setters = {
    terrains: setTerrains,
    projets: setProjets,
    evaluations: setEvaluations,
    documents: setDocuments,
    annonces: setAnnonces,
  };

  const getList = (key) => {
    switch (key) {
      case 'terrains': return terrains;
      case 'projets': return projets;
      case 'evaluations': return evaluations;
      case 'documents': return documents;
      case 'annonces': return annonces;
      default: return rawGet(key, []);
    }
  };

  const add = useCallback((key, item) => {
    const newItem = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...item };
    if (setters[key]) {
      setters[key]((prev) => {
        const next = [...prev, newItem];
        rawSet(key, next);
        return next;
      });
    } else {
      const prev = rawGet(key, []);
      rawSet(key, [...prev, newItem]);
    }
    return newItem;
  }, []);

  const update = useCallback((key, id, patch) => {
    if (setters[key]) {
      setters[key]((prev) => {
        const next = prev.map((it) =>
          it.id === id ? { ...it, ...patch, updatedAt: new Date().toISOString() } : it
        );
        rawSet(key, next);
        return next;
      });
    } else {
      const prev = rawGet(key, []);
      rawSet(key, prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    }
  }, []);

  const remove = useCallback((key, id) => {
    if (setters[key]) {
      setters[key]((prev) => {
        const next = prev.filter((it) => it.id !== id);
        rawSet(key, next);
        return next;
      });
    } else {
      const prev = rawGet(key, []);
      rawSet(key, prev.filter((it) => it.id !== id));
    }
  }, []);

  // ---- Questionnaire SGY (éditable par l'admin) ----
  const getQuestionnaire = () => rawGet('questionnaire_sgy', DEFAULT_QUESTIONNAIRE);

  const saveQuestionnaire = (questionnaire) => {
    rawSet('questionnaire_sgy', questionnaire);
  };

  const resetQuestionnaire = () => {
    rawSet('questionnaire_sgy', DEFAULT_QUESTIONNAIRE);
  };

  // ---- Paramètres plateforme ----
  const getSettings = () => rawGet('settings', DEFAULT_SETTINGS);

  const saveSettings = (settings) => {
    rawSet('settings', { ...DEFAULT_SETTINGS, ...settings });
  };

  // Legacy list() helper for compatibility
  const list = getList;

  return (
    <DataContext.Provider
      value={{
        terrains,
        projets,
        evaluations,
        documents,
        annonces,
        list,
        add,
        update,
        remove,
        getQuestionnaire,
        saveQuestionnaire,
        resetQuestionnaire,
        getSettings,
        saveSettings,
        DEFAULT_SETTINGS,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
