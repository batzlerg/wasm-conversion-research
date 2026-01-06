# Cloudflare Workers Deployment Learnings

**Date:** 2026-01-06
**First deployment:** minify-edge
**Goal:** Document findings for automation skill creation

---

## Setup (One-Time)

### 1. Install Wrangler
```bash
bun install -g wrangler
```

**Version used:** 4.54.0

### 2. Authenticate
```bash
wrangler login
```

**What happens:**
- Opens browser OAuth flow
- Grants permissions: account:read, user:read, workers:write, workers_kv:write, workers_routes:write, workers_scripts:write, workers_tail:read, d1:write, pages:write, zone:read, ssl_certs:write, ai:write, queues:write, pipelines:write, secrets_store:write, containers:write, cloudchamber:write, connectivity:admin, offline_access
- Stores token in `~/.wrangler/config/default.toml`

**Check auth status:**
```bash
wrangler whoami
```

### 3. Register workers.dev Subdomain (One-Time)

**First deployment error:**
```
You need to register a workers.dev subdomain before publishing to workers.dev
```

**Solution:** Visit onboarding URL provided in error message:
```
https://dash.cloudflare.com/{account-id}/workers/onboarding
```

Choose subdomain (e.g., `graham.workers.dev`)

**Note:** This is a one-time account-level setup, not per-worker.

---

## Deployment Issues & Solutions

### Issue #1: Node.js Built-in Modules

**Error:**
```
Build failed with 19 errors:
✘ Could not resolve "url"
✘ Could not resolve "path"
✘ Could not resolve "fs"
✘ Could not resolve "http"
✘ Could not resolve "https"

The package "url" wasn't found on the file system but is built into node.
- Add the "nodejs_compat" compatibility flag to your project.
```

**Root cause:**
`html-minifier-terser` dependency uses Node.js built-ins via `clean-css` sub-dependency:
- `fs` (file system)
- `path` (path manipulation)
- `url` (URL parsing)
- `http/https` (network requests)

**Solution:**
Add compatibility flag to `wrangler.jsonc`:

```jsonc
{
  "compatibility_flags": ["nodejs_compat"]
}
```

**Impact:**
- Enables Node.js polyfills in Workers runtime
- Required for most npm packages originally designed for Node.js
- No performance penalty observed

**Skill automation note:**
If deployment fails with "Could not resolve" + "built into node" error, automatically add `nodejs_compat` flag and retry.

---

## Build Metrics (minify-edge)

**Successful build output:**
```
Total Upload: 1609.48 KiB / gzip: 312.11 KiB
Worker Startup Time: 42 ms
Uploaded minify-edge (8.91 sec)
```

**Analysis:**
- **Raw size:** 1.6 MB (larger than expected due to html-minifier-terser + clean-css)
- **Compressed:** 312 KB (80.6% compression ratio)
- **Cold start:** 42 ms (acceptable for edge function)
- **Upload time:** 8.91s (includes bundling + network)

**Note:** Cloudflare Workers free tier limit is 1 MB per worker. minify-edge at 312 KB gzipped is well under limit.

---

## Pre-Deployment Checklist (for Skill)

### Required files:
- [ ] `wrangler.jsonc` or `wrangler.toml` exists
- [ ] `main` entry point specified
- [ ] `name` field specified
- [ ] `compatibility_date` set

### Required setup:
- [ ] `wrangler login` authenticated
- [ ] workers.dev subdomain registered (check via deploy attempt)

### Optional but recommended:
- [ ] Tests passing (`bun test`)
- [ ] `nodejs_compat` flag if using Node.js dependencies
- [ ] CORS headers configured if public API

### Pre-flight checks:
```bash
# 1. Check auth
wrangler whoami

# 2. Validate config
wrangler deploy --dry-run  # (if available)

# 3. Run tests
bun test

# 4. Check git status (optional - ensure clean or documented state)
git status
```

---

## Deployment Command

```bash
cd /path/to/worker
bun run deploy  # or: wrangler deploy
```

**Expected output on success:**
- Upload size metrics
- Worker startup time
- Deployment URL: `https://{worker-name}.{subdomain}.workers.dev/`

---

## Common Error Patterns

### Pattern: Missing Node.js built-ins
**Signature:** `Could not resolve "{module}" ... built into node`
**Solution:** Add `"compatibility_flags": ["nodejs_compat"]`

### Pattern: No workers.dev subdomain
**Signature:** `You need to register a workers.dev subdomain`
**Solution:** Visit onboarding URL (one-time account setup)

### Pattern: Authentication expired
**Signature:** `You are not authenticated`
**Solution:** Run `wrangler login`

### Pattern: SSL certificate not ready (first deployment)
**Signature:**
- `SSL: SSLV3_ALERT_HANDSHAKE_FAILURE`
- `SSL_ERROR_NO_CYPHER_OVERLAP`
- Occurs immediately after registering workers.dev subdomain

**Root cause:** SSL certificate provisioning and DNS propagation takes time

**Timeline observed:**
- Deploy completes: 22:45:07 UTC
- First test (22:46): SSL handshake failure
- SSL ready: ~60 seconds after deployment

**Solution:** Wait 1-2 minutes after first subdomain registration before testing

**Skill automation note:**
- After successful deployment to new subdomain, add 90-second wait
- Poll endpoint with exponential backoff (max 5 minutes)
- Success criteria: HTTP response (even if 405/400)

### Pattern: workers.dev route inactive (CRITICAL)
**Signature:**
- Deploy succeeds with upload metrics
- Accessing URL returns: `error code: 1042`
- Dashboard shows "No active routes" or route marked "Inactive"

**Root cause:** `workers_dev` option not explicitly set in wrangler.jsonc

