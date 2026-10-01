import type { Metadata } from "next";
import { ServicesCatalog } from "@/components/ServicesCatalog";
import { asset } from "@/lib/asset";
import { getServicesByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Каталог услуг студии эстетической косметологии Avedea в Краснодаре.",
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  const groups = getServicesByCategory();

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero__media" aria-hidden>
          <img src={asset("/redesign/gen/banner.jpg")} alt="" />
          <div className="page-hero__shade" />
        </div>
        <div className="page-hero__content">
          <h1 className="page-hero__title">Услуги</h1>
          <p className="page-hero__text">
            Hydrafacial, уходы брендов, массаж, депиляция, лазер, перманент —
            актуальный каталог с записью онлайн.
          </p>
        </div>
      </section>
      <ServicesCatalog groups={groups} />
    </main>
  );
}
