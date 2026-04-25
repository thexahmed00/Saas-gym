const ZKLib = require('node-zklib')

const ZKTECO_IP   = process.env.ZKTECO_IP   || '192.168.1.201'
const ZKTECO_PORT = parseInt(process.env.ZKTECO_PORT || '4370', 10)
const RECONNECT_MS = 10_000
const SIM_DELAY_MS = 2200

let zk = null
let reconnectTimer = null
let _onScan = null

// ── Simulation (Mac dev or device unreachable) ────────────────────────────────

function runSimulation() {
  setTimeout(() => {
    if (!_onScan) return
    const roll = Math.random()
    if (roll < 0.65)      _onScan({ type: 'success',  fingerprintId: `SIM_${Date.now()}` })
    else if (roll < 0.80) _onScan({ type: 'denied',   fingerprintId: null })
    else                  _onScan({ type: 'notFound',  fingerprintId: null })
  }, SIM_DELAY_MS)
}

// ── ZKTeco TCP/IP connection ──────────────────────────────────────────────────

async function tryConnect() {
  try {
    zk = new ZKLib(ZKTECO_IP, ZKTECO_PORT, 10000, 4000)
    await zk.createSocket()
    await zk.connect()
    console.log(`[scanner] ZKTeco LX50 connected at ${ZKTECO_IP}:${ZKTECO_PORT}`)

    zk.getRealTimeLogs((log) => {
      if (!log?.UserID || !_onScan) return
      _onScan({ type: 'success', fingerprintId: String(log.UserID) })
    })
  } catch (err) {
    console.warn(`[scanner] ZKTeco unreachable (${err.message}), retrying in ${RECONNECT_MS / 1000}s`)
    zk = null
    reconnectTimer = setTimeout(tryConnect, RECONNECT_MS)
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

async function connectScanner(onScan) {
  _onScan = onScan
  await tryConnect()
}

// Called by renderer startScan() IPC.
// ZKTeco: no-op when connected (user scans at device).
// Fallback: runs simulation so Mac dev still works.
function triggerScan() {
  if (!zk) runSimulation()
}

async function disconnectScanner() {
  _onScan = null
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
  if (zk) {
    try { await zk.disconnect() } catch {}
    zk = null
  }
}

async function getDeviceUsers() {
  if (!zk) {
    // Dev fallback — simulated roster so sync modal works without hardware
    return [
      { uid: 1, userId: '1', name: 'Demo User 1' },
      { uid: 2, userId: '2', name: 'Demo User 2' },
    ]
  }
  const result = await zk.getUsers()
  return result.data ?? []
}

module.exports = { connectScanner, triggerScan, disconnectScanner, getDeviceUsers }
