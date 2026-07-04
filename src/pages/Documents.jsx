import { useMemo, useRef, useState } from 'react';
import { FiUpload, FiTrash2, FiFile, FiImage, FiFileText, FiEye, FiDownload } from 'react-icons/fi';
import { Badge, Button, Card, EmptyState, Modal, Select } from '../components/ui/UI';
import { useData } from '../contexts/DataContext';
import { useLang } from '../contexts/LanguageContext';

const MAX_PREVIEW_SIZE = 3 * 1024 * 1024; // 3MB

const iconFor = type => {
  if (type?.includes('image')) return FiImage;
  if (type?.includes('pdf'))   return FiFileText;
  return FiFile;
};

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Documents() {
  const { terrains, projets, documents, add, remove } = useData();
  const { t } = useLang();
  const fileRef = useRef();
  const [target, setTarget] = useState('aucun');
  const [filterType, setFilterType] = useState('Tous');
  const [preview, setPreview] = useState(null); // { nom, type, dataUrl }

  const targets = [
    { value: 'aucun', label: t('documents.sans_classement') },
    ...terrains.map(ter => ({ value: `terrain:${ter.id}`, label: `${t('documents.terrain_prefix')} ${ter.nom}` })),
    ...projets.map(p   => ({ value: `projet:${p.id}`,   label: `${t('documents.projet_prefix')} ${p.nom}` })),
  ];

  const handleUpload = async e => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      let dataUrl = null;
      if (file.size <= MAX_PREVIEW_SIZE) {
        try { dataUrl = await readFileAsDataURL(file); } catch {}
      }
      add('documents', {
        nom: file.name,
        taille: file.size,
        type: file.type || 'fichier',
        cible: target,
        dataUrl,
      });
    }
    e.target.value = '';
  };

  const filtered = useMemo(() => {
    if (filterType === 'Tous') return documents;
    return documents.filter(d => d.cible?.startsWith(filterType));
  }, [documents, filterType]);

  const targetLabel = cible => targets.find(t => t.value === cible)?.label || t('documents.sans_classement');

  const openPreview = doc => setPreview(doc);

  const handleDownload = doc => {
    if (!doc.dataUrl) return;
    const a = document.createElement('a');
    a.href = doc.dataUrl;
    a.download = doc.nom;
    a.click();
  };

  const renderPreviewContent = doc => {
    if (!doc?.dataUrl) {
      return <p className="text-gray-400 text-sm text-center py-12">{t('documents.noPreview')}</p>;
    }
    if (doc.type?.includes('image')) {
      return <img src={doc.dataUrl} alt={doc.nom} className="max-w-full max-h-[70vh] mx-auto rounded-xl object-contain" />;
    }
    if (doc.type?.includes('pdf')) {
      return <iframe src={doc.dataUrl} title={doc.nom} className="w-full rounded-xl border" style={{ height: '70vh' }} />;
    }
    if (doc.type?.includes('text')) {
      return (
        <pre className="bg-gray-50 rounded-xl p-4 text-xs overflow-auto max-h-[60vh] whitespace-pre-wrap">
          {atob(doc.dataUrl.split(',')[1])}
        </pre>
      );
    }
    return <p className="text-gray-400 text-sm text-center py-12">{t('documents.noPreview')}</p>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold">{t('documents.title')}</h2>
        <p className="text-gray-500 text-sm mt-1">{documents.length} {t('documents.subtitle')}</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <Select label={t('documents.classer')} options={targets} value={target} onChange={e => setTarget(e.target.value)} />
          </div>
          <input ref={fileRef} type="file" multiple hidden onChange={handleUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/*,.txt,.csv" />
          <Button onClick={() => fileRef.current.click()}><FiUpload /> {t('documents.upload')}</Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">{t('documents.note')}</p>
      </Card>

      <Card>
        <Select className="max-w-xs" label={t('documents.filter')}
          options={[
            { value: 'Tous', label: t('documents.filter_all') },
            { value: 'terrain', label: t('documents.filter_terrains') },
            { value: 'projet', label: t('documents.filter_projets') },
            { value: 'aucun', label: t('documents.sans_classement') },
          ]}
          value={filterType} onChange={e => setFilterType(e.target.value)}
        />
      </Card>

      {!filtered.length ? (
        <Card><EmptyState icon="📁" title={t('documents.noResult')} subtitle={t('documents.noResultSub')} /></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => {
            const Icon = iconFor(doc.type);
            const canPreview = !!doc.dataUrl;
            return (
              <Card key={doc.id} className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                  <Icon className="text-[#0F4C81]" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{doc.nom}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{(doc.taille / 1024).toFixed(1)} Ko</p>
                  <div className="mt-1"><Badge>{targetLabel(doc.cible)}</Badge></div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => openPreview(doc)}
                      className={`text-xs flex items-center gap-1 font-medium transition-all ${canPreview ? 'text-[#0F4C81] hover:underline' : 'text-gray-300 cursor-not-allowed'}`}
                      disabled={!canPreview}
                      title={canPreview ? t('documents.preview') : t('documents.noPreview')}
                    >
                      <FiEye size={13} /> {t('documents.apercu')}
                    </button>
                    {canPreview && (
                      <button onClick={() => handleDownload(doc)} className="text-xs flex items-center gap-1 text-[#2E8B57] font-medium hover:underline">
                        <FiDownload size={13} /> {t('documents.download')}
                      </button>
                    )}
                  </div>
                </div>
                <button onClick={() => remove('documents', doc.id)} className="text-red-400 hover:text-red-600 shrink-0">
                  <FiTrash2 size={16} />
                </button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.nom || t('documents.preview')} wide>
        {preview && (
          <div>
            {renderPreviewContent(preview)}
            {preview.dataUrl && (
              <div className="flex justify-end mt-4">
                <Button onClick={() => handleDownload(preview)}><FiDownload /> {t('documents.download')}</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}