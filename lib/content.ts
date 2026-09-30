import services from "@/data/services.json";
import abonements from "@/data/abonements.json";
import specialists from "@/data/specialists.json";
import training from "@/data/training.json";
import home from "@/data/home.json";

export type Service = (typeof services)[number];
export type Abonement = (typeof abonements)[number];
export type Specialist = (typeof specialists)[number];
export type Seminar = (typeof training)[number];
export type HomeContent = typeof home;

export function getServices(): Service[] {
  return services;
}

export function getServicesByCategory(): { category: string; categoryTitle: string; items: Service[] }[] {
  const map = new Map<string, { category: string; categoryTitle: string; items: Service[] }>();
  for (const s of services) {
    const existing = map.get(s.category);
    if (existing) {
      existing.items.push(s);
    } else {
      map.set(s.category, {
        category: s.category,
        categoryTitle: s.categoryTitle,
        items: [s],
      });
    }
  }
  return Array.from(map.values());
}

export function getService(category: string, slug: string): Service | undefined {
  return services.find((s) => s.category === category && s.slug === slug);
}

export function getServiceNeighbors(service: Service): {
  prev?: Service;
  next?: Service;
} {
  const inCategory = services
    .filter((s) => s.category === service.category)
    .sort((a, b) => a.order - b.order);
  const idx = inCategory.findIndex((s) => s.slug === service.slug);
  return {
    prev: idx > 0 ? inCategory[idx - 1] : undefined,
    next: idx >= 0 && idx < inCategory.length - 1 ? inCategory[idx + 1] : undefined,
  };
}

export function getAllServiceParams() {
  return services.map((s) => ({ category: s.category, slug: s.slug }));
}

export function getAbonements(): Abonement[] {
  return abonements;
}

export function getAbonement(slug: string): Abonement | undefined {
  return abonements.find((a) => a.slug === slug);
}

export function getSpecialists(): Specialist[] {
  return specialists;
}

export function getSpecialist(slug: string): Specialist | undefined {
  return specialists.find((s) => s.slug === slug);
}

export function getTraining(): Seminar[] {
  return training;
}

export function getHome(): HomeContent {
  return home;
}
