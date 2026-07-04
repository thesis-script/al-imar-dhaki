import { useMemo, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { Badge, Button, Card, EmptyState, Input, Modal, Select, TextArea } from '../components/ui/UI';
import { useData } from '../contexts/DataContext';
import { useLang } from '../contexts/LanguageContext';
import { useToast } from '../components/ui/Toast';
import { classifySGY } from '../data/sgyQuestionnaire';
import { PROJET_STATUTS, getProjetStatuts, projetStatutLabel } from '../utils/constants';

const STATUS_COLOR = { 'En étude':'#F4A300','Validé':'#0F4C81','En cours':'#2E8B57','Terminé':'#333333' };

export default function Projets() {
  const { terrains, projets, evaluations, add, update, remove } = useData();
  const { t, lang } = useLang();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [statutFilter, setStatutFilter] = useState('Tous');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom:'', terrainId:terrains[0]?.id||'', promoteur:'', budget:'', description:'', dateLancement:'', statut:'En étude' });

  // value stays the stable French key used in storage/filters; label is translated for display
  const statuts = useMemo(() => getProjetStatuts(lang), [lang]);

  // translate a classifySGY() label for display (canonical French key -> localized text)
  const trClass = (label) => t(`dashboard.classifications.${label}`) || label;

  // Best SGY per project
  const sgyByProjet = useMemo(() => {
    const m = {};
    evaluations.forEach(e => { if (!m[e.projetId] || e.score > m[e.projetId]) m[e.projetId] = e.score; });
    return m;
  }, [evaluations]);

  const filtered = useMemo(() => {
    let res = projets.filter(p => p.nom.toLowerCase().includes(query.toLowerCase()));
    if (statutFilter !== 'Tous') res = res.filter(p => p.statut === statutFilter);
    return res.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [projets, query, statutFilter]);

  const terrainName = id => terrains.find(t => t.id === id)?.nom || '—';

  const openCreate = () => { setEditing(null); setForm({ nom:'', terrainId:terrains[0]?.id||'', promoteur:'', budget:'', description:'', dateLancement:'', statut:'En étude' }); setModal(true); };
  const openEdit = p => { setEditing(p); setForm(p); setModal(true); };
  const handleSubmit = e => {
    e.preventDefault();
    if (editing) { update('projets', editing.id, form); showToast(t('success.projet_updated')); }
    else { add('projets', form); showToast(t('success.projet_created')); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    setModal(false);
  };
  const handleDelete = id => { if (confirm(t('common.confirm_delete'))) remove('projets', id); };
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">{t('projets.title')}</h2>
          <p className="text-gray-500 text-sm mt-1">{projets.length} {t('projets.projet')}</p>
        </div>
        <Button onClick={openCreate} disabled={!terrains.length}><FiPlus /> {t('projets.add')}</Button>
      </div>

      {!terrains.length && (
        <Card className="bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-700">{t('projets.noTerrain')}</p>
        </Card>
      )}

      <Card>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F4C81] outline-none"
              placeholder={`${t('common.search')}...`} value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <Select
            className="!mb-0"
            options={[{ value: 'Tous', label: t('common.all') }, ...statuts]}
            value={statutFilter}
            onChange={e => setStatutFilter(e.target.value)}
          />
        </div>
      </Card>

      {!filtered.length ? (
        <Card><EmptyState icon="🏗️" title={t('projets.noResult')} subtitle={t('projets.noResultSub')} /></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => {
            const sgy = sgyByProjet[p.id];
            const c   = sgy ? classifySGY(sgy) : null;
            return (
              <Card key={p.id} className="hover:-translate-y-1 transition-transform flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold">{p.nom}</h4>
                  <Badge color={STATUS_COLOR[p.statut]}>{projetStatutLabel(p.statut, lang)}</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-1">{t('projets.terrain')} : {terrainName(p.terrainId)}</p>
                <p className="text-sm text-gray-500 mb-1">{t('projets.promoteur')} : {p.promoteur || '—'}</p>
                <p className="text-sm text-gray-500 mb-3">{t('projets.budget')} : {Number(p.budget||0).toLocaleString(lang === 'ar' ? 'ar-DZ' : 'fr-FR')} DA</p>
                {c && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 mb-3">
                    <span className="text-xs text-gray-500">{t('historique.score')}</span>
                    <span className="font-extrabold text-sm" style={{ color: c.color }}>{sgy}/100</span>
                    <Badge color={c.color}>{c.icon} {trClass(c.label)}</Badge>
                  </div>
                )}
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{p.description}</p>
                <div className="flex gap-2 mt-auto">
                  <Button variant="outline" className="!py-1.5 !px-3 text-xs flex-1" onClick={() => openEdit(p)}><FiEdit2 size={14} /> {t('common.edit')}</Button>
                  <Button variant="danger" className="!py-1.5 !px-3 text-xs" onClick={() => handleDelete(p.id)}><FiTrash2 size={14} /></Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? t('projets.edit') : t('projets.add')} wide>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-4">
          <Input label={t('projets.name')} required value={form.nom} onChange={e => f('nom', e.target.value)} />
          <Select label={t('projets.terrain')} options={terrains.map(t => ({value:t.id,label:t.nom}))} value={form.terrainId} onChange={e => f('terrainId', e.target.value)} />
          <Input label={t('projets.promoteur')} value={form.promoteur} onChange={e => f('promoteur', e.target.value)} />
          <Input label={t('projets.budget')} type="number" value={form.budget} onChange={e => f('budget', e.target.value)} />
          <Input label={t('projets.date')} type="date" value={form.dateLancement} onChange={e => f('dateLancement', e.target.value)} />
          <Select label={t('projets.statut')} options={statuts} value={form.statut} onChange={e => f('statut', e.target.value)} />
          <div className="md:col-span-2"><TextArea label={t('projets.description')} value={form.description} onChange={e => f('description', e.target.value)} /></div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{editing ? t('common.save') : t('common.add')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}