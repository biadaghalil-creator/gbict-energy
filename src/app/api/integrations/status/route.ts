import { NextResponse } from 'next/server'
import { enodeConfigured } from '@/lib/enode'
import { enphaseConfigured } from '@/lib/enphase'

export const runtime = 'nodejs'

// Vertelt de app welke OAuth-koppelingen daadwerkelijk geconfigureerd zijn,
// zodat de app niet naar een koppelpagina stuurt die toch niet werkt.
export async function GET() {
  return NextResponse.json({
    ev: enodeConfigured(),
    enphase: enphaseConfigured(),
  })
}
