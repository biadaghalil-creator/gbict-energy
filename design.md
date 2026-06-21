# GBICT Energy — Design Fundament

> Dit bestand is de bron van waarheid voor hoe GBICT Energy eruitziet, beweegt en klinkt.
> Elke designkeuze (kleur, type, animatie, copy) verwijst terug naar dit document.
> Twijfel je over een keuze? Het antwoord staat hier. Staat het er niet? Dan eerst hier vastleggen.

---

## 1. Wat is GBICT Energy?

**Slim energieplatform voor Nederlandse huiseigenaren met zon, accu en laadpaal.**

GBICT Energy is een merk-onafhankelijke app die je thuisbatterij, zonnepanelen, laadpaal
en dynamische energiecontract op één plek samenbrengt — en ze automatisch op het juiste
moment laat in- en verkopen. De app koopt stroom in als die goedkoop is, verkoopt als de prijs
piekt, en stuurt al je apparaten aan zonder dat jij iets hoeft te doen.

Klaar voor 2027, als de salderingsregeling stopt en slim sturen het verschil maakt tussen
geld verliezen en geld verdienen met je eigen energie.

**Voor wie:** Nederlandse huiseigenaren met zonnepanelen, een thuisbatterij of een laadpaal, die
nu geld laten liggen omdat hun apparaten niet samenwerken.

**De belofte in één zin:** je ziet in één oogopslag waar je energie heen gaat én wat het je oplevert.

---

## 2. Merkpersoonlijkheid

Drie woorden sturen elke keuze:

| Woord | Wat het betekent voor design |
|-------|------------------------------|
| **Slim** | Het werkt vóór je. De app voelt alsof er een onzichtbare hand meedenkt — rust aan de buitenkant, intelligentie eronder. |
| **Energiek** | Beweging en stroom. Dingen lichten op, deeltjes bewegen, het mintgroen "leeft". Een statische tabel is een gemiste kans. |
| **Nuchter** | Strak, precies, eerlijk. Echte cijfers in euro's, geen poespas. Een controlepaneel dat je vertrouwt, geen marketing-app. |

Rode draad: **slim en energiek, zonder druk.** Premium controlepaneel, geen gamified eco-app.

---

## 3. Kleuren

Donker als basis. Het mintgroen is schaars — het is de "stroom", geen achtergrond.

### Tokens

```css
/* Primair — knoppen, links, actieve staat */
--color-primary:      #3B82F6;  /* electric blue — technisch, leest op donker */

/* Achtergronden */
--color-bg:           #0A0E1A;  /* deep navy — hoofdachtergrond, bijna-zwart met blauwe ondertoon */
--color-surface:      #141B2E;  /* panelen/cards — net lichter, laat kaarten "zweven" */

/* Accent — highlights, succes, live data, energie-flow */
--color-accent:       #10F4A8;  /* energy mint — altijd mét glow, schaars inzetten */

/* Tekst */
--color-text:         #F1F5F9;  /* soft white — primaire tekst op donker, niet puur wit */
```

### Afgeleide tonen (bouw hierop voort, verzin geen losse kleuren)

```css
--color-text-muted:   #8A94A8;  /* secundair, labels, hints */
--color-border:       #232C42;  /* subtiele randen tussen surfaces */
--color-primary-soft: #3B82F61A; /* blauw 10% — glow, hover, focus-ring */
--color-accent-soft:  #10F4A81A; /* mint 10% — succes-achtergrond, flow-gloed */
--color-danger:       #F4556D;  /* alleen voor echte fouten/kosten — nooit decoratief */
```

### Regels

