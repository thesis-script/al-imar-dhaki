import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiGlobe } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LanguageContext';

/* ---------- decorative SVG buildings ---------- */
function BuildingIllustration() {
  return (
    <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
      {/* ... unchanged, keep your existing SVG content ... */}
    </svg>
  );
}

/* ---------- loading screen shown after successful login ---------- */
function LoadingScreen({ lang, isRTL }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fadeIn"
      style={{ background: 'linear-gradient(135deg, #0F4C81 0%, #0a3560 50%, #07254a 100%)' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* subtle pulsing rings behind logo */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-28 h-28 rounded-full border border-white/20 animate-ping-slow" />
        <div className="absolute w-20 h-20 rounded-full border border-white/30 animate-ping-slow" style={{ animationDelay: '0.3s' }} />
        <div className="relative w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl animate-pop">
          <img src="/logo-removebg-preview.png" alt="Logo" className="w-10 h-10 object-contain" />
        </div>
      </div>

      <p className="text-white/80 text-sm font-semibold mb-5 animate-floatUp">
        {lang === 'ar' ? 'جارٍ تجهيز لوحتك...' : 'Préparation de votre tableau de bord...'}
      </p>

      {/* progress bar */}
      <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-[#F4A300] animate-progressFill" />
      </div>
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const { t, lang, toggleLang, isRTL } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // NEW: controls the 2s loading screen

  const ArrowIcon = isRTL ? FiArrowLeft : FiArrowRight;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate async auth check
    try {
      login(form);
      setLoading(false);
      setSuccess(true); // show loading page instead of navigating immediately
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // NEW: once login succeeds, wait 2s on the loading screen, then go to dashboard
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      navigate('/app/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  if (success) {
    return <LoadingScreen lang={lang} isRTL={isRTL} />;
  }

  return (
    <div className="min-h-screen flex" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ===== LEFT PANEL (illustration) ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #0F4C81 0%, #0a3560 50%, #07254a 100%)' }}>

        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #F4A300, transparent)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-60 h-60 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #2E8B57, transparent)' }} />
        <div className="animate-pulse-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/10" />

        <div className="relative z-10 text-center animate-slideInLeft">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-2xl animate-pop"
            style={{ background: 'linear-gradient(135deg, #ffffff, #ffffff)' }}>
             <img src="/logo-removebg-preview.png" alt="Logo" className=" " />
          </div>
          <h1 className="text-4xl font-black text-white mb-1 tracking-tight">الإعمار الذكي</h1>
          <p className="text-white/60 text-base mb-12 font-medium">PropTech Algérie</p>

          <BuildingIllustration />

          <div className="mt-10 space-y-3">
            {[
              { icon: '📊', text: lang === 'ar' ? 'تحليل ذكي للمشاريع العقارية' : 'Analyse intelligente de projets immobiliers' },
              { icon: '🏆', text: lang === 'ar' ? 'نظام تقييم SGY المتطور' : 'Système d\'évaluation SGY avancé' },
              { icon: '🤝', text: lang === 'ar' ? 'منصة تعاون عقاري متكاملة' : 'Plateforme collaborative PropTech' },
            ].map((item, i) => (
              <div
                key={item.text}
                className="flex items-center gap-3 bg-white/8 rounded-xl px-4 py-2.5 animate-floatUp"
                style={{ animationDelay: `${0.15 + i * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/80 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL (form) ===== */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-[#F8FAFC] animate-slideInRight">

        <div className="w-full max-w-md flex justify-end mb-6">
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:border-[#0F4C81] hover:text-[#0F4C81] transition-all shadow-sm"
          >
            <FiGlobe size={16} />
            {lang === 'fr' ? 'العربية' : 'Français'}
          </button>
        </div>

        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8 lg:hidden animate-pop">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0F4C81, #0a3560)' }}>
              <span className="text-2xl font-black text-white">ع</span>
            </div>
            <h1 className="text-2xl font-black text-[#0F4C81]">الإعمار الذكي</h1>
            <p className="text-gray-400 text-xs mt-0.5">PropTech Algérie</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 animate-floatUp">
            <h2 className="text-2xl font-black text-[#0F4C81] mb-1">{t('auth.login')}</h2>
            <p className="text-gray-400 text-sm mb-7">{t('auth.loginSub')}</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3 mb-5 animate-floatUp">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t('auth.email')}</label>
                <div className="relative">
                  <FiMail className="absolute top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    style={{ [isRTL ? 'right' : 'left']: '14px' }} size={18} />
                  <input
                    type="email" required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder={t('placeholders.email') ?? 'vous@exemple.com'}
                    className="auth-input w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-700 placeholder-gray-300"
                    style={{ [isRTL ? 'paddingRight' : 'paddingLeft']: '44px', [isRTL ? 'paddingLeft' : 'paddingRight']: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t('auth.password')}</label>
                <div className="relative">
                  <FiLock className="absolute top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    style={{ [isRTL ? 'right' : 'left']: '14px' }} size={18} />
                  <input
                    type={showPwd ? 'text' : 'password'} required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="auth-input w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-700 placeholder-gray-300"
                    style={{ [isRTL ? 'paddingRight' : 'paddingLeft']: '44px', [isRTL ? 'paddingLeft' : 'paddingRight']: '44px' }}
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    style={{ [isRTL ? 'left' : 'right']: '14px' }}>
                    {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className={isRTL ? 'text-left' : 'text-right'}>
                <Link to="/forgot-password" className="text-xs font-semibold text-[#0F4C81] hover:underline">
                  {t('auth.forgot')}
                </Link>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-white text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                style={{ background: loading ? '#0c3c68' : 'linear-gradient(135deg, #0F4C81, #0c3c68)' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {loading ? (
                  <><div className="spinner" /> {lang === 'ar' ? 'جارٍ التحقق...' : 'Connexion en cours...'}</>
                ) : (
                  <>{t('auth.login')} <ArrowIcon size={16} /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium">{lang === 'ar' ? 'أو' : 'ou'}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-400">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-[#0F4C81] font-bold hover:underline">
                {t('auth.register')}
              </Link>
            </p>
          </div>

          {/* <p className="text-center text-xs text-gray-300 mt-6">
            © 2026 الإعمار الذكي — PropTech Algérie
          </p> */}
        </div>
      </div>
    </div>
  );
}