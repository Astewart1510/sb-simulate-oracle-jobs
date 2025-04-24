import axios from 'axios'

type Mode =
  | 'consensus_local'
  | 'baseline_local'
  | 'consensus_main'
  | 'baseline_main'
  | 'consensus_devnet'
  | 'baseline_devnet'

// 1) Parse flags from process.argv
interface Args { mode?: string; url?: string; duration?: string }
const raw = process.argv.slice(2)
const args: Args = {}
for (let i = 0; i < raw.length; i++) {
  const a = raw[i]
  if (a.startsWith('--')) {
    const key = a.slice(2) as keyof Args
    const next = raw[i+1]
    if (next && !next.startsWith('--')) {
      args[key] = next
      i++
    } else {
      args[key] = 'true'
    }
  }
}

// 2) Configure endpoints & defaults
const ENDPOINTS: Record<Mode, string> = {
  consensus_local:  'http://127.0.0.1:8082/gateway/api/v1/fetch_signatures_consensus',
  baseline_local:   'http://127.0.0.1:8082/gateway/api/v1/fetch_signatures',
  consensus_main:   'https://92.222.100.184.xip.switchboard-oracles.xyz/mainnet/gateway/api/v1/fetch_signatures_consensus',
  baseline_main:    'https://92.222.100.184.xip.switchboard-oracles.xyz/mainnet/gateway/api/v1/fetch_signatures',
  consensus_devnet: 'https://92.222.100.184.xip.switchboard-oracles.xyz/devnet/gateway/api/v1/fetch_signatures_consensus',
  baseline_devnet:  'https://92.222.100.184.xip.switchboard-oracles.xyz/devnet/gateway/api/v1/fetch_signatures',
}

const mode       = (args.mode as Mode) || 'consensus_local'
const url        = args.url || ENDPOINTS[mode]
const durationSec = parseFloat(args.duration || '25')

if (!ENDPOINTS[mode] && !args.url) {
  console.error(`Invalid mode "${mode}". Valid modes: ${Object.keys(ENDPOINTS).join(', ')}`)
  process.exit(1)
}
if (isNaN(durationSec) || durationSec <= 0) {
  console.error(`Invalid duration "${args.duration}"`)
  process.exit(1)
}

console.log(`→ mode: ${mode}`)
console.log(`→ url:  ${url}`)
console.log(`→ duration: ${durationSec}s`)

// 3) Define jobs and both payloads
const jobs = [
  // binance USDTBTC job
  'WAovCi0KK2h0dHBzOi8vd3d3LmJpbmFuY2UuY29tL2FwaS92My90aWNrZXIvcHJpY2UKJRIjCiEkWz8oQC5zeW1ib2wgPT0gJ0JUQ1VTRFQnKV0ucHJpY2U=',
  'DQoLYgkJAAAAAADklEA=', //value task 1337
]
console.log(`→ jobs: ${jobs.join(', ')}`)

const consensusPayload = {
  api_version:     '1.0',
  recent_hash:     '7x7cZmP1CiNyQh78UV89E7VwHk6P4J3t3nY8xK9AbCDE',
  signature_scheme:'Secp256k1',
  hash_scheme:     'Sha256',
  feed_requests: [
    { jobs_b64_encoded: [jobs[0]], max_variance: 1, min_responses: 1 },
    { jobs_b64_encoded: [jobs[1]], max_variance: 5, min_responses: 1 },
  ],
  num_oracles:     1,
  use_timestamp:   true as const,
}

const baselinePayload = {
  api_version:     '1.0',
  jobs_b64_encoded: jobs,
  recent_chainhash:'7x7cZmP1CiNyQh78UV89E7VwHk6P4J3t3nY8xK9AbCDE',
  signature_scheme:'Secp256k1',
  hash_scheme:     'Sha256',
  num_oracles:     1,
  max_variance:    1,
  min_responses:   1,
  use_timestamp:   true as const,
}

// 4) Choose payload by mode prefix
const payload = mode.startsWith('baseline')
  ? baselinePayload
  : consensusPayload

console.log('→ payload:', JSON.stringify(payload, null, 2))

// 5) Run loop
async function runForDuration(seconds: number) {
  const start = Date.now()
  const end   = start + seconds * 1000
  let count = 0

  while (Date.now() < end) {
    const roundStart = Date.now()
    try {
      await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      })
      const lat = Date.now() - roundStart
      const elapsed = ((Date.now() - start) / 1000).toFixed(1)
      console.log(`[${++count}] ✅ ${lat}ms (+${elapsed}s)`)
    } catch (e: any) {
      const lat = Date.now() - roundStart
      const elapsed = ((Date.now() - start) / 1000).toFixed(1)
      console.error(`[${++count}] ❌ ${lat}ms (+${elapsed}s):`, e.response?.data || e.message)
    }
    await new Promise(r => setTimeout(r, 1000))
  }
}

runForDuration(durationSec)
