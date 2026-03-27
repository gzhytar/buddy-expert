## Why

Experti potřebují spolehlivě dokázat, kdo jsou, a bezpečně se vracet ke svým přípravám a reflexím z více zařízení. Dnes je přihlášení jen přes e-mail a heslo; chybí běžná očekávání (Google) a jasná, použitelná historie vlastní práce pod účtem.

## What Changes

- Přidání přihlášení přes **Google účet** (OAuth) vedle stávajícího přihlášení **e-mailem** (klasické heslo u registrovaných uživatelů; rozšíření modelu účtu pro účty bez hesla).
- Sjednocení identity v aplikaci tak, aby všechny přípravy a reflexe zůstaly **vázané na přihlášeného uživatele** a nebyly sdílené mezi účty.
- **Přehled historie**: uživatel uvidí a otevře své minulé a rozpracované přípravy a reflexe (aspoň seznam s navigací do existujících flow), aby „historie“ nebyla jen implicitní přes přímé URL.
- Aktualizace **databázového modelu** a konfigurace Auth.js (NextAuth v5) včetně proměnných prostředí pro Google OAuth.
- Dokumentace a šablony `.env` pro nové tajné klíče a callback URL.

## Capabilities

### New Capabilities

- `user-authentication`: Přihlášení a odhlášení — Google OAuth, e-mail + heslo, session JWT, chybové stavy a české texty v UI; propojení s tabulkou uživatelů a účtů OAuth dle Auth.js.
- `user-consultation-history`: Přístup k vlastní historii — přehled příprav a reflexí přihlášeného uživatele, otevření draftu i dokončených záznamů, konzistence s vlastnictvím záznamů.

### Modified Capabilities

- `platform-database`: Rozšíření schématu pro OAuth účty (např. NextAuth `Account`), uvolnění povinného hesla u řádku `users` tam, kde je identita pouze přes poskytovatele, a migrace bez rozbití stávajících uživatelů s heslem.

## Impact

- `auth.ts`, `auth.config.ts`, middleware, `app/login/*`, route `app/api/auth/[...nextauth]`.
- `lib/db/schema.ts`, Drizzle migrace, případně seed.
- Nové nebo upravené stránky pro přehled historie a odkazy z hlavní navigace.
- Závislosti: konfigurace Google Cloud OAuth klienta, proměnné `AUTH_SECRET`, `AUTH_URL` / callback URL na Vercelu, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
- Žádné **BREAKING** změny veřejného HTTP API mimo rozšíření auth callbacků, pokud není zavedena nová verze endpointů.