- **Mintgroen = stroom.** Gebruik het voor live data, opbrengst, energie-flow, succes. Niet voor gewone knoppen.
- **Blauw = actie.** Knoppen, links, het ding waar je op moet klikken.
- **Twee surface-lagen, niet meer.** `--color-bg` eronder, `--color-surface` voor kaarten. Diepte komt van schaduw en gloed, niet van tien grijstinten.
- **Rood is gereserveerd** voor fouten en kosten. Nooit als sfeerkleur.
- **Geen pure zwart (#000) of puur wit (#FFF).** Altijd de tinten hierboven.

---

## 4. Typografie

Sans-serief, technisch, hoge leesbaarheid op donker. Cijfers moeten knallen — dit is een data-app.

```css
--font-sans:    'Inter', -apple-system, system-ui, sans-serif;  /* UI + body */
--font-mono:    'JetBrains Mono', 'SF Mono', monospace;         /* cijfers, kWh, €, tijden */
```

- **Inter** voor alles wat tekst is. Strak, neutraal, schaalt goed.
- **Mono voor data.** Bedragen, kWh, percentages, tijdstippen in mono — geeft het die "meter/dashboard"-precisie en houdt cijfers uitgelijnd.
- **Grote, vette cijfers als helden.** De besparing van vandaag mag enorm zijn. De uitleg eronder klein en muted.
- Schaal: `12 / 14 / 16 / 20 / 28 / 40 / 64`. Hou je hieraan.

---

## 5. Referentie-merken

Wat we van elk meenemen — en wat expliciet **niet**.

### Tesla (Energy / Powerwall) → de live energie-flow
Het geanimeerde schema waar stroom letterlijk beweegt tussen zon, huis, accu en het net,
met stromende deeltjes/lijntjes. **Dit is het hero-stuk van GBICT Energy.** De huiseigenaar
ziet in één oogopslag waar energie heen gaat en wat het oplevert. Geen tabel — beweging.
> Meenemen: de flow-visualisatie. Niet: Tesla's koele, klinische leegte — wij zijn warmer in toon.

### Linear (linear.app) → premium, gelaagde diepte
Glasachtige panelen die zweven op bijna-zwart, met subtiele gloed en gradient-randen.
High-contrast, premium, gelaagd — nooit plat grijs.
> Meenemen: depth — schaduw, lichtval, lagen, gradient-borders. Niet: hun content of feature-set.

### Apple (productpagina's) → scroll-gestuurde 3D
Een 3D-object — bij ons: huis met zonnepanelen + thuisbatterij + laadpaal — dat draait en
zich onthult terwijl je scrollt. Elke scroll = een nieuw inzicht dat opbouwt. 3D met bedoeling, geen gimmick.
> Meenemen: scroll-driven reveal met betekenis. Niet: 3D om het 3D, of trage scroll-hijacking.

**Samen:** Tesla geeft de data-beleving, Linear de premium diepte, Apple de 3D-scroll.

---

## 6. Beweging & diepte

Animatie is hier geen versiering — het is de "energie" uit punt 2 gemaakt.

- **Flow leeft, UI is rustig.** De energie-flow beweegt continu (deeltjes/lijnen). De rest van de
  interface beweegt alleen op interactie: fade-in, soft scale, glow op hover.
- **Diepte via gloed, niet via dikke schaduw.** Kaarten krijgen een subtiele `--color-primary-soft`
  of `--color-accent-soft` gloed plus een lichte gradient-border. Linear-stijl, geen drop-shadow-blokken.
- **Snel en zacht.** Transities 150–250ms, `ease-out`. Geen bounce, geen vertraagde scroll-hijack.
- **Mint pulseert bij live data.** Iets dat nú gebeurt (verkopen, laden, besparen) mag zacht ademen in mint.

---

## 7. Tone of voice

Nederlands. Direct. In euro's.

### Altijd
- **Direct en nuchter** — rechttoe-rechtaan, geen omhaal.
- **In euro's en concrete getallen** — besparing, opbrengst, terugverdientijd.
- **Techniek vertaald naar gewone taal** — leg het uit alsof je het je buurman vertelt.
- **Feitelijk en vertrouwenwekkend** — alleen claims die je kunt onderbouwen.
- **Persoonlijk (je/jij), maar volwassen** — niet kinderachtig.

### Nooit
- **Geen vakjargon zonder uitleg** — niet zomaar "dynamic load balancing" of "kWh-saldering" erin gooien.
- **Geen uitroeptekens of hype-taal.**
- **Geen vage duurzaamheidsclaims / greenwashing.**
- **Geen angstverkoop** — niet "netcongestie-ramp!" of "voor het te laat is".
- **Geen Engelse buzzwords** waar gewoon Nederlands kan.

### Voorbeeld
> ✅ "Je batterij kocht vannacht stroom voor €0,08 en verkocht 'm vanmiddag voor €0,31. Verschil: €4,20 vandaag."
> ❌ "Optimaliseer je energy-flow en unlock maximale ROI met dynamic load balancing!"

---

## 8. Snelle checklist (gebruik bij elk scherm)

- [ ] Donkere basis (`--color-bg`), kaarten op `--color-surface`, max twee lagen?
- [ ] Mintgroen alleen voor stroom/data/succes — niet voor gewone knoppen?
- [ ] Cijfers in mono, groot en als held?
- [ ] Beweegt de energie-flow, en is de rest rustig?
- [ ] Diepte via gloed + gradient-border, niet via grijstinten?
- [ ] Copy in euro's, geen jargon, geen uitroeptekens?
