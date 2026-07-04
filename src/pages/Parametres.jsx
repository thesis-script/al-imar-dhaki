import { useState } from 'react';
import { FiSave, FiSettings } from 'react-icons/fi';
import { Button, Card, Input } from '../components/ui/UI';
import { useData } from '../contexts/DataContext';
import { useLang } from '../contexts/LanguageContext';

export default function Parametres() {
  const { getSettings, saveSettings } = useData();
  const { t } = useLang();
  const [form, setForm] = useState(getSettings());
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <FiSettings className="text-[#0F4C81]" /> {t('parametres.title')}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{t('parametres.subtitle')}</p>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <Input
            label={t('parametres.platformName')}
            value={form.platformName}
            onChange={(e) => setForm({ ...form, platformName: e.target.value })}
          />
          <Input
            label={t('parametres.retentionHours')}
            type="number"
            min={1}
            value={form.retentionHours}
            onChange={(e) => setForm({ ...form, retentionHours: e.target.value })}
          />
          <p className="text-xs text-gray-400 -mt-2 mb-4">
            {t('parametres.retentionHint')}
          </p>
          <div className="flex items-center gap-3">
            <Button type="submit"><FiSave /> {t('common.save')}</Button>
            {saved && <span className="text-sm text-[#2E8B57] font-medium">{t('parametres.saved')}</span>}
          </div>
        </form>
      </Card>
    </div>
  );
}