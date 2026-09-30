import type { Metadata } from "next";
import { PromoLaser } from "@/components/PromoLaser";
import { ServicesCatalog } from "@/components/ServicesCatalog";
import { getHome, getServicesByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Услуги",
  description: "Каталог услуг студии эстетической косметологии Avedea в Краснодаре.",
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  const groups = getServicesByCategory();
  const home = getHome();

  return (
    <main className="main">
      <PromoLaser laserPopup={home.laserPopup} />
      <ServicesCatalog groups={groups} />
    </main>
  );
}
