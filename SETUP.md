# GBICT Energy — Setup Guide

## GitHub Actions Secrets instellen

Ga naar: **github.com/biadaghalil-creator/gbict-energy → Settings → Secrets and variables → Actions → New repository secret**

---

## 🌐 Web Deploy (Vercel)

| Secret naam | Waar vind je dit | Verplicht |
|---|---|---|
| `VERCEL_TOKEN` | vercel.com → Settings → Tokens → Create | ✅ |
| `VERCEL_ORG_ID` | In `.vercel/project.json` → `"orgId"` | ✅ |
| `VERCEL_PROJECT_ID` | In `.vercel/project.json` → `"projectId"` | ✅ |

> **Tip:** Open `.vercel/project.json` in VS Code om de org/project ID te kopiëren.

---

## 📱 iOS App Store Deploy

| Secret naam | Waar vind je dit | Verplicht |
|---|---|---|
| `APPLE_TEAM_ID` | developer.apple.com → Account → Membership → Team ID | ✅ |
| `APP_STORE_CONNECT_API_KEY_ID` | App Store Connect → Users → Integrations → Keys → Key ID | ✅ |
| `APP_STORE_CONNECT_ISSUER_ID` | App Store Connect → Users → Integrations → Keys → Issuer ID | ✅ |
| `APP_STORE_CONNECT_API_PRIVATE_KEY` | De .p8 key inhoud (kopieer alles inclusief BEGIN PRIVATE KEY) | ✅ |
| `APPLE_DISTRIBUTION_CERTIFICATE_P12` | Je Distribution Certificate als Base64 .p12 bestand | ✅ |
| `APPLE_DISTRIBUTION_CERTIFICATE_PASSWORD` | Wachtwoord van je .p12 certificaat | ✅ |

---

## Stap 1 — Vercel Secrets

1. Ga naar **vercel.com** → inloggen
2. Rechtsboven klik op je avatar → **Settings → Tokens**
3. Klik **Create** → naam: `github-actions` → kopieer de token
4. Voeg toe als `VERCEL_TOKEN` in GitHub Secrets

Open het bestand `.vercel/project.json` in VS Code:
```json
{
  "orgId": "← dit is VERCEL_ORG_ID",
  "projectId": "← dit is VERCEL_PROJECT_ID"
}
```

---

## Stap 2 — App Store Connect API Key aanmaken

1. Ga naar **appstoreconnect.apple.com**
2. Klik op **Users and Access** → **Integrations** → **App Store Connect API**
3. Klik **+** → naam: `GitHub Actions` → toegang: **App Manager**
4. Download de `.p8` key (kun je maar 1x downloaden!)
5. Noteer de **Key ID** en **Issuer ID**

Voeg toe als secrets:
- `APP_STORE_CONNECT_API_KEY_ID` = de Key ID (bijv. `ABC123DEF4`)
- `APP_STORE_CONNECT_ISSUER_ID` = de Issuer ID (bijv. `a1b2c3d4-...`)
- `APP_STORE_CONNECT_API_PRIVATE_KEY` = volledige inhoud van het `.p8` bestand

---

## Stap 3 — Apple Distribution Certificate exporteren als Base64

Open Terminal:

```bash
# Exporteer je Distribution Certificate als .p12 vanuit Keychain Access
# Geef het een wachtwoord (onthoud dit voor de secret)

# Dan converteer naar Base64:
base64 -i CertificateName.p12 | pbcopy

# Dit kopieert de Base64 string → plak als APPLE_DISTRIBUTION_CERTIFICATE_P12
```

---

## Stap 4 — Apple Team ID vinden

1. Ga naar **developer.apple.com/account**
2. Scroll naar **Membership details**
3. Kopieer **Team ID** (bijv. `ABC1234567`)
4. Voeg toe als `APPLE_TEAM_ID`

---

## Workflow overzicht

```
Push naar main branch
    │
    ├── deploy-web.yml
    │   ├── Type check (tsc)
    │   └── Deploy → Vercel production
    │
    └── deploy-ios.yml (alleen bij wijzigingen in ios/ of capacitor.config.ts)
        ├── Capacitor sync
        ├── Import certificate
        ├── Download provisioning profile
        ├── xcodebuild archive
        ├── Export .ipa
        └── Upload → App Store Connect
```

---

## App Store informatie (voor App Store Connect)

| Veld | Waarde |
|---|---|
| App naam | GBICT Energy |
| Bundle ID | nl.gbict.energy |
| Category | Utilities |
| Primary language | Dutch |
| SKU | gbict-energy-001 |
| Price | Free (subscription in-app) |

---

## Eerste keer iOS deployen

Voordat de GitHub Action werkt, moet je **eenmalig** in Xcode:

1. Open het project: `open ios/App/App.xcworkspace`
2. Selecteer **App** → **Signing & Capabilities**
3. Zet ✅ Automatically manage signing
4. Selecteer jouw Team
5. Maak een **App Store provisioning profile** aan via Xcode of developer.apple.com
6. Registreer de app in App Store Connect (naam + bundle ID)

Daarna doet GitHub Actions alles automatisch bij elke push.
