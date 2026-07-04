import { useState } from 'react';
import { FiFileText, FiCheckCircle, FiBell } from 'react-icons/fi';
import { Button, Card } from '../components/ui/UI';
import { useLang } from '../contexts/LanguageContext';

export default function EDD() {
  const { t } = useLang();
  const [notified, setNotified] = useState(false);

  const features = [
    { key: 'feature1', icon: '🏠' },
    { key: 'feature2', icon: '📐' },
    { key: 'feature3', icon: '📄' },
    { key: 'feature4', icon: '🔗' },
  ];

  const steps = t('edd.processSteps') || [];
  const legalPoints = t('edd.legalPoints') || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <FiFileText className="text-[#0F4C81]" /> {t('edd.title')}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{t('edd.subtitle')}</p>
      </div>

      {/* Banner */}
      <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#F4A300]/5 border-[#0F4C81]/20">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="text-5xl">📋</div>
          <div className="flex-1">
            <h3 className="font-extrabold text-lg text-[#0F4C81]">{t('edd.coming')}</h3>
            <p className="text-gray-500 text-sm mt-1">{t('edd.comingDesc')}</p>
          </div>
          <span className="shrink-0 px-4 py-1.5 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold uppercase tracking-wide">
            {t('edd.roadmapBadge')}
          </span>
        </div>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-5">
        {features.map((f) => (
          <Card key={f.key} className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#0F4C81]/10 flex items-center justify-center text-2xl shrink-0">
              {f.icon}
            </div>
            <div>
              <h4 className="font-bold mb-1">{t(`edd.${f.key}`)}</h4>
              <p className="text-sm text-gray-500">{t(`edd.${f.key}Desc`)}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Process steps */}
      <Card>
        <h3 className="font-extrabold mb-5">{t('edd.processTitle')}</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: `#0F4C81${i === 0 ? '' : '30'}` }}
                >
                  {s.num}
                </span>
              </div>
              <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Legal context */}
      <Card className="bg-amber-50 border-amber-200">
        <h3 className="font-bold mb-3 text-amber-800">{t('edd.legalTitle')}</h3>
        <ul className="space-y-2 text-sm text-amber-700">
          {legalPoints.map((point, i) => (
            <li key={i}>• {point}</li>
          ))}
        </ul>
      </Card>

      {/* Notify */}
      <Card className="text-center py-8">
        {!notified ? (
          <>
            <FiBell className="mx-auto text-[#0F4C81] mb-3" size={32} />
            <p className="font-bold mb-2">{t('edd.notify')}</p>
            <p className="text-sm text-gray-500 mb-5">{t('edd.notifyDesc')}</p>
            <Button onClick={() => setNotified(true)} className="mx-auto">
              <FiBell /> {t('edd.notify')}
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <FiCheckCircle className="text-[#2E8B57]" size={32} />
            <p className="font-bold text-[#2E8B57]">{t('edd.notified')}</p>
          </div>
        )}
      </Card>
    </div>
  );
}