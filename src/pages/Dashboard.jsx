import { useMemo } from 'react';
import { FiMap, FiBriefcase, FiFolder, FiAward, FiTrendingUp, FiBarChart2, FiClock, FiShoppingBag, FiActivity } from 'react-icons/fi';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { Badge, Card } from '../components/ui/UI';
import { ScoreGauge } from '../components/ui/Gauge';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { classifySGY } from '../data/sgyQuestionnaire';

const CLASS_COLORS = { 'Excellent': '#2E8B57', 'Très bon': '#0F4C81', 'Bon': '#F4A300', 'Moyen': '#d98e00', 'À améliorer': '#c0392b' };

export default function Dashboard() {
  const { terrains, projets, evaluations, documents, annonces } = useData();
  const { user } = useAuth();
  const { t } = useLang();

  const trClass = (label) => t(`dashboard.classifications.${label}`) || label;

  // 1. base values first
  const moyenneSGY = useMemo(() =>
    evaluations.length ? Math.round(evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length) : 0,
    [evaluations]);

  const meilleurScore = useMemo(() =>
    evaluations.reduce((max, e) => Math.max(max, e.score), 0),
    [evaluations]);

  const derniereEval = useMemo(() =>
    evaluations.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0],
    [evaluations]);

  // 2. things that depend on moyenneSGY come after
  const classification = classifySGY(moyenneSGY);

  const repartition = useMemo(() => {
    const g = {};
    evaluations.forEach(e => { g[e.classification] = (g[e.classification] || 0) + 1; });
    return Object.entries(g).map(([name, value]) => ({ name, label: trClass(name), value }));
  }, [evaluations, t]);

  const evolutionScores = useMemo(() =>
    evaluations.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-10).map((e, i) => ({ name: `#${i + 1}`, score: e.score })),
    [evaluations]);

  const radarData = useMemo(() => {
    if (!evaluations.length) return [];
    const map = {};
    evaluations.forEach(e => (e.categoryScores || []).forEach(c => {
      if (!map[c.label]) map[c.label] = { total: 0, count: 0 };
      map[c.label].total += c.percentage; map[c.label].count += 1;
    }));
    return Object.entries(map).map(([label, { total, count }]) => ({ critere: label, valeur: Math.round(total / count) }));
  }, [evaluations]);

  const recentes = evaluations.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const kpis = [
    { label: t('dashboard.kpi_niveau'), value: trClass(classification.label), icon: FiAward, color: classification.color },
    { label: t('dashboard.kpi_projets'), value: projets.length, icon: FiBriefcase, color: '#0F4C81' },
    { label: t('dashboard.kpi_sgy'), value: `${moyenneSGY}/100`, icon: FiBarChart2, color: '#2E8B57' },
    { label: t('dashboard.kpi_opportunites'), value: annonces.length, icon: FiShoppingBag, color: '#F4A300' },
    { label: t('dashboard.kpi_analyses'), value: evaluations.length, icon: FiActivity, color: '#c0392b' },
    { label: t('dashboard.kpi_terrains'), value: terrains.length, icon: FiMap, color: '#0F4C81' },
    { label: t('dashboard.kpi_documents'), value: documents.length, icon: FiFolder, color: '#2E8B57' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold">{t('dashboard.welcome')} {user?.name} 👋</h2>
        <p className="text-gray-500 text-sm mt-1">{t('dashboard.subtitle')}</p>
      </div>

      {/* SGY Hero */}
      <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0c3c68] text-white">
        <div className="grid lg:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center text-center">
            <ScoreGauge score={moyenneSGY} color="#F4A300" label={t('dashboard.kpi_sgy')} size={150} />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-2">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-white/70">{t('dashboard.totalEval')}</p>
              <p className="text-2xl font-extrabold mt-1">{evaluations.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-white/70">{t('dashboard.bestScore')}</p>
              <p className="text-2xl font-extrabold mt-1">{meilleurScore}/100</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 col-span-2">
              <p className="text-xs text-white/70">{t('dashboard.lastEval')}</p>
              {derniereEval ? (
                <div className="flex items-center justify-between mt-1">
                  <p className="font-semibold">{derniereEval.projetNom}</p>
                  <Badge color="#F4A300">{derniereEval.score}/100</Badge>
                </div>
              ) : <p className="text-sm text-white/60 mt-1">{t('dashboard.noEval')}</p>}
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.slice(0, 4).map(w => (
          <Card key={w.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">{w.label}</p>
                <p className="text-xl font-extrabold mt-1" style={{ color: w.color }}>{w.value}</p>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${w.color}1A` }}>
                <w.icon color={w.color} size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {kpis.slice(4).map(w => (
          <Card key={w.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">{w.label}</p>
                <p className="text-lg font-extrabold mt-1" style={{ color: w.color }}>{w.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${w.color}1A` }}>
                <w.icon color={w.color} size={18} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold mb-4 flex items-center gap-2"><FiTrendingUp className="text-[#0F4C81]" /> {t('dashboard.trend')}</h3>
          {evolutionScores.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={evolutionScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" fontSize={12} /><YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip /><Bar dataKey="score" fill="#0F4C81" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-16">{t('dashboard.noEval')}</p>}
        </Card>

        <Card>
          <h3 className="font-bold mb-4">{t('dashboard.repartition')}</h3>
          {repartition.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={repartition} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {repartition.map((e, i) => <Cell key={i} fill={CLASS_COLORS[e.name] || '#0F4C81'} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-16">{t('dashboard.noData')}</p>}
        </Card>
      </div>

      <Card>
        <h3 className="font-bold mb-4 flex items-center gap-2"><FiBarChart2 className="text-[#0F4C81]" /> {t('dashboard.radar')}</h3>
        {radarData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} outerRadius={95}>
              <PolarGrid /><PolarAngleAxis dataKey="critere" fontSize={11} /><PolarRadiusAxis domain={[0, 100]} fontSize={10} />
              <Radar dataKey="valeur" stroke="#2E8B57" fill="#2E8B57" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        ) : <p className="text-sm text-gray-400 text-center py-16">{t('dashboard.noEval')}</p>}
      </Card>

      <Card>
        <h3 className="font-bold mb-4 flex items-center gap-2"><FiClock className="text-[#0F4C81]" /> {t('dashboard.recent')}</h3>
        {recentes.length ? (
          <ul className="divide-y divide-gray-100">
            {recentes.map(e => {
              const c = classifySGY(e.score);
              return (
                <li key={e.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{e.projetNom}</p>
                    <p className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm" style={{ color: c.color }}>{e.score}/100</span>
                    <Badge color={c.color}>{trClass(c.label)}</Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : <p className="text-sm text-gray-400 text-center py-8">{t('dashboard.noActivity')}</p>}
      </Card>
    </div>
  );
}
