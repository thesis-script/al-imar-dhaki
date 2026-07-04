import { useState } from 'react';
import { FiLayers, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { Button, Card } from '../components/ui/UI';
import { useLang } from '../contexts/LanguageContext';

const PHASES = ['phase1', 'phase2', 'phase3'];

export default function Participation() {
  const { t } = useLang();
  const [interested, setInterested] = useState(null);
  const [sent, setSent] = useState(false);

  const actors = [
    {
      key: 'owner',
      icon: '🏗️',
      label: t('participation.owner'),
      desc: t('participation.ownerDesc'),
      color: '#0F4C81',
    },
    {
      key: 'promoteur',
      icon: '🏢',
      label: t('participation.promoteur'),
      desc: t('participation.promoteurDesc'),
      color: '#2E8B57',
    },
    {
      key: 'investisseur',
      icon: '💼',
      label: t('participation.investisseur'),
      desc: t('participation.investisseurDesc'),
      color: '#F4A300',
    },
  ];

  const archFeatures = t('participation.archFeatures') || [];

  const handleInterest = (key) => {
    setInterested(key);
    setSent(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <FiLayers className="text-[#0F4C81]" /> {t('participation.title')}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{t('participation.subtitle')}</p>
      </div>

      {/* Coming soon banner */}
      <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 border-[#0F4C81]/20">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="text-5xl">🚀</div>
          <div className="flex-1">
            <h3 className="font-extrabold text-lg text-[#0F4C81]">{t('participation.coming')}</h3>
            <p className="text-gray-500 text-sm mt-1">{t('participation.comingDesc')}</p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[#F4A300]/10 text-[#F4A300] text-xs font-bold uppercase tracking-wide">
            {t('participation.comingSoonBadge')}
          </span>
        </div>
      </Card>

      {/* Three actors */}
      <div className="grid md:grid-cols-3 gap-5">
        {actors.map((a) => (
          <Card key={a.key} className="flex flex-col text-center hover:-translate-y-1 transition-transform">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ backgroundColor: `${a.color}15` }}
            >
              {a.icon}
            </div>
            <h3 className="font-extrabold text-base mb-2" style={{ color: a.color }}>{a.label}</h3>
            <p className="text-sm text-gray-500 flex-1 mb-5">{a.desc}</p>
            {!sent ? (
              <Button
                variant="outline"
                className="mx-auto !text-xs !py-2 !px-4"
                onClick={() => handleInterest(a.key)}
              >
                {t('participation.interest')}
              </Button>
            ) : interested === a.key ? (
              <div className="flex items-center justify-center gap-2 text-[#2E8B57] text-xs font-semibold">
                <FiCheckCircle size={16} /> {t('participation.interestSent').split('.')[0]}
              </div>
            ) : (
              <Button variant="outline" className="mx-auto !text-xs !py-2 !px-4 opacity-40" disabled>
                {t('participation.interest')}
              </Button>
            )}
          </Card>
        ))}
      </div>

      {sent && (
        <Card className="bg-[#2E8B57]/5 border-[#2E8B57]/20">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-[#2E8B57]" size={22} />
            <p className="text-sm text-gray-600">{t('participation.interestSent')}</p>
          </div>
        </Card>
      )}

      {/* Roadmap */}
      <Card>
        <h3 className="font-extrabold mb-5">{t('participation.roadmap')}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {PHASES.map((ph, i) => (
            <div key={ph} className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold text-white"
                  style={{ backgroundColor: i === 0 ? '#0F4C81' : '#ccc' }}
                >
                  {i + 1}
                </div>
                {/* {i < 2 && <div className="hidden md:block h-0.5 flex-1 bg-gray-200 absolute left-full top-4 w-full -ml-4" />} */}
              </div>
              <p className="font-semibold text-sm">{t(`participation.${ph}`)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Architecture preview */}
      <Card>
        <h3 className="font-extrabold mb-4">{t('participation.archTitle')}</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {archFeatures.map((f) => (
            <div key={f.title} className="flex gap-3 p-3 rounded-xl bg-gray-50">
              <span className="text-xl shrink-0">{f.icon}</span>
              <div>
                <p className="font-semibold">{f.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}