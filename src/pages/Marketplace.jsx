import { useMemo, useState } from 'react';
import { FiPlus, FiMapPin, FiPhone, FiSearch, FiX, FiTrendingUp } from 'react-icons/fi';
import { Badge, Button, Card, EmptyState, Input, Modal, Select, TextArea } from '../components/ui/UI';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { useToast } from '../components/ui/Toast';
import { classifySGY } from '../data/sgyQuestionnaire';
import { roleLabel } from '../utils/constants';

const EMPTY_FORM = { titre:'', categorie:'Terrain', wilaya:'', commune:'', surface:'', prix:'', type_actif:'Résidentiel', sgy_estime:'', potentiel:'', budget:'', description:'' };

export default function Marketplace() {
  const { annonces, evaluations, add, remove } = useData();
  const { user } = useAuth();
  const { t, lang } = useLang();
  const { showToast } = useToast();
  const [modal, setModal] = useState(false);
  const [contactModal, setContactModal] = useState(null);
  const [query, setQuery] = useState('');
  const [categorie, setCategorie] = useState('Toutes');
  const [form, setForm] = useState(EMPTY_FORM);

  const trClass = (label) => t(`dashboard.classifications.${label}`) || label;

  // Get best SGY for each project to suggest in marketplace
  const bestSGYByProjet = useMemo(() => {
    const m = {};
    evaluations.forEach(e => { if (!m[e.projetId] || e.score > m[e.projetId]) m[e.projetId] = e.score; });
    return m;
  }, [evaluations]);

  // Raw values stay in French for storage/filtering — labels come from translations.js
  // (marketplace.categories / marketplace.types_actif), aligned positionally.
  const CATEGORIES_RAW = ['Terrain', 'Projet', 'Partenariat'];
  const TYPES_ACTIF_RAW = ['Résidentiel', 'Commercial', 'Industriel', 'Mixte', 'Agricole'];

  const categoryOptions = [
    { value: 'Toutes', label: t('common.all') },
    ...CATEGORIES_RAW.map((val, i) => ({ value: val, label: t('marketplace.categories')?.[i] || val })),
  ];
  const typeActifOptions = TYPES_ACTIF_RAW.map((val, i) => ({ value: val, label: t('marketplace.types_actif')?.[i] || val }));

  const categorieLabel = (val) => {
    const idx = CATEGORIES_RAW.indexOf(val);
    return idx >= 0 ? (t('marketplace.categories')?.[idx] || val) : val;
  };
  const typeActifLabel = (val) => {
    const idx = TYPES_ACTIF_RAW.indexOf(val);
    return idx >= 0 ? (t('marketplace.types_actif')?.[idx] || val) : val;
  };

  const filtered = useMemo(() => {
    let res = annonces.filter(a => (a.titre + (a.wilaya||'') + (a.description||'')).toLowerCase().includes(query.toLowerCase()));
    if (categorie !== 'Toutes') res = res.filter(a => a.categorie === categorie);
    return res.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [annonces, query, categorie]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = e => {
    e.preventDefault();
    add('annonces', { ...form, auteur: user?.name, auteurRole: user?.role, auteurId: user?.id });
    setForm(EMPTY_FORM);
    setModal(false);
    showToast(t('success.annonce_created'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const numberLocale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">{t('marketplace.title')}</h2>
          <p className="text-gray-500 text-sm mt-1">{t('marketplace.subtitle')}</p>
        </div>
        <Button onClick={() => setModal(true)}><FiPlus /> {t('marketplace.add')}</Button>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0F4C81] outline-none"
              placeholder={`${t('common.search')}...`} value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <Select className="!mb-0" options={categoryOptions} value={categorie} onChange={e => setCategorie(e.target.value)} />
        </div>
      </Card>

      {!filtered.length ? (
        <Card><EmptyState icon="🤝" title={t('marketplace.noResult')} subtitle={t('marketplace.noResultSub')} /></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(a => {
            const sgy = a.sgy_estime ? Number(a.sgy_estime) : null;
            const c = sgy ? classifySGY(sgy) : null;
            return (
              <Card key={a.id} className="hover:-translate-y-1 transition-transform flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold">{a.titre}</h4>
                  <Badge>{categorieLabel(a.categorie)}</Badge>
                </div>

                <div className="space-y-1 mb-3">
                  {a.wilaya && <p className="text-sm text-gray-500 flex items-center gap-1.5"><FiMapPin size={13} />{a.commune ? `${a.commune}, ` : ''}{a.wilaya}</p>}
                  {a.surface && <p className="text-sm text-gray-500">📐 {Number(a.surface).toLocaleString(numberLocale)} m²</p>}
                  {a.prix    && <p className="text-sm text-gray-500">💰 {Number(a.prix).toLocaleString(numberLocale)} DA</p>}
                  {a.type_actif && <p className="text-sm text-gray-500">🏷️ {typeActifLabel(a.type_actif)}</p>}
                  {a.potentiel && <p className="text-sm text-gray-500 flex items-center gap-1.5"><FiTrendingUp size={13} />{a.potentiel}</p>}
                </div>

                {c && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 mb-3">
                    <span className="text-xs text-gray-500 font-medium">{t('marketplace.score_sgy')}</span>
                    <span className="font-extrabold text-sm" style={{ color: c.color }}>{sgy}/100</span>
                    <Badge color={c.color}>{trClass(c.label)}</Badge>
                  </div>
                )}

                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{a.description}</p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                  <div>
                    <p className="text-xs font-semibold">{a.auteur}</p>
                    <p className="text-xs text-gray-400">{roleLabel(a.auteurRole, lang)}</p>
                  </div>
                  <Button variant="outline" className="!py-1.5 !px-3 text-xs" onClick={() => setContactModal(a)}>
                    <FiPhone size={13} /> {t('marketplace.contact')}
                  </Button>
                </div>
                {a.auteurId === user?.id && (
                  <button onClick={() => remove('annonces', a.id)} className="text-xs text-red-400 mt-2 hover:underline">{t('marketplace.delete_my_ad')}</button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={t('marketplace.add')} wide>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-4">
          <div className="md:col-span-2"><Input label={t('marketplace.fields.titre')} required value={form.titre} onChange={e => set('titre', e.target.value)} /></div>
          <Select label={t('marketplace.fields.categorie')} options={CATEGORIES_RAW.map((val,i)=>({value:val,label:t('marketplace.categories')?.[i]||val}))} value={form.categorie} onChange={e => set('categorie', e.target.value)} />
          <Select label={t('marketplace.fields.type_actif')} options={typeActifOptions} value={form.type_actif} onChange={e => set('type_actif', e.target.value)} />
          <Input label={t('marketplace.fields.wilaya')} value={form.wilaya} onChange={e => set('wilaya', e.target.value)} />
          <Input label={t('marketplace.fields.commune')} value={form.commune} onChange={e => set('commune', e.target.value)} />
          <Input label={t('marketplace.fields.surface')} type="number" value={form.surface} onChange={e => set('surface', e.target.value)} />
          <Input label={t('marketplace.fields.prix')} type="number" value={form.prix} onChange={e => set('prix', e.target.value)} />
          <Input label={`${t('marketplace.fields.sgy')} (0–100)`} type="number" min="0" max="100" value={form.sgy_estime} onChange={e => set('sgy_estime', e.target.value)} />
          <Input label={t('marketplace.fields.potentiel')} value={form.potentiel} onChange={e => set('potentiel', e.target.value)} placeholder={t('marketplace.potentiel_placeholder')} />
          <div className="md:col-span-2"><TextArea label={t('marketplace.fields.description')} required value={form.description} onChange={e => set('description', e.target.value)} /></div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('marketplace.publish')}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!contactModal} onClose={() => setContactModal(null)} title={t('marketplace.contactSim')}>
        {contactModal && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
              {contactModal.auteur?.[0]?.toUpperCase()}
            </div>
            <p className="font-bold">{contactModal.auteur}</p>
            <p className="text-sm text-gray-400 mb-4">{roleLabel(contactModal.auteurRole, lang)}</p>
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">{t('marketplace.contactMsg')} « {contactModal.titre} ».</p>
            <Button className="mt-4 mx-auto" onClick={() => setContactModal(null)}><FiX /> {t('common.close')}</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}