import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/ServiceDetail";
import { getAllServiceParams, getService } from "@/lib/content";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllServiceParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const service = getService(category, slug);
  if (!service) return { title: "Услуга" };
  return {
    title: service.title,
    description: service.description?.[0] || `${service.title} — Avedea`,
    alternates: { canonical: `/services/${category}/${slug}/` },
  };
}

export default async function ServicePage({ params }: Props) {
  const { category, slug } = await params;
  const service = getService(category, slug);
  if (!service) notFound();

  return (
    <main>
      <ServiceDetail service={service} />
    </main>
  );
}
