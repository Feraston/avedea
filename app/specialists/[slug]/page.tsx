import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpecialistDetail } from "@/components/SpecialistDetail";
import { getSpecialist, getSpecialists } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getSpecialists().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const specialist = getSpecialist(slug);
  if (!specialist) return { title: "Специалист" };
  return {
    title: specialist.title,
    description: `${specialist.shortName} — специалист студии Avedea`,
    alternates: { canonical: `/specialists/${slug}/` },
  };
}

export default async function SpecialistPage({ params }: Props) {
  const { slug } = await params;
  const specialist = getSpecialist(slug);
  if (!specialist) notFound();

  return (
    <main className="main">
      <SpecialistDetail specialist={specialist} />
    </main>
  );
}
