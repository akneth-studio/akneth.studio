[![Known Vulnerabilities](https://snyk.io/test/github/akneth-studio/akneth.studio/badge.svg)](https://snyk.io/test/github/akneth-studio/akneth.studio) 
[![CodeFactor](https://www.codefactor.io/repository/github/akneth-studio/akneth.studio/badge)](https://www.codefactor.io/repository/github/akneth-studio/akneth.studio) 
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/) 
[![Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel&link=https%3A%2F%2Fakneth-studio.vercel.app)](https://akneth-studio.vercel.app) 
[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v3/monitor/20vu2.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

# AKNETH Studio – Strona firmowa

Nowoczesna, responsywna strona internetowa dla AKNETH Studio Katarzyna Pawłowska-Malesa, zbudowana w oparciu o Next.js, React, TypeScript i Supabase.

---

## 📦 Zawartość projektu

- **Next.js 15** (App Router, SSR, SSG)
- **React 19**
- **TypeScript**
- **Supabase** (baza danych, API)
- **SASS/SCSS** (własne style + Bootstrap 5)
- **Google reCAPTCHA v3** (ochrona formularza kontaktowego)
- **Automatyzacje CI/CD (GitLab)**

---

## 🚀 Szybki start

1. Sklonuj repozytorium:
   ```bash
   git clone <adres-repo>
   cd akneth-website
   ```
2. Zainstaluj zależności (pnpm, npm lub yarn):
   ```bash
   pnpm install
   # lub
   npm install
   ```
3. Skonfiguruj plik `.env.local` (przykładowy plik w repozytorium - `.env.example`):
   - Klucze Supabase
   - Klucze Google reCAPTCHA
   - Dane kontaktowe (telefon, adres, mail)
   - Klucze Google Tag Manager - jeśli potrzebne
   - Site URL
   - linki do Google Calendar - do iframe i link bezpośredni.
4. Uruchom projekt developersko:
   ```bash
   pnpm dev
   # lub
   npm run dev
   ```
5. Strona będzie dostępna pod adresem `http://localhost:3000`

---

## 🛠️ Instrukcje dla współtwórców

1. **Sklonuj repozytorium:**
   ```bash
   git clone <adres-repo>
   cd akneth-website
   ```

2. **Zainstaluj zależności:**
   ```bash
   pnpm install
   # lub
   npm install
   ```

3. **Utwórz plik .env.local na podstawie .env.example i uzupełnij wymagane dane.**

4. **Uruchom projekt developersko:**
   ```bash
   pnpm dev
   # lub
   npm run dev
   ```

5. **Odwiedź stronę pod adresem:**  
   [http://localhost:3000](http://localhost:3000)

6. **Wysyłaj zmiany przez pull/merge requesty do gałęzi `main`.**

7. **Po zaakceptowaniu zmian i zmergowaniu do `main`, projekt zostanie automatycznie wdrożony na Vercel.**

---

## 🚀 Instrukcja wdrożenia na Vercel

1. Zaloguj się lub załóż konto na [Vercel](https://vercel.com/).
2. Kliknij **New Project**.
3. Połącz swoje konto GitHub/GitLab/Bitbucket z Vercel i wybierz repozytorium `akneth-website`.
4.  Ustaw:
   - **Branch:** `main`
   - **Framework Preset:** Next.js
   - **Build Command:**  
     ```
     pnpm build
     ```
     lub  
     ```
     npm run build
     ```
   - **Output Directory:** `.next`
   - **Environment:** Node 18+ (lub zgodnie z wymaganiami projektu)
5. Dodaj zmienne środowiskowe z pliku `.env.local` (przepisz je do zakładki Environment Variables w Vercel).
6. Kliknij **Deploy**.
7. Vercel automatycznie zbuduje i wdroży projekt. Każdy push do `main` uruchomi nowe wdrożenie.

---

## 📁 Struktura katalogów

```
├── public/                # Statyczne pliki, grafiki, favicony
├── src/
│   ├── app/               # Główne strony i routing Next.js
│   │   ├── about/         # Podstrona "O mnie"
│   │   ├── contact/       # Formularz kontaktowy, info, harmonogram
│   │   ├── policies/      # Polityki: RODO, prywatność, regulamin
│   │   ├── services/      # Oferta usług
│   │   └── api/           # API (np. obsługa formularza kontaktowego)
│   ├── components/        # Komponenty wielokrotnego użytku (CTAButton, Popup, Navbar, Footer, sekcje)
│   ├── data/              # Dane do cennika, usług
│   ├── lib/               # Klient Supabase, typy, narzędzia
│   ├── schemas/           # Schematy walidacji (np. formularz kontaktowy)
│   ├── styles/            # Style globalne i moduły SCSS
│   └── types/             # Typy TypeScript
├── .gitlab-ci.yml         # Konfiguracja CI/CD
├── package.json           # Zależności i skrypty
├── tsconfig.json          # Konfiguracja TypeScript
├── CHANGELOG.md           # Historia zmian
├── CONTRIBUTING.md        # Wskazówki dla współtwórców
├── SECURITY.md            # Polityka bezpieczeństwa
└── ...
```

---

## 🌐 Wdrożenie

Projekt jest automatycznie wdrażany na platformie [Vercel](https://vercel.com/).
Każdy push lub merge do gałęzi `main` uruchamia automatyczne wdrożenie – najnowsza wersja strony jest zawsze dostępna pod adresem: [akneth-studio.vercel.app](https://akneth-studio.vercel.app)

---

## 🛡️ Bezpieczeństwo
- Formularz kontaktowy chroniony przez Google reCAPTCHA v3
- Dane zapisywane w Supabase
- Polityki prywatności, RODO i regulamin dostępne na stronie

---

## 🧪 Testowanie
- (Opcjonalnie) Dodaj testy jednostkowe lub integracyjne według potrzeb

---

## 📄 Licencja
Projekt objęty licencją [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

---

## 📬 Kontakt
- Strona: [akneth-studio.vercel.app](https://akneth-studio.vercel.app)
- E-mail: akneth.studio@gmail.com

---

> Stworzono z pasją przez AKNETH Studio Katarzyna Pawłowska-Malesa
