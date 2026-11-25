#!/usr/bin/env node
// scripts/generate-nexus-key.js
//
// Mints a new Application Nexus Support API key for ailearnhub.io.
//
// Usage:
//   node scripts/generate-nexus-key.js staging "Nexus staging key"
//   node scripts/generate-nexus-key.js production "Nexus production key"
//
// Behavior:
//   - Always prints the plaintext key ONCE. Save it in a password manager —
//     it cannot be recovered afterwards, only revoked and reissued.
//   - If SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL are set in the
//     environment, it also registers the key's hash in nexus_api_keys for
//     you. Otherwise it prints the INSERT statement to run yourself in the
//     Supabase SQL editor.
//
// Per the integration spec (§2, §7): one key per app per environment,
// staging and production are separate keys, and a production key is only
// to be shared once the staging key has passed testing.

const crypto = require('crypto')

const [, , envArg, labelArg] = process.argv
const environment = (envArg || '').toLowerCase()

if (!['staging', 'production'].includes(environment)) {
  console.error('Usage: node scripts/generate-nexus-key.js <staging|production> "<label>"')
  process.exit(1)
}

const label = labelArg || `Nexus ${environment} key`

const KEY_BYTES = 32
const envTag = environment === 'production' ? 'live' : 'test'
const secret = crypto.randomBytes(KEY_BYTES).toString('base64url')
const plaintext = `nexus_${envTag}_${secret}`
const keyHash = crypto.createHash('sha256').update(plaintext).digest('hex')
const keyPrefix = plaintext.slice(0, 16)

console.log('')
console.log('='.repeat(70))
console.log(`  Application Nexus Support API key — ${environment.toUpperCase()}`)
console.log('='.repeat(70))
console.log('')
console.log('  Plaintext key (copy this now — shown only once):')
console.log('')
console.log(`    ${plaintext}`)
console.log('')
console.log('  Hand this to the Nexus team via a password manager or secrets')
console.log('  tool only — never by email or chat (spec §7).')
console.log('')
console.log('  Send it as:  Authorization: Bearer ' + plaintext)
console.log('')

async function registerInSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return false

  const res = await fetch(`${url}/rest/v1/nexus_api_keys`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      label,
      key_prefix: keyPrefix,
      key_hash: keyHash,
      environment,
      scopes: ['support'],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`  Could not auto-register the key (HTTP ${res.status}): ${body}`)
    return false
  }

  console.log('  ✅ Registered in nexus_api_keys for this Supabase project.')
  return true
}

registerInSupabase().then((registered) => {
  if (!registered) {
    console.log('  SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not set —')
    console.log('  run this SQL in the Supabase SQL Editor instead:')
    console.log('')
    console.log('  INSERT INTO nexus_api_keys (label, key_prefix, key_hash, environment, scopes)')
    console.log(`  VALUES ('${label}', '${keyPrefix}', '${keyHash}', '${environment}', '{support}');`)
    console.log('')
  }
  console.log('='.repeat(70))
  console.log('')
})