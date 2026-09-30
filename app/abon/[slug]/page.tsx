import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AbonementDetail } from "@/components/AbonementDetail";
import { getAbonement, getAbonements } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAbonements().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const abon = getAbonement(slug);
  if (!abon) return { title: "Абонемент" };
  return {
    title: abon.title,
    description: abon.summary[0] || abon.title,
    alternates: { canonical: `/abon/${slug}/` },
  };
}

export default async function AbonPage({ params }: Props) {
  const { slug } = await params;
  const abon = getAbonement(slug);
  if (!abon) notFound();

  return (
    <main>
      <AbonementDetail abonement={abon} />
    </main>
  );
}
