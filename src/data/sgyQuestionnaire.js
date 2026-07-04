// Questionnaire officiel SGY — 5 catégories, 15 questions, notation 0 à 5
export const DEFAULT_QUESTIONNAIRE = [
  {
    key: 'gestion_projet',
    label: 'Gestion du projet',
    label_ar: 'إدارة المشروع',
    questions: [
      { id: 'q1', text: "Le projet dispose-t-il d'un planning détaillé ?", text_ar: 'هل يتوفر المشروع على مخطط زمني مفصل؟', active: true },
      { id: 'q2', text: 'Les délais sont-ils respectés ?', text_ar: 'هل يتم احترام الآجال المحددة؟', active: true },
      { id: 'q3', text: 'Les responsabilités sont-elles clairement définies ?', text_ar: 'هل المسؤوليات محددة بوضوح؟', active: true },
    ],
  },
  {
    key: 'performance_financiere',
    label: 'Performance financière',
    label_ar: 'الأداء المالي',
    questions: [
      { id: 'q4', text: 'Le budget est-il maîtrisé ?', text_ar: 'هل يتم التحكم في الميزانية؟', active: true },
      { id: 'q5', text: 'Les dépenses sont-elles suivies régulièrement ?', text_ar: 'هل يتم متابعة النفقات بانتظام؟', active: true },
      { id: 'q6', text: 'Le projet est-il rentable ?', text_ar: 'هل المشروع مربح؟', active: true },
    ],
  },
  {
    key: 'qualite_technique',
    label: 'Qualité technique',
    label_ar: 'الجودة التقنية',
    questions: [
      { id: 'q7', text: 'Les normes techniques sont-elles respectées ?', text_ar: 'هل يتم احترام المعايير التقنية؟', active: true },
      { id: 'q8', text: 'Les contrôles qualité sont-ils effectués ?', text_ar: 'هل يتم إجراء مراقبة الجودة؟', active: true },
      { id: 'q9', text: 'Les anomalies sont-elles corrigées rapidement ?', text_ar: 'هل يتم تصحيح الأعطال بسرعة؟', active: true },
    ],
  },
  {
    key: 'satisfaction_client',
    label: 'Satisfaction client',
    label_ar: 'رضا العملاء',
    questions: [
      { id: 'q10', text: 'Les clients sont-ils satisfaits ?', text_ar: 'هل العملاء راضون؟', active: true },
      { id: 'q11', text: 'Les réclamations sont-elles traitées efficacement ?', text_ar: 'هل تتم معالجة الشكاوى بفعالية؟', active: true },
      { id: 'q12', text: 'Le service après-vente est-il performant ?', text_ar: 'هل خدمة ما بعد البيع فعّالة؟', active: true },
    ],
  },
  {
    key: 'innovation_digitalisation',
    label: 'Innovation et digitalisation',
    label_ar: 'الابتكار والرقمنة',
    questions: [
      { id: 'q13', text: 'Utilisez-vous des outils numériques de gestion ?', text_ar: 'هل تستخدمون أدوات رقمية للإدارة؟', active: true },
      { id: 'q14', text: 'Les données sont-elles centralisées ?', text_ar: 'هل يتم تجميع البيانات مركزياً؟', active: true },
      { id: 'q15', text: "Disposez-vous d'indicateurs de suivi et de reporting ?", text_ar: 'هل تتوفرون على مؤشرات متابعة وتقارير؟', active: true },
    ],
  },
];

// Getters — always pass the current language ('fr' | 'ar').
// Custom questions added later by an admin may not have an `_ar` value;
// in that case we fall back to the French text so nothing renders blank.
export const getCategoryLabel = (cat, lang = 'fr') =>
  (lang === 'ar' ? cat.label_ar : cat.label) || cat.label;

export const getQuestionText = (question, lang = 'fr') =>
  (lang === 'ar' ? question.text_ar : question.text) || question.text;

export const NOTE_SCALE = [
  { value: 0, label: 'Très faible', label_ar: 'ضعيف جداً' },
  { value: 1, label: 'Faible', label_ar: 'ضعيف' },
  { value: 2, label: 'Moyen', label_ar: 'متوسط' },
  { value: 3, label: 'Bon', label_ar: 'جيد' },
  { value: 4, label: 'Très bon', label_ar: 'جيد جداً' },
  { value: 5, label: 'Excellent', label_ar: 'ممتاز' },
];

export const getNoteLabel = (value, lang = 'fr') => {
  const item = NOTE_SCALE.find(n => n.value === value);
  if (!item) return '';
  return (lang === 'ar' ? item.label_ar : item.label) || item.label;
};

