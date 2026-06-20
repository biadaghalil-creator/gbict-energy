// Victron VRM cloud MQTT — echte ESS-aansturing (setpoint schrijven).
// Spec: https://github.com/victronenergy/dbus-flashmq
//
// De VRM REST-API is read-only voor besturing; de cloud MQTT-broker laat wél
// naar de ESS AC-power setpoint SCHRIJVEN. Voorwaarde: de installatie moet
// "two-way communication / remote control" toestaan (VRM → installatie →
// instellingen). Auth = VRM-token, identiek aan de REST-login.

import mqtt, { type MqttClient } from 'mqtt'

/**
 * Bepaal de juiste broker-host uit de VRM portal-ID:
 * som van de char-codes van de (lowercase) portal-ID, modulo 128.
 */
export function vrmBrokerHost(portalId: string): string {
  let sum = 0
  for (const ch of portalId.toLowerCase().trim()) sum += ch.charCodeAt(0)
  return `mqtt${sum % 128}.victronenergy.com`
}

/**
 * Schrijf de ESS AC-power setpoint (in watt) via de VRM cloud MQTT-broker.
 *   positief  = vermogen uit het net halen (batterij laden)
 *   negatief  = terugleveren / ontladen
 * Auth: MQTT-user = VRM e-mail, wachtwoord = `Token <vrm-token>`.
 *
 * Geeft true bij een geslaagde publish, anders false. Gooit nooit — de cron
 * mag hier nooit op stuklopen.
 */
export async function setVictronSetpointViaMqtt(opts: {
  portalId: string
  email: string
  token: string
  watts: number
  timeoutMs?: number
}): Promise<boolean> {
  const { portalId, email, token, watts, timeoutMs = 12000 } = opts
  if (!portalId || !email || !token) return false

  const host = vrmBrokerHost(portalId)
  const topic = `W/${portalId}/hub4/0/AcPowerSetpoint`
  const payload = JSON.stringify({ value: Math.round(watts) })

  return new Promise<boolean>((resolve) => {
    let done = false
    let client: MqttClient | null = null
    const finish = (ok: boolean) => {
      if (done) return
      done = true
      try { client?.end(true) } catch { /* ignore */ }
      resolve(ok)
    }

    try {
      client = mqtt.connect(`mqtts://${host}:8883`, {
        username: email,
        password: `Token ${token}`,
        connectTimeout: timeoutMs,
        reconnectPeriod: 0, // éénmalige publish — niet opnieuw verbinden
        protocolVersion: 4,
      })
    } catch {
      return resolve(false)
    }

    const timer = setTimeout(() => finish(false), timeoutMs)

    client.on('connect', () => {
      client!.publish(topic, payload, { qos: 0 }, (err) => {
        clearTimeout(timer)
        finish(!err)
      })
    })
    client.on('error', () => { clearTimeout(timer); finish(false) })
  })
}
