const CATEGORY_TITLES: Record<string, string> = {
  hydrafacial: "SPA Vortex Hydrafacial",
  esteticheskaya_kosmetologiya: "Эстетическая косметология",
  apparatnaya: "Аппаратная",
  vizazh: "Брови и ресницы",
  epilyaciya: "Депиляция",
  massazh_lica: "Массаж лица",
  massazh_tela: "Массаж тела",
  uhody_phuts_lico: "Уходы PHYT'S — лицо",
  uhody_phyts_telo: "Уходы PHYT'S — тело",
  bernard_kasser: "Уходы Бернард Кассьер",
  simone_mahler: "Уходы Simone Mahler",
  ella_bache: "Ella Baché",
  thalgo: "Thalgo",
  obertyvanie_telo: "Обертывание тела",
  lazernaya_epilyaciya: "Лазерная эпиляция",
  permanent: "Перманентный макияж",
  piercing: "Пирсинг",
};

export function formatCategoryTitle(category: string, fallback: string): string {
  return CATEGORY_TITLES[category] || fallback;
}

export function formatProcedureCount(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} процедура`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${n} процедуры`;
  }
  return `${n} процедур`;
}

export function formatServiceCount(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} услуга`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${n} услуги`;
  }
  return `${n} услуг`;
}
