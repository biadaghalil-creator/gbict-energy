// E-mail via Resend — https://resend.com
// Vereist: RESEND_API_KEY in env vars

import { Resend } from 'resend'

const FROM = 'GBICT Energy <noreply@gbict.nl>'

function getResend() {
  const resend = getResend()
  if (!resend) return null
  return new Resend(process.env.RESEND_API_KEY)
}

// ── Dagelijkse samenvatting ──────────────────────────────────────────────────

export async function sendDailySummary({
  to,
  savingsToday,
  savingsMonth,
  chargeCount,
  dischargeCount,
  nextCheapHour,
}: {
  to: string
  savingsToday: number
  savingsMonth: number
  chargeCount: number
  dischargeCount: number
  nextCheapHour?: number
}) {
  const resend = getResend()
  if (!resend) return

  const fmt = (n: number) => `€${n.toFixed(2).replace('.', ',')}`
  const nextHourText = nextCheapHour !== undefined
    ? `<p style="margin:0 0 8px">⚡ <strong>Goedkoop moment morgen:</strong> ${String(nextCheapHour).padStart(2, '0')}:00 uur</p>`
    : ''

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Jouw besparing vandaag: ${fmt(savingsToday)} ⚡`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;margin:0;padding:20px;">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
    <div style="background:#10b981;padding:24px 28px;">
      <p style="margin:0;font-size:13px;font-weight:600;color:rgba(255,255,255,.8);letter-spacing:.08em;text-transform:uppercase">GBICT Energy</p>
      <p style="margin:8px 0 0;font-size:24px;font-weight:700;color:white">Dagelijkse update</p>
    </div>
    <div style="padding:28px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
        <div style="background:#f0fdf4;border-radius:12px;padding:16px;">
          <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600">Vandaag bespaard</p>
          <p style="margin:6px 0 0;font-size:28px;font-weight:700;color:#10b981">${fmt(savingsToday)}</p>
        </div>
        <div style="background:#f9fafb;border-radius:12px;padding:16px;">
          <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600">Deze maand</p>
          <p style="margin:6px 0 0;font-size:28px;font-weight:700;color:#111827">${fmt(savingsMonth)}</p>
        </div>
      </div>
      <div style="border:1px solid #f3f4f6;border-radius:12px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 8px;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase">Acties vandaag</p>
        <p style="margin:0 0 6px"><span style="color:#10b981">↑</span> ${chargeCount}× opgeladen</p>
        <p style="margin:0"><span style="color:#f97316">↓</span> ${dischargeCount}× ontladen</p>
        ${nextHourText}
      </div>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/besparingen" style="display:block;text-align:center;background:#10b981;color:white;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600;font-size:14px">
        Bekijk je besparingen →
      </a>
    </div>
    <div style="background:#f9fafb;padding:16px 28px;border-top:1px solid #f3f4f6">
      <p style="margin:0;font-size:12px;color:#9ca3af">Je ontvangt deze e-mail omdat je een GBICT Energy account hebt. <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/instellingen" style="color:#10b981">Uitschrijven</a></p>
    </div>
  </div>
</body>
</html>`,
  })
}

// ── Goedkope uren alert ──────────────────────────────────────────────────────

export async function sendCheapHourAlert({
  to,
  hours,
  minPrice,
}: {
  to: string
  hours: number[]
  minPrice: number
}) {
  const resend = getResend()
  if (!resend) return
  if (!hours.length) return

  const hoursText = hours.map(h => `${String(h).padStart(2, '0')}:00`).join(', ')

  await resend.emails.send({
    from: FROM,
    to,
    subject: `⚡ Goedkope uren vandaag: ${hoursText}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;margin:0;padding:20px;">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,.1)">
    <div style="font-size:40px;text-align:center;margin-bottom:16px">⚡</div>
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;text-align:center">Goedkope uren aankomen</h2>
    <p style="margin:0 0 20px;color:#6b7280;text-align:center">Je batterij laadt automatisch op tijdens de goedkoopste uren van vandaag.</p>
    <div style="background:#f0fdf4;border-radius:12px;padding:16px;margin-bottom:20px;text-align:center">
      <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Goedkope uren vandaag</p>
      <p style="margin:0;font-size:24px;font-weight:700;color:#10b981">${hoursText}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#9ca3af">Laagste prijs: €${minPrice.toFixed(4)}/kWh</p>
    </div>
    <p style="margin:0 0 16px;font-size:13px;color:#6b7280;text-align:center">Je batterij wordt automatisch aangestuurd. Je hoeft niets te doen.</p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display:block;text-align:center;background:#10b981;color:white;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600;font-size:14px">
      Bekijk dashboard →
    </a>
  </div>
</body>
</html>`,
  })
}