// classifySGY() intentionally keeps returning the canonical French `label`
// (e.g. 'Excellent', 'Bon'...) — it's used elsewhere as a stable key
// (CLASS_COLORS, translations lookups). Translate the label for DISPLAY
// at the call site with: t(`dashboard.classifications.${c.label}`) || c.label
export function classifySGY(score) {
  if (score >= 90) return { label: 'Excellent', color: '#2E8B57', icon: '🏆', description: 'Le projet présente un excellent niveau de maturité et de performance.', description_ar: 'يُظهر المشروع مستوى ممتازاً من النضج والأداء.' };
  if (score >= 75) return { label: 'Très bon', color: '#0F4C81', icon: '⭐', description: "Le projet affiche de très bonnes performances avec quelques axes d'amélioration.", description_ar: 'يُظهر المشروع أداءً جيداً جداً مع بعض نقاط التحسين.' };
  if (score >= 60) return { label: 'Bon', color: '#F4A300', icon: '👍', description: 'Le projet est globalement satisfaisant mais nécessite plusieurs optimisations.', description_ar: 'المشروع مُرضٍ بشكل عام لكنه يحتاج إلى عدة تحسينات.' };
  if (score >= 40) return { label: 'Moyen', color: '#d98e00', icon: '⚠️', description: 'Le projet nécessite des améliorations importantes avant son déploiement.', description_ar: 'يحتاج المشروع إلى تحسينات مهمة قبل تنفيذه.' };
  return { label: 'À améliorer', color: '#c0392b', icon: '🔻', description: 'Le projet nécessite des améliorations importantes avant son déploiement.', description_ar: 'يحتاج المشروع إلى تحسينات مهمة قبل تنفيذه.' };
}

export const getClassificationDescription = (c, lang = 'fr') =>
  (lang === 'ar' ? c.description_ar : c.description) || c.description;

const RECOMMENDATIONS = {
  gestion_projet: {
    fr: 'Renforcer la planification du projet, clarifier les responsabilités et améliorer le respect des délais.',
    ar: 'تعزيز تخطيط المشروع، وتوضيح المسؤوليات، وتحسين احترام الآجال.',
  },
  performance_financiere: {
    fr: 'Mettre en place un suivi budgétaire plus rigoureux et analyser la rentabilité du projet.',
    ar: 'وضع متابعة أكثر صرامة للميزانية وتحليل مردودية المشروع.',
  },
  qualite_technique: {
    fr: 'Renforcer les contrôles qualité et accélérer la correction des anomalies techniques.',
    ar: 'تعزيز مراقبة الجودة وتسريع تصحيح الأعطال التقنية.',
  },
  satisfaction_client: {
    fr: 'Améliorer le traitement des réclamations et la qualité du service après-vente.',
    ar: 'تحسين معالجة الشكاوى وجودة خدمة ما بعد البيع.',
  },
  innovation_digitalisation: {
    fr: 'Digitaliser davantage la gestion du projet et centraliser les données via des outils numériques.',
    ar: 'رقمنة إدارة المشروع بشكل أكبر وتجميع البيانات عبر أدوات رقمية.',
  },
};

const DEFAULT_RECOMMENDATION = { fr: 'Optimiser cette catégorie.', ar: 'تحسين هذه الفئة.' };

export function getRecommendations(categoryScores, lang = 'fr') {
  return categoryScores
    .filter((c) => c.percentage < 60)
    .map((c) => {
      const rec = RECOMMENDATIONS[c.key] || DEFAULT_RECOMMENDATION;
      return { categorie: c.label, texte: lang === 'ar' ? rec.ar : rec.fr };
    });
}

export function computeCategoryScores(questionnaire, answers) {
  return questionnaire.map((cat) => {
    const activeQuestions = cat.questions.filter((q) => q.active !== false);
    const max = activeQuestions.length * 5;
    const obtained = activeQuestions.reduce((sum, q) => sum + Number(answers[q.id] ?? 0), 0);
    const percentage = max ? Math.round((obtained / max) * 100) : 0;
    return { key: cat.key, label: cat.label, label_ar: cat.label_ar, obtained, max, percentage };
  });
}

export function computeGlobalScore(categoryScores) {
  const obtained = categoryScores.reduce((s, c) => s + c.obtained, 0);
  const max = categoryScores.reduce((s, c) => s + c.max, 0);
  return max ? Math.round((obtained / max) * 100) : 0;
}