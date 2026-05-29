import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold">
              G
            </div>
            <span className="text-lg font-semibold tracking-tight">
              GBICT Energy
            </span>
          </div>
          <nav className="hidden gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400 md:flex">
            <a href="#hoe-het-werkt" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Hoe het werkt
            </a>
            <a href="#voordelen" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Voordelen
            </a>
            <a href="#prijzen" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Prijzen
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Inloggen
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
            >
              Aanmelden
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Beta — voor early adopters
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Het besturingssysteem voor jouw{" "}
              <span className="text-emerald-500">thuisenergie</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Verbind elke batterij met elk dynamisch energiecontract. Onze AI
              optimaliseert automatisch wanneer je laadt, ontlaadt en verkoopt —
              zodat jij zonder moeite honderden euro&apos;s per jaar bespaart.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-500 px-6 text-sm font-medium text-white hover:bg-emerald-600"
              >
                Gratis starten
              </Link>
              <Link
                href="#hoe-het-werkt"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Bekijk hoe het werkt
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-zinc-500 dark:text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckIcon />
                Werkt met élke batterij
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                Geen contract-lock-in
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                Onafhankelijk platform
              </div>
            </div>
          </div>
        </section>

        <section
          id="voordelen"
          className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Drie pijnpunten, één platform
            </h2>
            <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
              De salderingsregeling stopt in 2027. Dynamische contracten worden
              de norm. Wij maken het slim — zonder dat jij vastzit aan één merk
              of leverancier.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card
                title="Automatisch besparen"
                body="Onze AI handelt op uurprijzen, weersvoorspelling en jouw verbruikspatroon. Jij ziet alleen het besparingsbedrag."
              />
              <Card
                title="Merk-onafhankelijk"
                body="Sessy, Enphase, Victron, SolarEdge, Tesla — wij koppelen aan jouw bestaande hardware en contract."
              />
              <Card
                title="Verdien terug"
                body="Straks: jouw batterij verdient mee op de energiemarkt. Gemiddeld €300-800 extra per jaar."
              />
            </div>
          </div>
        </section>

        <section id="hoe-het-werkt" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Hoe het werkt
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step
              n="1"
              title="Koppelen"
              body="Verbind je batterij en energiecontract met één klik via OAuth. Geen installateur, geen extra hardware."
            />
            <Step
              n="2"
              title="Optimaliseren"
              body="Onze AI maakt elk uur een nieuw plan op basis van EPEX-prijzen, weer en jouw verbruik."
            />
            <Step
              n="3"
              title="Besparen"
              body="Check je dashboard. Eén getal: hoeveel je vandaag, deze maand en dit jaar hebt bespaard."
            />
          </div>
        </section>

        <section
          id="prijzen"
          className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Begin gratis
            </h2>
            <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
              Tijdens de beta-fase betaal je niets. Wanneer we launchen krijg je
              early-adopter korting op het premium-abonnement.
            </p>
            <div className="mt-10">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-500 px-8 text-sm font-medium text-white hover:bg-emerald-600"
              >
                Word beta-tester
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 py-8 text-sm text-zinc-500 md:flex-row">
          <div>© {new Date().getFullYear()} GBICT Energy</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Privacy
            </a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Voorwaarden
            </a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {body}
      </p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
        {n}
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {body}
      </p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-emerald-500"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.42 0l-4-4a1 1 0 011.42-1.42L8 12.58l7.29-7.29a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
