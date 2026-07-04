import { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 bg-[#0F4C81] text-white px-5 py-3 rounded-2xl shadow-2xl animate-fadeDown min-w-[260px]"
          >
            <FiCheckCircle size={18} className="text-[#F4A300] shrink-0" />
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => remove(toast.id)} className="text-white/60 hover:text-white">
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);