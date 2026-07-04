import { createContext, useContext, useEffect, useState } from 'react';
import { useLang } from './LanguageContext'; // adjust path as needed

const AuthContext = createContext(null);

const EXPIRY_MS = 24 * 60 * 60 * 1000;

function readStore() {
  try { return JSON.parse(localStorage.getItem('__store__') || '{}'); } catch { return {}; }
}
function writeStore(s) { localStorage.setItem('__store__', JSON.stringify(s)); }

function loadKey(key, fallback) {
  const store = readStore();
  const entry = store[key];
  if (!entry) return fallback;
  if (entry.expiresAt && entry.expiresAt < Date.now()) return fallback;
  return entry.value ?? fallback;
}

function saveKey(key, value) {
  const store = readStore();
  const now = Date.now();
  store[key] = { value, createdAt: store[key]?.createdAt ?? now, updatedAt: now, expiresAt: now + EXPIRY_MS };
  writeStore(store);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(loadKey('users', []));
    const session = loadKey('session', null);
    if (session) setUser(session);
    setLoading(false);
  }, []);

  const register = ({ name, email, password, role }) => {
    const list = loadKey('users', []);
    if (list.find((u) => u.email === email)) throw new Error('Cet email est déjà utilisé.');
    const newUser = { id: crypto.randomUUID(), name, email, password, role: role || 'investisseur', createdAt: new Date().toISOString() };
    const next = [...list, newUser];
    saveKey('users', next);
    setUsers(next);
    const session = { ...newUser }; delete session.password;
    saveKey('session', session);
    setUser(session);
    return session;
  };

  const { t } = useLang();

  const login = ({ email, password }) => {
    const list = loadKey('users', []);
    const found = list.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error(t('auth.invalidCredentials'));
    const session = { ...found }; delete session.password;
    saveKey('session', session);
    setUser(session);
    return session;
  };

  const logout = () => {
    const store = readStore();
    delete store['session'];
    writeStore(store);
    setUser(null);
  };

  const updateProfile = (patch) => {
    const list = loadKey('users', []);
    const next = list.map((u) => u.id === user.id ? { ...u, ...patch } : u);
    saveKey('users', next);
    setUsers(next);
    const session = { ...user, ...patch };
    saveKey('session', session);
    setUser(session);
  };

  const getUsers = () => users;

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile, getUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
