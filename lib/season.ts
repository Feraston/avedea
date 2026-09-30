/** Calendar seasons for Krasnodar / RU marketing copy. */
export function getSeasonalOffersTitle(date = new Date()): string {
  const month = date.getMonth(); // 0 = January

  if (month >= 2 && month <= 4) return "Весенние предложения";
  if (month >= 5 && month <= 7) return "Летние предложения";
  if (month >= 8 && month <= 10) return "Осенние предложения";
  return "Зимние предложения";
}
