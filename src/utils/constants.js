// constants.js

// Each entry keeps a stable `value` (used for storage/filtering)
// plus fr/ar labels for display.
export const WILAYAS_DATA = [
  { value: 'Adrar', fr: 'Adrar', ar: 'أدرار' },
  { value: 'Chlef', fr: 'Chlef', ar: 'الشلف' },
  { value: 'Laghouat', fr: 'Laghouat', ar: 'الأغواط' },
  { value: 'Oum El Bouaghi', fr: 'Oum El Bouaghi', ar: 'أم البواقي' },
  { value: 'Batna', fr: 'Batna', ar: 'باتنة' },
  { value: 'Béjaïa', fr: 'Béjaïa', ar: 'بجاية' },
  { value: 'Biskra', fr: 'Biskra', ar: 'بسكرة' },
  { value: 'Béchar', fr: 'Béchar', ar: 'بشار' },
  { value: 'Blida', fr: 'Blida', ar: 'البليدة' },
  { value: 'Bouira', fr: 'Bouira', ar: 'البويرة' },
  { value: 'Tamanrasset', fr: 'Tamanrasset', ar: 'تمنراست' },
  { value: 'Tébessa', fr: 'Tébessa', ar: 'تبسة' },
  { value: 'Tlemcen', fr: 'Tlemcen', ar: 'تلمسان' },
  { value: 'Tiaret', fr: 'Tiaret', ar: 'تيارت' },
  { value: 'Tizi Ouzou', fr: 'Tizi Ouzou', ar: 'تيزي وزو' },
  { value: 'Alger', fr: 'Alger', ar: 'الجزائر' },
  { value: 'Djelfa', fr: 'Djelfa', ar: 'الجلفة' },
  { value: 'Jijel', fr: 'Jijel', ar: 'جيجل' },
  { value: 'Sétif', fr: 'Sétif', ar: 'سطيف' },
  { value: 'Saïda', fr: 'Saïda', ar: 'سعيدة' },
  { value: 'Skikda', fr: 'Skikda', ar: 'سكيكدة' },
  { value: 'Sidi Bel Abbès', fr: 'Sidi Bel Abbès', ar: 'سيدي بلعباس' },
  { value: 'Annaba', fr: 'Annaba', ar: 'عنابة' },
  { value: 'Guelma', fr: 'Guelma', ar: 'قالمة' },
  { value: 'Constantine', fr: 'Constantine', ar: 'قسنطينة' },
  { value: 'Médéa', fr: 'Médéa', ar: 'المدية' },
  { value: 'Mostaganem', fr: 'Mostaganem', ar: 'مستغانم' },
  { value: "M'Sila", fr: "M'Sila", ar: 'المسيلة' },
  { value: 'Mascara', fr: 'Mascara', ar: 'معسكر' },
  { value: 'Ouargla', fr: 'Ouargla', ar: 'ورقلة' },
  { value: 'Oran', fr: 'Oran', ar: 'وهران' },
  { value: 'El Bayadh', fr: 'El Bayadh', ar: 'البيض' },
  { value: 'Illizi', fr: 'Illizi', ar: 'إليزي' },
  { value: 'Bordj Bou Arréridj', fr: 'Bordj Bou Arréridj', ar: 'برج بوعريريج' },
  { value: 'Boumerdès', fr: 'Boumerdès', ar: 'بومرداس' },
  { value: 'El Tarf', fr: 'El Tarf', ar: 'الطارف' },
  { value: 'Tindouf', fr: 'Tindouf', ar: 'تندوف' },
  { value: 'Tissemsilt', fr: 'Tissemsilt', ar: 'تيسمسيلت' },
  { value: 'El Oued', fr: 'El Oued', ar: 'الوادي' },
  { value: 'Khenchela', fr: 'Khenchela', ar: 'خنشلة' },
  { value: 'Souk Ahras', fr: 'Souk Ahras', ar: 'سوق أهراس' },
  { value: 'Tipaza', fr: 'Tipaza', ar: 'تيبازة' },
  { value: 'Mila', fr: 'Mila', ar: 'ميلة' },
  { value: 'Aïn Defla', fr: 'Aïn Defla', ar: 'عين الدفلى' },
  { value: 'Naâma', fr: 'Naâma', ar: 'النعامة' },
  { value: 'Aïn Témouchent', fr: 'Aïn Témouchent', ar: 'عين تموشنت' },
  { value: 'Ghardaïa', fr: 'Ghardaïa', ar: 'غرداية' },
  { value: 'Relizane', fr: 'Relizane', ar: 'غليزان' },
];

