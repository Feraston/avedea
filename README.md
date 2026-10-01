# Avedea

Сайт студии эстетической косметологии [avedea.ru](https://avedea.ru).

## Стек

- Next.js 15 (App Router) + TypeScript
- Static export → GitHub Pages
- Контент услуг/абонементов/специалистов в `data/*.json` (без БД)

## Разработка

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

Результат в `out/` (включая редиректы со старых `.html` URL).

## Контент

- Услуги: [`data/services.json`](data/services.json) — цены не хранятся
- YClients-ссылки правятся в JSON
- Общие настройки сайта: [`data/site.ts`](data/site.ts)
- Раздел «Каталог» скрыт из меню (старые URL редиректят на главную)

Стили собираются в один файл:

```bash
npm run css
```

(`prebuild` делает это автоматически.)

### Деплой

GitHub Actions (`.github/workflows/deploy.yml`) публикует на GitHub Pages:

- [avedea.ru](https://avedea.ru/) — текущий дизайн (`master`)
- [avedea.ru/new](https://avedea.ru/new/) — редизайн (`redesign`, `NEXT_BASE_PATH=/new`)

В настройках репозитория: **Settings → Pages → Source → GitHub Actions**.
Домен задаётся через `public/CNAME` (`avedea.ru`).

Локально редизайн как на проде под `/new/`:

```bash
NEXT_BASE_PATH=/new npm run build
```

Обычная разработка без префикса: `npm run dev`.