import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiHome, FiMap, FiBriefcase, FiBarChart2, FiFolder, FiShoppingBag,
  FiUser, FiSettings, FiLogOut, FiMenu, FiX, FiClock, FiUsers,
  FiClipboard, FiLayers, FiFileText,
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { roleLabel } from '../utils/constants';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t, lang, toggleLang, isRTL } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const NAV = [
    { to: '/app/dashboard',    label: t('nav.dashboard'),    icon: FiHome },
    { to: '/app/terrains',     label: t('nav.terrains'),     icon: FiMap },
    { to: '/app/projets',      label: t('nav.projets'),      icon: FiBriefcase },
    { to: '/app/sgy',          label: t('nav.sgy'),          icon: FiBarChart2 },
    { to: '/app/historique',   label: t('nav.historique'),   icon: FiClock },
    { to: '/app/documents',    label: t('nav.documents'),    icon: FiFolder },
    { to: '/app/marketplace',  label: t('nav.marketplace'),  icon: FiShoppingBag },
    { to: '/app/participation',label: t('nav.participation'),icon: FiLayers },
    { to: '/app/edd',          label: t('nav.edd'),          icon: FiFileText },
    { to: '/app/profil',       label: t('nav.profil'),       icon: FiUser },
  ];

  const ADMIN_NAV = [
    { to: '/app/admin',                end: true, label: t('nav.admin'),          icon: FiSettings },
    { to: '/app/admin/questionnaires', label: t('nav.questionnaires'), icon: FiClipboard },
    { to: '/app/admin/evaluations',    label: t('nav.evaluations'),    icon: FiUsers },
    { to: '/app/parametres',           label: t('nav.parametres'),     icon: FiSettings },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-5 flex items-center justify-between shrink-0">
        <div>
          <img src="/logo-v-no-back.png" alt="Logo" className=" " />
          {/* <h1 className="text-lg font-extrabold leading-tight">الإعمار الذكي</h1>
          <p className="text-xs text-white/60 mt-0.5">PropTech Algérie</p> */}
        </div>
        <button className="lg:hidden text-white" onClick={() => setOpen(false)}><FiX size={20} /></button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-white text-[#0F4C81]' : 'text-white/80 hover:bg-white/10'
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}

        {user?.role === 'administrateur' && (
          <>
            <div className="px-4 pt-4 pb-1">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">{t('nav.adminSection')}</p>
            </div>
            {ADMIN_NAV.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-white text-[#0F4C81]' : 'text-white/80 hover:bg-white/10'
                  }`
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="shrink-0 px-3 pb-5 space-y-1">
        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 transition-all"
        >
          <span className="text-base">{lang === 'fr' ? '🇩🇿' : '🇫🇷'}</span>
          {lang === 'fr' ? 'العربية' : 'Français'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 transition-all"
        >
          <FiLogOut size={17} />
          {t('nav.logout')}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">
      <aside className={`hidden lg:flex lg:flex-col fixed inset-y-0 w-64 bg-[#0F4C81] text-white z-30 ${isRTL ? 'right-0' : 'left-0'}`}>
        <SidebarContent />
      </aside>

      {open && (
        <div className={`fixed inset-0 z-40 flex lg:hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-64 bg-[#0F4C81] text-white flex flex-col h-full">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className={`flex-1 min-w-0 ${isRTL ? 'lg:mr-64' : 'lg:ml-64'}`}>
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button className="lg:hidden text-[#0F4C81]" onClick={() => setOpen(true)}><FiMenu size={22} /></button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#333333]">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{roleLabel(user?.role, lang)}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  );
}