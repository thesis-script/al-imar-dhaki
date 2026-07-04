import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiGlobe, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LanguageContext';
import { getRoles } from '../../utils/constants';

export default function Register() {
  const { register } = useAuth();
  const { t, lang, toggleLang, isRTL } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'investisseur' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ArrowIcon = isRTL ? FiArrowLeft : FiArrowRight;

  // value stays the stable French key stored on the user record;
  // label switches between fr/ar depending on the active language.
  const roles = getRoles(lang);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    try {
      register(form);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const perks = lang === 'ar'
    ? ['تقييم ذكي للمشاريع بنظام SGY', 'إدارة العقارات والوثائق', 'سوق عقاري تعاوني', 'تقارير PDF احترافية']
    : ['Évaluation SGY intelligente', 'Gestion terrains & documents', 'Marketplace collaborative', 'Rapports PDF professionnels'];

  return (
    <div className="min-h-screen flex" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* LEFT panel */}
      <div className="hidden lg:flex lg:w-2/5 relative flex-col items-center justify-center p-10"
        style={{ background: 'linear-gradient(160deg, #0a3560 0%, #0F4C81 60%, #2E8B57 100%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #F4A300 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2E8B57 0%, transparent 50%)' }} />

        <div className="relative z-10 text-center animate-slideInLeft w-full max-w-xs">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #ffffff, #ffffff)' }}>
            <img src="/logo-removebg-preview.png" alt="Logo" className=" " />
          </div>
          <h1 className="text-3xl font-black text-white mb-1">الإعمار الذكي</h1>
          <p className="text-white/50 text-sm mb-10">PropTech Algérie</p>

          <div className="space-y-3 text-left">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">
              {lang === 'ar' ? 'ما ستحصل عليه' : 'Ce que vous obtenez'}
            </p>
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
                <FiCheckCircle className="text-[#2E8B57] shrink-0" size={16} />
                <span className="text-white/80 text-sm">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-[#F8FAFC] animate-slideInRight">

        <div className="w-full max-w-md flex justify-end mb-4">
          <button onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-500 hover:border-[#0F4C81] hover:text-[#0F4C81] transition-all shadow-sm">
            <FiGlobe size={15} />
            {lang === 'fr' ? 'العربية' : 'Français'}
          </button>
        </div>

        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6 lg:hidden">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0F4C81, #0a3560)' }}>
              <span className="text-xl font-black text-white">ع</span>
            </div>
            <h1 className="text-xl font-black text-[#0F4C81]">الإعمار الذكي</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-black text-[#0F4C81] mb-1">{t('auth.register')}</h2>
            <p className="text-gray-400 text-sm mb-6">{t('auth.registerSub')}</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3 mb-5 animate-floatUp">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t('auth.name')}</label>
                <div className="relative">
                  <FiUser className="absolute top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    style={{ [isRTL ? 'right' : 'left']: '14px' }} size={17} />
                  <input type="text" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Votre nom complet'}
                    className="auth-input w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-700 placeholder-gray-300"
                    style={{ [isRTL ? 'paddingRight' : 'paddingLeft']: '44px', [isRTL ? 'paddingLeft' : 'paddingRight']: '14px' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t('auth.email')}</label>
                <div className="relative">
                  <FiMail className="absolute top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    style={{ [isRTL ? 'right' : 'left']: '14px' }} size={17} />
                  <input type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="auth-input w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-700 placeholder-gray-300"
                    style={{ [isRTL ? 'paddingRight' : 'paddingLeft']: '44px', [isRTL ? 'paddingLeft' : 'paddingRight']: '14px' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t('auth.password')}</label>
                <div className="relative">
                  <FiLock className="absolute top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    style={{ [isRTL ? 'right' : 'left']: '14px' }} size={17} />
                  <input type={showPwd ? 'text' : 'password'} required minLength={4}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="auth-input w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-700 placeholder-gray-300"
                    style={{ [isRTL ? 'paddingRight' : 'paddingLeft']: '44px', [isRTL ? 'paddingLeft' : 'paddingRight']: '44px' }}
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    style={{ [isRTL ? 'left' : 'right']: '14px' }}>
                    {showPwd ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t('auth.role')}</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="auth-input w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  {roles.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-white text-sm transition-all disabled:opacity-70 mt-2"
                style={{ background: 'linear-gradient(135deg, #2E8B57, #256b43)' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {loading
                  ? <><div className="spinner" /> {lang === 'ar' ? 'جارٍ الإنشاء...' : 'Création...'}</>
                  : <>{t('auth.register')} <ArrowIcon size={16} /></>
                }
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="text-[#0F4C81] font-bold hover:underline">{t('auth.login')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}