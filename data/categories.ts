import { asset } from "@/lib/asset";

/** Category covers — original color photos from the studio library */
export const categoryCovers: Record<string, string> = {
  hydrafacial: "/redesign/cat-hydrafacial.jpg",
  esteticheskaya_kosmetologiya: "/blocks/uslugi/file/usluga11.jpg",
  apparatnaya: "/redesign/cat-apparat.jpg",
  vizazh: "/blocks/uslugi/file/usluga31.jpg",
  epilyaciya: "/redesign/dep/legs-thighs.jpg",
  massazh_lica: "/blocks/uslugi/file/usluga21.jpg",
  massazh_tela: "/blocks/uslugi/file/usluga61.jpg",
  uhody_phuts_lico: "/blocks/uslugi/file/usluga51.jpg",
  uhody_phyts_telo: "/blocks/uslugi/file/usluga64.jpg",
  bernard_kasser: "/blocks/uslugi/file/usluga75.jpg",
  simone_mahler: "/redesign/soft/about-soft.jpg",
  ella_bache: "/redesign/gen/about.jpg",
  thalgo: "/redesign/cat-thalgo.jpg",
  obertyvanie_telo: "/redesign/cat-wrap.jpg",
  lazernaya_epilyaciya: "/blocks/uslugi/file/usluga81.jpg",
  permanent: "/blocks/uslugi/file/usluga31.jpg",
  piercing: "/redesign/gen/texture.jpg",
};

export function getCategoryCover(category: string): string {
  return asset(categoryCovers[category] || "/redesign/gen/texture.jpg");
}
