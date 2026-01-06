# webhook-edge

**Type:** Pipeline Service (Edge)
**Status:** Spec
**Viability:** ⭐⭐⭐

---

## One-Liner

Webhook validation, deduplication, and routing at the edge—verify signatures, validate schemas, dedupe, all before hitting your origin.

## Problem

Receiving webhooks from services (Stripe, GitHub, Shopify) requires:
1. Signature verification (security)
2. Schema validation (data integrity)
3. Deduplication (services retry, causing duplicates)
4. Sanitization (if HTML content in payload)

Developers implement this repeatedly. It's tedious, error-prone, and adds latency if done at origin.

## Solution

Webhook processing pipeline at edge:
```javascript
POST /webhook
Headers: X-Signature, X-Timestamp
Body: { webhook payload }

→ Validates signature
→ Checks schema
→ Detects duplicates via content hash
→ Sanitizes HTML if present
→ Returns validated + metadata or forwards to origin
```

## Modules Used

### WASM modules:
- [ammonia](../EDGE_PROSPECTS.md#ammonia) (~200KB) — HTML sanitization
- [xxHash](../ACTIVE_PROSPECTS.md#xxhash) (29KB) — Deduplication hashing

### Needs research (may be JS):
- **jose** — JWT/signature verification (JS library works in Workers)
- **jsonschema** — Schema validation (Rust crate exists, or use Ajv in JS)

## Target Users

- SaaS products receiving webhooks from Stripe, Shopify, GitHub
- Platform developers building webhook infrastructure
- Agencies managing multiple webhook integrations for clients
- Developers tired of implementing webhook validation repeatedly

## User Flow

**Developer integration:**
```javascript
// Configure webhook-edge
const config = {
  provider: 'stripe',
  secret: process.env.STRIPE_WEBHOOK_SECRET,
  schema: stripePaymentSucceededSchema
};

// webhook-edge handles validation, you handle business logic
app.post('/webhook', async (req) => {
  // webhook-edge already validated before this runs
  const { event, duplicate } = req.validated;

  if (duplicate) return { ok: true }; // Already processed

  await processPayment(event);
  return { ok: true };
});
```

## Core Features

- **Signature verification** — Stripe, GitHub, Shopify, custom HMAC
- **Schema validation** — Reject malformed webhooks early
- **Deduplication** — Content-hash based duplicate detection
- **HTML sanitization** — If webhook contains user content
- **Replay protection** — Timestamp validation
- **Provider presets** — Pre-configured for common services
- **Forwarding rules** — Route to different origins based on event type

## Competitive Landscape

| Solution | Pricing | Gap |
|----------|---------|-----|
| Hookdeck | $15-75/mo | SaaS, vendor lock-in |
| Svix | $25/mo | SaaS, vendor lock-in |
| Zapier webhooks | $20/mo | Limited transformations |
| DIY | Dev time | 8-20 hours per integration |

## Novel Angle

Webhook services exist but they're SaaS with vendor lock-in. webhook-edge is self-hostable infrastructure-as-code. Deploy once to your Cloudflare account, configure per provider, no monthly SaaS fee.

## Revenue Model

**Pay-per-use or open source:**
- Free: 10k webhooks/month
- Pay-as-you-go: $0.20/1k webhooks
- Pro ($12/mo): 100k webhooks

**Alternative:** Free (OSS) with deployment templates for common providers (Stripe, GitHub, Shopify)

**Consideration:** Webhook volume is often bursty. Pay-per-use fits better than monthly.

## Build Complexity

**Medium-High** — Estimated 50-70 hours

**Breakdown:**
- Signature verification (multiple providers) — 15 hours
- Schema validation — 8 hours
- Deduplication system — 8 hours
- Provider preset configs — 12 hours
- Routing logic — 8 hours
- Documentation (per-provider guides) — 12 hours
- Testing with real webhooks — 10 hours

## Success Metrics

### If Free (OSS)
- 200 GitHub stars
- 50 deployments
- Provider templates for 10 services

### If Paid
- 30 paying users ($360 MRR)

## Next Steps

- [ ] Research: Does jose work in Cloudflare Workers?
- [ ] Research: jsonschema WASM or use Ajv?
- [ ] Build Stripe webhook validation only (proof of concept)
- [ ] Test signature verification accuracy
- [ ] Add deduplication
- [ ] Create templates for top 5 providers
- [ ] Launch as OSS with self-host guide

---

**Last updated:** January 2026
