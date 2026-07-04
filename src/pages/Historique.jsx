import { useLang } from '../contexts/LanguageContext';
import { useMemo, useState } from 'react';
import { FiSearch, FiEye, FiTrash2, FiCopy, FiDownload, FiClock } from 'react-icons/fi';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Badge, Button, Card, EmptyState, Modal, Select } from '../components/ui/UI';
import { ScoreGauge, ScoreBar } from '../components/ui/Gauge';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { classifySGY, getRecommendations, getClassificationDescription } from '../data/sgyQuestionnaire';
import { generateSGYReport } from '../utils/pdfReport';

export default function Historique() {
  const { t, lang } = useLang();
  const { evaluations, add, remove } = useData();
  const { user } = useAuth();

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [detail, setDetail] = useState(null);

  // classifySGY() keeps returning the canonical French label as a stable key;
  // this translates it for display only (see dashboard.classifications in translations.js).
  const trClass = (label) => t(`dashboard.classifications.${label}`) || label;

  const filtered = useMemo(() => {
    let res = evaluations.filter((e) => (e.projetNom || '').toLowerCase().includes(query.toLowerCase()));
    if (sortBy === 'recent') res = res.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'score_desc') res = res.slice().sort((a, b) => b.score - a.score);
    if (sortBy === 'score_asc') res = res.slice().sort((a, b) => a.score - b.score);
    if (sortBy === 'nom') res = res.slice().sort((a, b) => (a.projetNom || '').localeCompare(b.projetNom || ''));
    return res;
  }, [evaluations, query, sortBy]);

  const handleDelete = (id) => { if (confirm(t('historique.confirm_delete_eval'))) remove('evaluations', id); };

  const handleDuplicate = (e) => {
    const { id, createdAt, updatedAt, ...rest } = e;
    add('evaluations', { ...rest, projetNom: `${e.projetNom} (${t('common.copy') || 'copie'})` });
  };

  const dateLocale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2"><FiClock className="text-[#0F4C81]" /> {t('historique.title')}</h2>
        <p className="text-gray-500 text-sm mt-1">{evaluations.length} {t('historique.subtitle')}</p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F4C81] outline-none"
              placeholder={t('historique.search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select
            className="!mb-0"
            options={[
              { value: 'recent', label: t('historique.sort_recent') },
              { value: 'score_desc', label: t('historique.sort_score_desc') },
              { value: 'score_asc', label: t('historique.sort_score_asc') },
              { value: 'nom', label: t('historique.sort_nom') },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </Card>

      {!filtered.length ? (
        <Card><EmptyState icon="🕓" title={t('historique.noResult')} subtitle={t('historique.noResultSub')} /></Card>
      ) : (
        <Card className="!p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">{t('historique.projet')}</th>
                <th className="text-left px-4 py-3">{t('historique.date')}</th>
                <th className="text-left px-4 py-3">{t('historique.score')}</th>
                <th className="text-left px-4 py-3">{t('historique.classification')}</th>
                <th className="text-left px-4 py-3">{t('historique.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const c = classifySGY(e.score);
                return (
                  <tr key={e.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{e.projetNom}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(e.createdAt).toLocaleString(dateLocale)}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: c.color }}>{e.score}/100</td>
                    <td className="px-4 py-3"><Badge color={c.color}>{c.icon} {trClass(c.label)}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => setDetail(e)} className="text-[#0F4C81]" title={t('historique.consult')}><FiEye size={16} /></button>
                        <button onClick={() => generateSGYReport(e, user?.name)} className="text-[#2E8B57]" title={t('historique.export_pdf')}><FiDownload size={16} /></button>
                        <button onClick={() => handleDuplicate(e)} className="text-[#F4A300]" title={t('historique.duplicate')}><FiCopy size={16} /></button>
                        <button onClick={() => handleDelete(e.id)} className="text-red-500" title={t('historique.delete')}><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `${t('historique.detail_title')} ${detail.projetNom}` : ''} wide>
        {detail && (() => {
          const c = classifySGY(detail.score);
          const recs = getRecommendations(detail.categoryScores, lang);
          return (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ScoreGauge score={detail.score} color={c.color} label={trClass(c.label)} size={140} />
                <div className="flex-1 space-y-3 w-full">
                  {detail.categoryScores.map((cat) => (
                    <ScoreBar
                      key={cat.key}
                      label={lang === 'ar' ? (cat.label_ar || cat.label) : cat.label}
                      percentage={cat.percentage}
                      color={classifySGY(cat.percentage).color}
                    />
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart
                  data={detail.categoryScores.map((cc) => ({
                    critere: lang === 'ar' ? (cc.label_ar || cc.label) : cc.label,
                    valeur: cc.percentage,
                  }))}
                  outerRadius={75}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="critere" fontSize={10} />
                  <PolarRadiusAxis domain={[0, 100]} fontSize={9} />
                  <Radar dataKey="valeur" stroke={c.color} fill={c.color} fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
              <div>
                <h4 className="font-bold mb-2">{t('historique.analyse')}</h4>
                <p className="text-sm text-gray-500">{getClassificationDescription(c, lang)}</p>
              </div>
              {!!recs.length && (
                <div>
                  <h4 className="font-bold mb-2">{t('historique.recommandations')}</h4>
                  <ul className="space-y-1.5">
                    {recs.map((r) => (
                      <li key={r.categorie} className="text-sm text-gray-500">• <strong>{r.categorie}</strong> — {r.texte}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => generateSGYReport(detail, user?.name)}><FiDownload /> {t('historique.export_pdf_full')}</Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}