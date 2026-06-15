// SMA Sunny Portal — real API requires OAuth2 + plant credentials
// For MVP: implement interface with proper types, stub the actual calls
// Zie: https://developer.sma.de for OAuth2 documentatie

export type SmaCredentials = {
  email: string
  password: string
}

export type SmaPlant = {
  plantId: string
  name: string
}

export type SmaProduction = {
  currentWatts: number
  todayKwh: number
}

export async function testSmaCredentials(
  _email: string,
  _password: string
): Promise<{ ok: boolean; plantName?: string; error?: string }> {
  // SMA heeft geen open API: toegang vereist een getekend API-contract met SMA
  // (client_id/secret via api-developer-support@sma.de) en verloopt daarna via
  // een OAuth2 'Connect with SMA'-flow — niet via e-mail/wachtwoord.
  return {
    ok: false,
    error: 'SMA-koppeling verloopt via een partnerkoppeling met SMA. Neem contact op — we zetten je op de wachtlijst.',
  }
}

export async function getSmaProduction(
  _email: string,
  _password: string
): Promise<SmaProduction | null> {
  return null
}
