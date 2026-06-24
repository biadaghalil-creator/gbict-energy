// Victron VRM cloud MQTT — real ESS control (writing the setpoint).
// Spec: https://github.com/victronenergy/dbus-flashmq
//
// The VRM REST API is read-only for control; the cloud MQTT broker does allow
// WRITING to the ESS AC power setpoint. Requirement: the installation must
// allow "two-way communication / remote control" (VRM → installation →
// settings). Auth = VRM token, identical to the REST login.

import mqtt, { type MqttClient } from 'mqtt'

/**
 * Determine the correct broker host from the VRM portal ID:
 * sum of the char codes of the (lowercase) portal ID, modulo 128.
 */
export function vrmBrokerHost(portalId: string): string {
  let sum = 0
  for (const ch of portalId.toLowerCase().trim()) sum += ch.charCodeAt(0)
  return `mqtt${sum % 128}.victronenergy.com`
}

/**
 * Write the ESS AC power setpoint (in watts) via the VRM cloud MQTT broker.
 *   positive  = draw power from the grid (charge the battery)
 *   negative  = feed back / discharge
 * Auth: MQTT user = VRM email, password = `Token <vrm-token>`.
 *
 * Returns true on a successful publish, otherwise false. Never throws — the cron
 * must never break on this.
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
        reconnectPeriod: 0, // one-time publish — don't reconnect
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
