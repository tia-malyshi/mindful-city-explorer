# MojaWawa 🌳

> Małe miejskie przygody, proste wyzwania i wspomnienia, które pokazują, jak różnorodne jest Twoje życie.

**MojaWawa** (repo: `mindful-city-explorer`) to aplikacja łącząca zdrowie psychiczne z odkrywaniem miasta. Zamiast przytłaczającej listy wydarzeń proponuje **jeden pomysł dopasowany do Twojej energii, pogody i zainteresowań** — a potem pomaga zapisać wrażenia i zobaczyć, jak różnorodne jest Twoje życie.

Projekt powstał na **Warsaw Open Data hackathon**.

🔗 **Live demo:** https://mindful-city-explorer.vercel.app

## 💡 The problem

W dużym mieście łatwo o zmęczenie wyborem i rutynę — mnóstwo wydarzeń, ale brakuje energii, żeby zdecydować. MojaWawa zdejmuje ten ciężar: jedna propozycja na raz, dopasowana do kontekstu, plus łagodne wyzwania i refleksja, które budują poczucie sprawczości i przynależności do miasta.

## ✨ Features

- **Jeden pomysł zamiast listy** — mniej zmęczenia wyborem, gdy brakuje energii (od 10 min na ławce po dłuższe spotkanie).
- **Zasada 80 / 20** — 80% pomysłów dopasowanych, 20% niespodzianek.
- **Zależnie od pogody** — plenerowe pomysły zamieniają się na te pod dachem, gdy pada.
- **Wyzwania (quests)** — np. zrób 3 zdjęcia, nagraj głosową refleksję, porozmawiaj z nieznajomym.
- **Refleksja i oceny** — szybka ocena aktywności (pozytywna / negatywna, chcę więcej podobnych).
- **Wspomnienia** — zdjęcia i refleksje grupowane w miesięczne historie.
- **Insights** — tygodniowe podsumowania z dostępem do źródłowych informacji.
- **Profil jako mapa myśli** — radialny diagram zainteresowań z gałęziami aktywności i historią.
- **Wielojęzyczność** — interfejs po polsku, angielsku i rosyjsku.
- **Społeczność** — zaproś znajomych udostępnieniem.
- **Prywatność** — konta osobiste; zdjęcia i nagrania prywatne, dostępne tylko na Twoim koncie.

## 🔌 Data sources

Otwarte dane miejskie Warszawy:
- `api.um.warszawa.pl` — parki, obiekty sportowe, baseny, biblioteki, wydarzenia.
- **ZTM** — czas dojazdu komunikacją miejską.

## 🛠️ Tech stack

**Frontend**
- **React 19** + **TypeScript 5.8**
- **TanStack Start** / **TanStack Router** (full-stack React, file-based routing)
- **TanStack React Query** — data fetching i cache
- **Tailwind CSS v4** (`@tailwindcss/vite`) + `tw-animate-css`
- **shadcn/ui** na bazie **Radix UI** (dialog, popover, tabs, tooltip, drawer `vaul`, command `cmdk` itd.)
- `lucide-react` (ikony), `recharts` (wykresy Insights), `embla-carousel`, `react-day-picker`, `sonner` (toasty)
- Formularze: **react-hook-form** + **zod** (`@hookform/resolvers`)

**Backend / data**
- **Supabase** (`@supabase/supabase-js`) — auth, baza, storage (zdjęcia / nagrania)
- **Drizzle ORM** + `drizzle-kit`, sterownik `postgres`
- Serwer: `src/server.ts` / `src/start.ts` (TanStack Start), build przez **Nitro**

**Tooling**
- **Vite 8** (z `rolldown`), `vite-tsconfig-paths`
- **Vitest 4** + Testing Library (`@testing-library/react`, `jest-dom`, `jsdom`)
- **ESLint 9** + **Prettier**
- **Bun** jako package manager / runtime (`bun.lock`, `bunfig.toml`)
- Deploy: **Vercel**

## 🗂️ Project structure

```
src/
├── assets/                 # obrazy, statyczne zasoby
├── components/             # komponenty UI (shadcn/ui + własne)
├── hooks/                  # custom React hooks
├── integrations/supabase/  # klient i typy Supabase
├── lib/                    # utils, helpery
├── routes/                 # trasy (TanStack Router, file-based)
├── test/                   # testy (Vitest)
├── router.tsx              # konfiguracja routera
├── server.ts / start.ts    # entry serwera (TanStack Start)
└── styles.css              # Tailwind + style globalne
supabase/config.toml        # konfiguracja projektu Supabase
drizzle/                    # migracje / schema (Drizzle)
```

## 🚀 Getting started

Wymagania: **[Bun](https://bun.sh)** (lub Node.js 20+ i npm) oraz projekt **Supabase**.

```bash
git clone https://github.com/tia-malyshi/mindful-city-explorer.git
cd mindful-city-explorer

cp .env.example .env   # uzupełnij Supabase URL i publishable key
bun install
bun run dev
```

Dostępne skrypty:

```bash
bun run dev        # tryb deweloperski (vite dev)
bun run build      # build produkcyjny
bun run preview    # podgląd buildu
bun run lint       # ESLint
bun run format     # Prettier
bun run test       # testy (vitest run)
```

## 👥 Team

_(dodaj imiona i role członków zespołu)_

## 📄 License

_(np. MIT)_

---
*Built at Warsaw Open Data hackathon.*
