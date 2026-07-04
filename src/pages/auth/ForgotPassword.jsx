import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiArrowRight, FiGlobe, FiCheckCircle } from 'react-icons/fi';
import { useLang } from '../../contexts/LanguageContext';

export default function ForgotPassword() {
  const { t, lang, toggleLang, isRTL } = useLang();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const BackArrow = isRTL ? FiArrowRight : FiArrowLeft;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">

        {/* lang toggle */}
        <div className="flex justify-end mb-6">
          <button onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-500 hover:border-[#0F4C81] hover:text-[#0F4C81] transition-all shadow-sm">
            <FiGlobe size={15} />
            {lang === 'fr' ? 'العربية' : 'Français'}
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 animate-floatUp">

          {!sent ? (
            <>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto"
                style={{ background: 'linear-gradient(135deg, #0F4C81, #0a3560)' }}>
                <FiMail className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-black text-[#0F4C81] mb-1 text-center">{t('forgot.title')}</h2>
              <p className="text-gray-400 text-sm mb-7 text-center">{t('forgot.subtitle')}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">{t('auth.email')}</label>
                  <div className="relative">
                    <FiMail className="absolute top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                      style={{ [isRTL ? 'right' : 'left']: '14px' }} size={17} />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="auth-input w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-700"
                      style={{ [isRTL ? 'paddingRight' : 'paddingLeft']: '44px', [isRTL ? 'paddingLeft' : 'paddingRight']: '14px' }}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #0F4C81, #0a3560)' }}>
                  {loading
                    ? <><div className="spinner" /> {lang === 'ar' ? 'جارٍ الإرسال...' : 'Envoi...'}</>
                    : t('forgot.send')
                  }
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-floatUp">
              <div className="w-16 h-16 rounded-full bg-[#2E8B57]/10 flex items-center justify-center mx-auto mb-5">
                <FiCheckCircle className="text-[#2E8B57]" size={32} />
              </div>
              <h3 className="font-black text-lg text-[#0F4C81] mb-2">{t('forgot.sent_title')}</h3>
              <p className="text-sm text-gray-400">
                {t('forgot.sent_desc')} <strong className="text-gray-600">{email}</strong>.
                <br /><span className="text-xs mt-1 block">{t('forgot.sent_note')}</span>
              </p>
            </div>
          )}

          <div className={`mt-6 flex ${isRTL ? 'justify-start' : 'justify-start'}`}>
            <Link to="/login" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0F4C81] font-medium transition-colors">
              <BackArrow size={15} /> {t('forgot.back')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
