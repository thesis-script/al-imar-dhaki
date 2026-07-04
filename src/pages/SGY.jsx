import { useLang } from '../contexts/LanguageContext';
import { useMemo, useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { FiBarChart2, FiCheckCircle, FiDownload } from 'react-icons/fi';
import { Badge, Button, Card, EmptyState, Select } from '../components/ui/UI';
import { ScoreGauge, ScoreBar } from '../components/ui/Gauge';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import {
  NOTE_SCALE, classifySGY, computeCategoryScores, computeGlobalScore, getRecommendations,
  getCategoryLabel, getQuestionText, getNoteLabel, getClassificationDescription,
} from '../data/sgyQuestionnaire';
import { generateSGYReport } from '../utils/pdfReport';

export default function SGY() {
  const { t, lang } = useLang();
  const { projets, evaluations, add, getQuestionnaire } = useData();
  const { user } = useAuth();

  const trClass = (label) => t(`dashboard.classifications.${label}`) || label;

  const questionnaire = getQuestionnaire().map((cat) => ({ ...cat, questions: cat.questions.filter((q) => q.active !== false) }));

  const [projetId, setProjetId] = useState(projets[0]?.id || '');
  const initAnswers = () => {
    const a = {};
    questionnaire.forEach((cat) => cat.questions.forEach((q) => { a[q.id] = 3; }));
    return a;
  };
  const [answers, setAnswers] = useState(initAnswers);
  const [result, setResult] = useState(null);

  const categoryScores = useMemo(() => computeCategoryScores(questionnaire, answers), [questionnaire, answers]);
  const globalScore = useMemo(() => computeGlobalScore(categoryScores), [categoryScores]);
  const classification = classifySGY(globalScore);

  // radar labels follow the active language; falls back to French if no _ar text exists
  const radarData = categoryScores.map((c) => ({
    critere: lang === 'ar' ? (c.label_ar || c.label) : c.label,
    valeur: c.percentage,
  }));

  const handleAnswer = (qid, value) => setAnswers((a) => ({ ...a, [qid]: value }));
  const handleCompute = () => setResult(globalScore);

  const projetNom = projets.find((p) => p.id === projetId)?.nom || '';

  const handleSave = () => {
    if (!projetId) return;
    // classification.label stays the canonical French key in storage —
    // it's translated only at display time (trClass), never persisted translated.
    const evalItem = add('evaluations', {
      projetId,
      projetNom,
      score: globalScore,
      classification: classification.label,
      categoryScores,
      answers,
      userId: user?.id,
      userName: user?.name,
    });
    setResult(null);
    return evalItem;
  };

  const handleSaveAndExport = () => {
    const evalItem = handleSave();
    if (evalItem) generateSGYReport(evalItem, user?.name, lang);
  };

  if (!projets.length) {
    return <Card><EmptyState icon="📊" title={t('sgy.noProject')} subtitle={t('sgy.noProjectSub')} /></Card>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2"><FiBarChart2 className="text-[#0F4C81]" /> {t('sgy.title')}</h2>
        <p className="text-gray-500 text-sm mt-1">{t('sgy.subtitle')}</p>
      </div>

      <Card>
        <Select
          label={t('sgy.selectProject')}
          options={projets.map((p) => ({ value: p.id, label: p.nom }))}
          value={projetId}
          onChange={(e) => { setProjetId(e.target.value); setResult(null); }}
        />
      </Card>

      <div className="space-y-5">
        {questionnaire.map((cat) => (
          <Card key={cat.key}>
            <h3 className="font-bold mb-4">{getCategoryLabel(cat, lang)}</h3>
            <div className="space-y-5">
              {cat.questions.map((q) => (
                <div key={q.id}>
                  <p className="text-sm font-medium mb-2">{getQuestionText(q, lang)}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {NOTE_SCALE.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleAnswer(q.id, opt.value)}
                        className={`px-2 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                          answers[q.id] === opt.value
                            ? 'bg-[#0F4C81] border-[#0F4C81] text-white'
                            : 'border-gray-200 text-gray-500 hover:border-[#0F4C81]/50'
                        }`}
                      >
                        <span className="block text-sm">{opt.value}</span>
                        <span className="block text-[10px] mt-0.5">{getNoteLabel(opt.value, lang)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="text-center">
        <Button className="!px-8" onClick={handleCompute}><FiBarChart2 /> {t('sgy.calculate')}</Button>
      </Card>

      {result !== null && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="flex flex-col items-center justify-center text-center">
            <ScoreGauge score={globalScore} color={classification.color} label={trClass(classification.label)} />
            <div className="mt-4">
              <Badge color={classification.color}>{classification.icon} {trClass(classification.label)}</Badge>
              <p className="text-sm text-gray-500 mt-3 max-w-sm">{getClassificationDescription(classification, lang)}</p>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="accent" onClick={handleSave}><FiCheckCircle /> {t('sgy.save')}</Button>
              <Button variant="outline" onClick={handleSaveAndExport}><FiDownload /> {t('sgy.saveExport')}</Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-4">{t('sgy.categoryTitle')}</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData} outerRadius={85}>
                <PolarGrid />
                <PolarAngleAxis dataKey="critere" fontSize={10} />
                <PolarRadiusAxis domain={[0, 100]} fontSize={9} />
                <Radar dataKey="valeur" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-4">
              {categoryScores.map((c) => (
                <ScoreBar
                  key={c.key}
                  label={lang === 'ar' ? (c.label_ar || c.label) : c.label}
                  percentage={c.percentage}
                  color={classifySGY(c.percentage).color}
                />
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}