**Even though documentation says `workers_dev` defaults to `true`, in practice the route remains inactive unless explicitly configured.**

**Solution:**
Add to wrangler.jsonc:
```jsonc
{
  "workers_dev": true
}
```

Then redeploy:
```bash
bun run deploy
```

**Success output:**
```
Deployed minify-edge triggers (0.79 sec)
  https://minify-edge.grahammakes.workers.dev
```

**Skill automation note:**
- ALWAYS include `"workers_dev": true` in generated wrangler.jsonc
- This is REQUIRED for workers.dev subdomain routing
- Check deployment output for URL confirmation
- If no URL shown, deployment succeeded but route is inactive

---

## First Deployment Success: minify-edge

**Date:** 2026-01-06
**Duration:** ~15 minutes (including troubleshooting)
**URL:** https://minify-edge.grahammakes.workers.dev/

### Issues Encountered & Resolved

1. **Node.js built-ins** → Added `nodejs_compat` flag ✅
2. **SSL not ready** → Waited 60 seconds ✅
3. **Route inactive** → Added `workers_dev: true` ✅

### Test Results

All features working correctly:

**Test 1: HTML minification**
```bash
curl -X POST https://minify-edge.grahammakes.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{"html": "<html>  <body>  <p>   Test   </p>  </body></html>"}'
```
Result: 49 bytes → 37 bytes (24.49% savings) ✅

**Test 2: Inline CSS minification**
```bash
curl -X POST https://minify-edge.grahammakes.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{"html": "<html><head><style>  body { margin: 0; padding: 0; }  </style></head><body><p>Test</p></body></html>"}'
```
Result: 100 bytes → 89 bytes (11% savings), CSS compressed ✅

**Test 3: Inline JS minification**
```bash
curl -X POST https://minify-edge.grahammakes.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{"html": "<html><head><script>  function test() { return 1 + 1; }  </script></head><body><p>Test</p></body></html>"}'
```
Result: 104 bytes → 92 bytes (11.54% savings), optimized `1 + 1` → `2` ✅

### Required wrangler.jsonc Configuration

**Minimal working config:**
```jsonc
{
  "name": "minify-edge",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-03",
  "compatibility_flags": ["nodejs_compat"],
  "workers_dev": true
}
```

**Key learnings:**
- `nodejs_compat` REQUIRED for npm packages using Node.js built-ins
- `workers_dev: true` REQUIRED for workers.dev routing (must be explicit)
- `compatibility_date` should be current date
- `observability.enabled: true` optional but recommended

---

## Deployment Summary

**Date:** 2026-01-06
**Workers Deployed:** 5/5
**Fully Functional:** 3/5 (minify-edge, webhook-edge, thumbhash-edge)
**Runtime Errors:** 2/5 (sanitize-edge, readable-edge)

### Deployed Workers

| Worker | URL | Status | Size | Tests |
|--------|-----|--------|------|-------|
| minify-edge | https://minify-edge.grahammakes.workers.dev/ | ✅ Working | 312 KB gzip | 4/4 |
| thumbhash-edge | https://thumbhash-edge.grahammakes.workers.dev/ | ✅ Working | 7.84 KB gzip | 4/5 |
| webhook-edge | https://webhook-edge.grahammakes.workers.dev/ | ✅ Working | 1.29 KB gzip | 11/11 |
| sanitize-edge | https://sanitize-edge.grahammakes.workers.dev/ | ⚠️ Runtime Error | 18.24 KB gzip | 25/26 |
| readable-edge | https://readable-edge.grahammakes.workers.dev/ | ⚠️ Runtime Error | 146 KB gzip | 8/9 |

### Runtime Errors (Need Investigation)

**sanitize-edge:** `import_isomorphic_dompurify.default.sanitize is not a function`
- Issue: DOMPurify import not compatible with Workers runtime
- Local tests pass (25/26)
- Deployed but non-functional

**readable-edge:** `document is not defined`
- Issue: linkedom DOM polyfill not initializing correctly in Workers
- Local tests pass (8/9)
- Deployed but non-functional

**Next Steps for Broken Workers:**
1. Investigate isomorphic-dompurify Workers compatibility
2. Test linkedom initialization in Workers environment
3. Consider alternative DOM polyfills or library replacements

---

## Deployment Checklist (Final)

### One-Time Setup
- [x] Install wrangler globally (`bun install -g wrangler`)
- [x] Authenticate (`wrangler login`)
- [x] Register workers.dev subdomain (grahammakes.workers.dev)

### Per-Worker Deployment
- [x] Add `"workers_dev": true` to wrangler.jsonc
- [x] Add `"compatibility_flags": ["nodejs_compat"]` if using Node.js built-ins
- [x] Run `bun run deploy`
- [x] Test endpoint with representative payloads
- [x] Document deployment URL and status

---

## Next Steps

- [x] Complete first deployment (minify-edge)
- [x] Test live endpoint
- [x] Deploy all workers (5/5 deployed)
- [x] Document deployment results
- [ ] Fix runtime errors in sanitize-edge and readable-edge
- [ ] Create deployment skill with learnings

---

## Deployment Skill Design (Draft)

### Inputs:
- Worker directory path
- Optional: custom domain (vs workers.dev)
- Optional: skip tests flag

### Process:
1. Validate wrangler.jsonc exists
2. Check authentication (`wrangler whoami`)
3. Run tests (unless skipped)
4. Attempt deployment
5. If fails with Node.js errors → add nodejs_compat → retry
6. If fails with subdomain error → prompt user + provide URL
7. Capture deployment URL
8. Run smoke tests against live endpoint
9. Report success/failure

### Outputs:
- Deployment URL
- Build metrics (size, startup time)
- Test results (if applicable)
