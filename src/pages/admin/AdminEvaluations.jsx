import { useMemo, useState } from 'react';
import { FiSearch, FiEye, FiTrash2, FiDownload } from 'react-icons/fi';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Badge, Button, Card, EmptyState, Modal, Select } from '../../components/ui/UI';
import { ScoreGauge, ScoreBar } from '../../components/ui/Gauge';
import { useData } from '../../contexts/DataContext';
import { useLang } from '../../contexts/LanguageContext';
import { classifySGY } from '../../data/sgyQuestionnaire';
import { generateSGYReport } from '../../utils/pdfReport';

export default function AdminEvaluations() {
  const { evaluations, remove } = useData();
  const { t, lang } = useLang();

  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('Toutes');
  const [detail, setDetail] = useState(null);

  // stable French keys — same canonical values classifySGY() returns.
  // display labels are translated via trClass() below.
  const classifications = ['Excellent', 'Très bon', 'Bon', 'Moyen', 'À améliorer'];
  const trClass = (label) => t(`dashboard.classifications.${label}`) || label;

  const classFilterOptions = [
    { value: 'Toutes', label: t('common.all') },
    ...classifications.map(c => ({ value: c, label: trClass(c) })),
  ];

  const filtered = useMemo(() => {
    let res = evaluations.filter(e =>
      (e.projetNom || '').toLowerCase().includes(query.toLowerCase()) ||
      (e.userName || '').toLowerCase().includes(query.toLowerCase())
    );
    if (classFilter !== 'Toutes') res = res.filter(e => e.classification === classFilter);
    return res.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [evaluations, query, classFilter]);

  const handleDelete = id => { if (confirm(t('common.confirm_delete'))) remove('evaluations', id); };

  const dateLocale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold">{t('admin_evaluations.title')}</h2>
        <p className="text-gray-500 text-sm mt-1">{evaluations.length} {t('admin_evaluations.subtitle')}</p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F4C81] outline-none"
              placeholder={t('admin_evaluations.search')} value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <Select className="!mb-0" options={classFilterOptions} value={classFilter} onChange={e => setClassFilter(e.target.value)} />
        </div>
      </Card>

      {!filtered.length ? (
        <Card><EmptyState icon="📋" title={t('admin_evaluations.no_result')} /></Card>
      ) : (
        <Card className="!p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                {[t('admin_evaluations.col_projet'), t('admin_evaluations.col_user'), t('admin_evaluations.col_date'), t('admin_evaluations.col_score'), t('admin_evaluations.col_class'), t('admin_evaluations.col_actions')]
                  .map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const c = classifySGY(e.score);
                return (
                  <tr key={e.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{e.projetNom}</td>
                    <td className="px-4 py-3 text-gray-500">{e.userName || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(e.createdAt).toLocaleDateString(dateLocale)}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: c.color }}>{e.score}/100</td>
                    <td className="px-4 py-3"><Badge color={c.color}>{trClass(c.label)}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => setDetail(e)} className="text-[#0F4C81]"><FiEye size={16} /></button>
                        <button onClick={() => generateSGYReport(e, e.userName)} className="text-[#2E8B57]"><FiDownload size={16} /></button>
                        <button onClick={() => handleDelete(e.id)} className="text-red-500"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `${t('admin_evaluations.detail_title')} ${detail.projetNom}` : ''} wide>
        {detail && (() => {
          const c = classifySGY(detail.score);
          return (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ScoreGauge score={detail.score} color={c.color} label={trClass(c.label)} size={140} />
                <div className="flex-1 space-y-3 w-full">
                  {detail.categoryScores?.map(cat => (
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
                  data={detail.categoryScores?.map(cc => ({
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
              <div className="flex justify-end">
                <Button onClick={() => generateSGYReport(detail, detail.userName)}><FiDownload /> {t('admin_evaluations.export_pdf')}</Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}