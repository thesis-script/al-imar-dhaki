import { useLang } from '../../contexts/LanguageContext';
import { useState } from 'react';
import { FiTrash2, FiUsers, FiMap, FiBriefcase, FiBarChart2 } from 'react-icons/fi';
import { Badge, Card, EmptyState } from '../../components/ui/UI';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { roleLabel, projetStatutLabel } from '../../utils/constants';

export default function Admin() {
  const { getUsers } = useAuth();
  const { terrains, projets, evaluations, annonces, remove } = useData();
  const { t: tr, lang } = useLang();
  const [tab, setTab] = useState('utilisateurs');

  const users = getUsers();

  const TABS = [
    { id: 'utilisateurs', label: tr('admin.tab_users'), icon: FiUsers },
    { id: 'terrains', label: tr('admin.tab_terrains'), icon: FiMap },
    { id: 'projets', label: tr('admin.tab_projets'), icon: FiBriefcase },
    { id: 'stats', label: tr('admin.tab_stats'), icon: FiBarChart2 },
  ];

  const dateLocale = lang === 'ar' ? 'ar-DZ' : 'fr-FR';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold">{tr('admin.title')}</h2>
        <p className="text-gray-500 text-sm mt-1">{tr('admin.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === tabItem.id ? 'bg-[#0F4C81] text-white' : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            <tabItem.icon size={16} /> {tabItem.label}
          </button>
        ))}
      </div>

      {tab === 'utilisateurs' && (
        <Card className="!p-0 overflow-x-auto">
          {!users.length ? <EmptyState icon="👥" title={tr('admin.no_users')} /> : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">{tr('admin.col_name')}</th>
                  <th className="text-left px-4 py-3">{tr('admin.col_email')}</th>
                  <th className="text-left px-4 py-3">{tr('admin.col_role')}</th>
                  <th className="text-left px-4 py-3">{tr('admin.col_date')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3"><Badge>{roleLabel(u.role, lang)}</Badge></td>
                    <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString(dateLocale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {tab === 'terrains' && (
        <Card className="!p-0 overflow-x-auto">
          {!terrains.length ? <EmptyState icon="🗺️" title={tr('admin.no_terrains')} /> : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">{tr('admin.col_name')}</th>
                  <th className="text-left px-4 py-3">{tr('admin.col_wilaya')}</th>
                  <th className="text-left px-4 py-3">{tr('admin.col_surface')}</th>
                  <th className="text-left px-4 py-3">{tr('admin.col_action')}</th>
                </tr>
              </thead>
              <tbody>
                {terrains.map((t) => (
                  <tr key={t.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{t.nom}</td>
                    <td className="px-4 py-3">{t.wilaya}</td>
                    <td className="px-4 py-3">{t.surface} m²</td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove('terrains', t.id)} className="text-red-500"><FiTrash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {tab === 'projets' && (
        <Card className="!p-0 overflow-x-auto">
          {!projets.length ? <EmptyState icon="🏗️" title={tr('admin.no_projets')} /> : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">{tr('admin.col_name')}</th>
                  <th className="text-left px-4 py-3">{tr('admin.col_statut')}</th>
                  <th className="text-left px-4 py-3">{tr('admin.col_budget')}</th>
                  <th className="text-left px-4 py-3">{tr('admin.col_action')}</th>
                </tr>
              </thead>
              <tbody>
                {projets.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{p.nom}</td>
                    <td className="px-4 py-3"><Badge>{projetStatutLabel(p.statut, lang)}</Badge></td>
                    <td className="px-4 py-3">{Number(p.budget || 0).toLocaleString(dateLocale)} DA</td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove('projets', p.id)} className="text-red-500"><FiTrash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {tab === 'stats' && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: tr('admin.stat_users'), value: users.length, color: '#0F4C81' },
            { label: tr('admin.stat_terrains'), value: terrains.length, color: '#2E8B57' },
            { label: tr('admin.stat_projets'), value: projets.length, color: '#F4A300' },
            { label: tr('admin.stat_evaluations'), value: evaluations.length, color: '#c0392b' },
            { label: tr('admin.stat_annonces'), value: annonces.length, color: '#0F4C81' },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <p className="text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}