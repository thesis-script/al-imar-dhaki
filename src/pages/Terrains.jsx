import { useMemo, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiGrid, FiList, FiMapPin } from 'react-icons/fi';
import { Badge, Button, Card, EmptyState, Input, Modal, Select, TextArea } from '../components/ui/UI';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { useToast } from '../components/ui/Toast';
import { classifySGY } from '../data/sgyQuestionnaire';
import {
  getWilayas, getTerrainTypes, getStatutJuridique,
  wilayaLabel, terrainTypeLabel, statutJuridiqueLabel,
  WILAYAS, TERRAIN_TYPES, STATUT_JURIDIQUE,
} from '../utils/constants';

const EMPTY = { nom:'', wilaya:WILAYAS[10], commune:'', adresse:'', surface:'', type:TERRAIN_TYPES[0], statutJuridique:STATUT_JURIDIQUE[0], description:'' };

export default function Terrains() {
  const { terrains, projets, evaluations, add, update, remove } = useData();
  const { user } = useAuth();
  const { t, lang } = useLang();
  const { showToast } = useToast();

  const [view, setView] = useState('cards');
  const [query, setQuery] = useState('');
  const [wilayaFilter, setWilayaFilter] = useState('Toutes');
  const [sortBy, setSortBy] = useState('recent');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  // Translated option lists — value stays the stable French key used in storage/filters,
  // label switches between fr/ar depending on the active language.
  const wilayas = useMemo(() => getWilayas(lang), [lang]);
  const terrainTypes = useMemo(() => getTerrainTypes(lang), [lang]);
  const statuts = useMemo(() => getStatutJuridique(lang), [lang]);

  const sgyByTerrain = useMemo(() => {
    const m = {};
    projets.forEach(p => {
      const evals = evaluations.filter(e => e.projetId === p.id);
      if (!evals.length) return;
      const best = Math.max(...evals.map(e => e.score));
      if (!m[p.terrainId] || best > m[p.terrainId]) m[p.terrainId] = best;
    });
    return m;
  }, [projets, evaluations]);

  const filtered = useMemo(() => {
    let res = terrains.filter(ter =>
      (ter.nom + ter.commune + ter.adresse).toLowerCase().includes(query.toLowerCase())
    );
    if (wilayaFilter !== 'Toutes') res = res.filter(ter => ter.wilaya === wilayaFilter);
    if (sortBy === 'recent')  res = res.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'surface') res = res.slice().sort((a, b) => Number(b.surface) - Number(a.surface));
    if (sortBy === 'nom')     res = res.slice().sort((a, b) => a.nom.localeCompare(b.nom));
    return res;
  }, [terrains, query, wilayaFilter, sortBy]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (ter) => { setEditing(ter); setForm(ter); setModal(true); };

  const handleSubmit = e => {
    e.preventDefault();
    if (editing) {
      update('terrains', editing.id, form);
      showToast(t('success.terrain_updated'));
    } else {
      add('terrains', { ...form, ownerId: user?.id });
      showToast(t('success.terrain_created'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setModal(false);
  };

  const handleDelete = id => { if (confirm(t('common.confirm_delete'))) remove('terrains', id); };
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">{t('terrains.title')}</h2>
          <p className="text-gray-500 text-sm mt-1">{terrains.length} {t('terrains.terain')}</p>
        </div>
        <Button onClick={openCreate}><FiPlus /> {t('terrains.add')}</Button>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F4C81] outline-none"
              placeholder={`${t('common.search')}...`} value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <Select
            className="!mb-0"
            options={[{ value: 'Toutes', label: t('common.all') }, ...wilayas]}
            value={wilayaFilter}
            onChange={e => setWilayaFilter(e.target.value)}
          />
          <Select
            className="!mb-0"
            options={[
              { value: 'recent', label: t('historique.sort_recent') },
              { value: 'surface', label: t('terrains.surface') },
              { value: 'nom', label: t('terrains.name') },
            ]}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          />
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setView('cards')} className={`p-2 rounded-lg ${view==='cards'?'bg-white shadow text-[#0F4C81]':'text-gray-400'}`}><FiGrid /></button>
            <button onClick={() => setView('table')} className={`p-2 rounded-lg ${view==='table'?'bg-white shadow text-[#0F4C81]':'text-gray-400'}`}><FiList /></button>
          </div>
        </div>
      </Card>

      {!filtered.length ? (
        <Card><EmptyState icon="🗺️" title={t('terrains.noResult')} subtitle={t('terrains.noResultSub')} /></Card>
      ) : view === 'cards' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(ter => {
            const sgy = sgyByTerrain[ter.id];
            const c   = sgy ? classifySGY(sgy) : null;
            return (
              <Card key={ter.id} className="hover:-translate-y-1 transition-transform flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold">{ter.nom}</h4>
                  <Badge>{terrainTypeLabel(ter.type, lang)}</Badge>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
                  <FiMapPin size={14}/>{ter.commune}, {wilayaLabel(ter.wilaya, lang)}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {ter.surface} m² — {statutJuridiqueLabel(ter.statutJuridique, lang)}
                </p>
                {c && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 mb-3">
                    <span className="text-xs text-gray-500">SGY</span>
                    <span className="font-extrabold text-sm" style={{color:c.color}}>{sgy}/100</span>
                    <Badge color={c.color}>{c.label}</Badge>
                  </div>
                )}
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{ter.description}</p>
                <div className="flex gap-2 mt-auto">
                  <Button variant="outline" className="!py-1.5 !px-3 text-xs flex-1" onClick={() => openEdit(ter)}><FiEdit2 size={14}/> {t('common.edit')}</Button>
                  <Button variant="danger" className="!py-1.5 !px-3 text-xs" onClick={() => handleDelete(ter.id)}><FiTrash2 size={14}/></Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="!p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                {[
                  t('terrains.name'),
                  t('terrains.wilaya'),
                  t('terrains.surface'),
                  t('terrains.type'),
                  t('terrains.statut'),
                  'SGY',
                  t('common.actions'),
                ].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ter => {
                const sgy = sgyByTerrain[ter.id];
                const c = sgy ? classifySGY(sgy) : null;
                return (
                  <tr key={ter.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{ter.nom}</td>
                    <td className="px-4 py-3">{wilayaLabel(ter.wilaya, lang)}</td>
                    <td className="px-4 py-3">{ter.surface} m²</td>
                    <td className="px-4 py-3"><Badge>{terrainTypeLabel(ter.type, lang)}</Badge></td>
                    <td className="px-4 py-3 text-gray-500">{statutJuridiqueLabel(ter.statutJuridique, lang)}</td>
                    <td className="px-4 py-3">{c ? <span className="font-bold text-xs" style={{color:c.color}}>{sgy}/100</span> : '—'}</td>
                    <td className="px-4 py-3"><div className="flex gap-2">
                      <button onClick={() => openEdit(ter)} className="text-[#0F4C81]"><FiEdit2 size={16}/></button>
                      <button onClick={() => handleDelete(ter.id)} className="text-red-500"><FiTrash2 size={16}/></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? t('terrains.edit') : t('terrains.add')} wide>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-4">
          <Input label={t('terrains.name')} required value={form.nom} onChange={e => f('nom', e.target.value)} />
          <Select label={t('terrains.wilaya')} options={wilayas} value={form.wilaya} onChange={e => f('wilaya', e.target.value)} />
          <Input label={t('terrains.commune')} required value={form.commune} onChange={e => f('commune', e.target.value)} />
          <Input label={t('terrains.adresse')} value={form.adresse} onChange={e => f('adresse', e.target.value)} />
          <Input label={t('terrains.surface')} type="number" required value={form.surface} onChange={e => f('surface', e.target.value)} />
          <Select label={t('terrains.type')} options={terrainTypes} value={form.type} onChange={e => f('type', e.target.value)} />
          <Select label={t('terrains.statut')} options={statuts} value={form.statutJuridique} onChange={e => f('statutJuridique', e.target.value)} />
          <div className="md:col-span-2"><TextArea label={t('terrains.description')} value={form.description} onChange={e => f('description', e.target.value)} /></div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{editing ? t('common.save') : t('common.add')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}