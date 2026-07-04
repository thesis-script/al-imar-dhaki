import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiRefreshCw } from 'react-icons/fi';
import { Button, Card, Input, Modal } from '../../components/ui/UI';
import { useData } from '../../contexts/DataContext';
import { useLang } from '../../contexts/LanguageContext';
import { getCategoryLabel, getQuestionText } from '../../data/sgyQuestionnaire';

export default function AdminQuestionnaire() {
  const { getQuestionnaire, saveQuestionnaire, resetQuestionnaire } = useData();
  const { t, lang } = useLang();

  const [questionnaire, setQuestionnaire] = useState(getQuestionnaire());
  const [modal, setModal] = useState(null);
  const [text, setText] = useState('');

  const persist = (next) => { setQuestionnaire(next); saveQuestionnaire(next); };

  const toggleActive = (catKey, qid) => {
    persist(questionnaire.map(cat =>
      cat.key === catKey
        ? { ...cat, questions: cat.questions.map(q => q.id === qid ? { ...q, active: q.active === false ? true : false } : q) }
        : cat
    ));
  };

  const deleteQuestion = (catKey, qid) => {
    if (!confirm(t('admin_questionnaire.confirm_delete'))) return;
    persist(questionnaire.map(cat =>
      cat.key === catKey ? { ...cat, questions: cat.questions.filter(q => q.id !== qid) } : cat
    ));
  };

  const openAdd = (catKey) => { setModal({ catKey, question: null }); setText(''); };
  // NOTE: editing here only edits the French `text` field. If this question
  // has a `text_ar`, it is left untouched — there's no Arabic input in this
  // form yet. Arabic-UI users will keep seeing the old Arabic text (or the
  // French fallback for brand-new questions) until a dedicated Arabic field
  // is added here.
  const openEdit = (catKey, question) => { setModal({ catKey, question }); setText(question.text); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { catKey, question } = modal;
    if (question) {
      persist(questionnaire.map(cat =>
        cat.key === catKey
          ? { ...cat, questions: cat.questions.map(q => q.id === question.id ? { ...q, text } : q) }
          : cat
      ));
    } else {
      const newId = `q_${crypto.randomUUID().slice(0, 8)}`;
      // New questions are French-only until an Arabic field is added to this form.
      persist(questionnaire.map(cat =>
        cat.key === catKey ? { ...cat, questions: [...cat.questions, { id: newId, text, active: true }] } : cat
      ));
    }
    setModal(null);
  };

  const handleReset = () => {
    if (!confirm(t('admin_questionnaire.confirm_reset'))) return;
    resetQuestionnaire();
    setQuestionnaire(getQuestionnaire());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">{t('admin_questionnaire.title')}</h2>
          <p className="text-gray-500 text-sm mt-1">{t('admin_questionnaire.subtitle')}</p>
        </div>
        <Button variant="outline" onClick={handleReset}><FiRefreshCw /> {t('admin_questionnaire.reset')}</Button>
      </div>

      {questionnaire.map(cat => (
        <Card key={cat.key}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{getCategoryLabel(cat, lang)}</h3>
            <Button variant="outline" className="!py-1.5 !px-3 text-xs" onClick={() => openAdd(cat.key)}>
              <FiPlus size={14} /> {t('admin_questionnaire.add_question')}
            </Button>
          </div>
          <div className="space-y-2">
            {cat.questions.map(q => (
              <div key={q.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${q.active === false ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-100'}`}>
                <p className="text-sm flex-1">{getQuestionText(q, lang)}</p>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => toggleActive(cat.key, q.id)} title={q.active === false ? t('admin_questionnaire.activate') : t('admin_questionnaire.deactivate')}>
                    {q.active === false
                      ? <FiToggleLeft className="text-gray-400" size={22} />
                      : <FiToggleRight className="text-[#2E8B57]" size={22} />}
                  </button>
                  <button onClick={() => openEdit(cat.key, q)} className="text-[#0F4C81]"><FiEdit2 size={16} /></button>
                  <button onClick={() => deleteQuestion(cat.key, q.id)} className="text-red-500"><FiTrash2 size={16} /></button>
                </div>
              </div>
            ))}
            {!cat.questions.length && (
              <p className="text-sm text-gray-400 text-center py-4">{t('admin_questionnaire.no_questions')}</p>
            )}
          </div>
        </Card>
      ))}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.question ? t('admin_questionnaire.edit_question') : t('admin_questionnaire.add_question')}>
        <form onSubmit={handleSubmit}>
          <Input label={t('admin_questionnaire.question_text')} required value={text} onChange={e => setText(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModal(null)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}