export const ROLES_DATA = [
  { value: 'administrateur', fr: 'Administrateur', ar: 'مدير' },
  { value: 'investisseur', fr: 'Investisseur', ar: 'مستثمر' },
  { value: 'promoteur', fr: 'Promoteur', ar: 'مطوّر' },
  { value: 'architecte', fr: 'Architecte', ar: 'مهندس معماري' },
  { value: 'bureau_etude', fr: "Bureau d'étude", ar: 'مكتب دراسات' },
  { value: 'entreprise', fr: 'Entreprise', ar: 'مؤسسة' },
  { value: 'proprietaire', fr: 'Propriétaire foncier', ar: 'مالك عقاري' },
];

export const TERRAIN_TYPES_DATA = [
  { value: 'Résidentiel', fr: 'Résidentiel', ar: 'سكني' },
  { value: 'Commercial', fr: 'Commercial', ar: 'تجاري' },
  { value: 'Industriel', fr: 'Industriel', ar: 'صناعي' },
  { value: 'Agricole', fr: 'Agricole', ar: 'زراعي' },
  { value: 'Mixte', fr: 'Mixte', ar: 'مختلط' },
];

export const STATUT_JURIDIQUE_DATA = [
  { value: 'Titre foncier', fr: 'Titre foncier', ar: 'سند ملكية عقاري' },
  { value: 'Acte notarié', fr: 'Acte notarié', ar: 'عقد موثق' },
  { value: 'Concession', fr: 'Concession', ar: 'امتياز' },
  { value: 'En régularisation', fr: 'En régularisation', ar: 'قيد التسوية' },
];

export const PROJET_STATUTS_DATA = [
  { value: 'En étude', fr: 'En étude', ar: 'قيد الدراسة' },
  { value: 'Validé', fr: 'Validé', ar: 'تمت الموافقة' },
  { value: 'En cours', fr: 'En cours', ar: 'قيد الإنجاز' },
  { value: 'Terminé', fr: 'Terminé', ar: 'منتهي' },
];

// --- Backward-compatible raw value arrays (unchanged, still French-keyed) ---
export const WILAYAS = WILAYAS_DATA.map(w => w.value);
export const ROLES = ROLES_DATA.map(r => ({ value: r.value, label: r.fr }));
export const TERRAIN_TYPES = TERRAIN_TYPES_DATA.map(x => x.value);
export const STATUT_JURIDIQUE = STATUT_JURIDIQUE_DATA.map(x => x.value);
export const PROJET_STATUTS = PROJET_STATUTS_DATA.map(x => x.value);

// --- Language-aware getters: use these wherever you render options/labels ---
const pick = (item, lang) => (lang === 'ar' ? item.ar : item.fr);

export const getWilayas = (lang = 'fr') =>
  WILAYAS_DATA.map(w => ({ value: w.value, label: pick(w, lang) }));

export const getRoles = (lang = 'fr') =>
  ROLES_DATA.map(r => ({ value: r.value, label: pick(r, lang) }));

export const getTerrainTypes = (lang = 'fr') =>
  TERRAIN_TYPES_DATA.map(x => ({ value: x.value, label: pick(x, lang) }));

export const getStatutJuridique = (lang = 'fr') =>
  STATUT_JURIDIQUE_DATA.map(x => ({ value: x.value, label: pick(x, lang) }));

export const getProjetStatuts = (lang = 'fr') =>
  PROJET_STATUTS_DATA.map(x => ({ value: x.value, label: pick(x, lang) }));

// --- Single-value label lookups (for displaying an already-stored value) ---
export const wilayaLabel = (value, lang = 'fr') =>
  pick(WILAYAS_DATA.find(w => w.value === value) || {}, lang) || value;

export const roleLabel = (value, lang = 'fr') =>
  pick(ROLES_DATA.find(r => r.value === value) || {}, lang) || value;

export const terrainTypeLabel = (value, lang = 'fr') =>
  pick(TERRAIN_TYPES_DATA.find(x => x.value === value) || {}, lang) || value;

export const statutJuridiqueLabel = (value, lang = 'fr') =>
  pick(STATUT_JURIDIQUE_DATA.find(x => x.value === value) || {}, lang) || value;

export const projetStatutLabel = (value, lang = 'fr') =>
  pick(PROJET_STATUTS_DATA.find(x => x.value === value) || {}, lang) || value;