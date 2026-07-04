import { useLang } from '../contexts/LanguageContext';
import { useState } from 'react';
import { FiSave, FiUser } from 'react-icons/fi';
import { Button, Card, Input, Select } from '../components/ui/UI';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { getRoles, roleLabel } from '../utils/constants';

export default function Profil() {
  const { t, lang } = useLang();
  const { user, updateProfile } = useAuth();
  const { terrains, projets, annonces } = useData();
  const [form, setForm] = useState({ name: user?.name || '', role: user?.role || 'investisseur' });
  const [saved, setSaved] = useState(false);

  const roleOptions = getRoles(lang);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold">{t('profil.title')}</h2>
        <p className="text-gray-500 text-sm mt-1">{t('profil.subtitle_full')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="text-center lg:col-span-1">
          <div className="w-20 h-20 rounded-full bg-[#0F4C81] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            {user?.name?.[0]?.toUpperCase() || <FiUser />}
          </div>
          <p className="font-bold text-lg">{user?.name}</p>
          <p className="text-sm text-gray-400 mb-4">{user?.email}</p>
          <span className="inline-block px-3 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold">
            {roleLabel(user?.role, lang)}
          </span>

          <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100">
            <div><p className="font-extrabold text-[#0F4C81]">{terrains.length}</p><p className="text-xs text-gray-400">{t('profil.stat_terrains')}</p></div>
            <div><p className="font-extrabold text-[#2E8B57]">{projets.length}</p><p className="text-xs text-gray-400">{t('profil.stat_projets')}</p></div>
            <div><p className="font-extrabold text-[#F4A300]">{annonces.filter(a => a.auteurId === user?.id).length}</p><p className="text-xs text-gray-400">{t('profil.stat_annonces')}</p></div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-bold mb-4">{t('profil.info_title')}</h3>
          <form onSubmit={handleSubmit}>
            <Input label={t('profil.fullname')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label={t('profil.email')} value={user?.email} disabled className="bg-gray-50 text-gray-400" />
            <Select label={t('profil.accountType')} options={roleOptions} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <div className="flex items-center gap-3">
              <Button type="submit"><FiSave /> {t('common.save')}</Button>
              {saved && <span className="text-sm text-[#2E8B57] font-medium">{t('profil.saved')}</span>}
            </div>
          </form>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold mb-2">{t('profil.storage_title')}</h3>
        <p className="text-sm text-gray-500">{t('profil.storage_desc')}</p>
      </Card>
    </div>
  );
}