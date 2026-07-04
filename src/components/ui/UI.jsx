export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl card-shadow border border-gray-100 p-5 ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    outline: 'border-2 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white transition-all',
    ghost: 'text-[#333333] hover:bg-gray-100 transition-all',
    danger: 'bg-red-500 text-white hover:bg-red-600 transition-all',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, className = '', ...props }) {
  return (
    <label className="block mb-4">
      {label && <span className="block text-sm font-medium text-[#333333] mb-1.5">{label}</span>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 outline-none transition-all bg-white ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, options, className = '', ...props }) {
  return (
    <label className="block mb-4">
      {label && <span className="block text-sm font-medium text-[#333333] mb-1.5">{label}</span>}
      <select
        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 outline-none transition-all bg-white ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextArea({ label, className = '', ...props }) {
  return (
    <label className="block mb-4">
      {label && <span className="block text-sm font-medium text-[#333333] mb-1.5">{label}</span>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 outline-none transition-all bg-white ${className}`}
        rows={4}
        {...props}
      />
    </label>
  );
}

export function Badge({ children, color = '#0F4C81' }) {
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      {children}
    </span>
  );
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto animate-fadeUp`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold text-[#0F4C81]">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="font-semibold text-[#333333]">{title}</p>
      {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
