export const site = {
  name: "Avedea",
  title: "Avedea — студия эстетической косметологии",
  description:
    "Студия эстетической косметологии AVEDEA в Краснодаре. Уходы PHYT'S, Bernard Cassiere, массаж, депиляция и лазерная эпиляция.",
  url: "https://avedea.ru",
  phone: "+79184641096",
  phoneDisplay: "Записаться по телефону",
  addressShort: "г. Краснодар, ул. Цезаря Куникова, 24 корп 3",
  addressFull:
    "г. Краснодар, ул. Цезаря Куникова, 24 корп 3, 1 этаж, офис 107-110",
  yclientsBookingUrl:
    "https://b182496.yclients.com/company/185262/record-type?o=s7743448",
  vkUrl: "https://vk.com/public212582834",
  /** Set real link when available; null hides the icon */
  telegramUrl: null as string | null,
  /** WhatsApp chat for studio phone */
  whatsappUrl: "https://wa.me/79184641096",
  mapEmbedUrl:
    "https://yandex.ru/map-widget/v1/?um=constructor%3Ae455a16e4c826e85868b4ad78e932ef9ede2e660dfd696f4bbef361bd83ecec8&source=constructor",
  metrikaId: 93236783,
  copyrightYears: "2010 - 2026",
  tagline: "Осознанная забота о себе в Краснодаре.",
  heroTitle: "Студия эстетической косметологии",
  promo: {
    title: "Новинка",
    subtitle: "Лазерная эпиляция",
  },
  ogImage: "/og.png",
} as const;

export type SiteConfig = typeof site;
