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
  // Stub: real SMA API requires OAuth2 flow + plant credentials
  return {
    ok: false,
    error: 'SMA koppeling komt binnenkort. Neem contact op voor vroege toegang.',
  }
}

export async function getSmaProduction(
  _email: string,
  _password: string
): Promise<SmaProduction | null> {
  return null
}
