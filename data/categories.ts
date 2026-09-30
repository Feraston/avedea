export const categoryCovers: Record<string, string> = {
  esteticheskaya_kosmetologiya: "/redesign/cat-face.jpg",
  apparatnaya: "/redesign/cat-device.jpg",
  vizazh: "/redesign/cat-makeup.jpg",
  epilyaciya: "/redesign/cat-depilation.jpg",
  massazh_lica: "/redesign/cat-face.jpg",
  massazh_tela: "/redesign/cat-body.jpg",
  uhody_phuts_lico: "/redesign/cat-phyts.jpg",
  uhody_phyts_telo: "/redesign/cat-body.jpg",
  bernard_kasser: "/redesign/cat-bernard.jpg",
  obertyvanie_telo: "/redesign/cat-wrap.jpg",
  lazernaya_epilyaciya: "/redesign/cat-laser.jpg",
};

export function getCategoryCover(category: string): string {
  return categoryCovers[category] || "/redesign/texture.jpg";
}
