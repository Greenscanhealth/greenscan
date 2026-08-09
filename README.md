# GreenScan

GreenScan is a free ingredient safety scanner for food, drinks, beauty, and hair products.

The live app is available at:

https://www.greenscan.us

## What GreenScan Does

- Scans UPC/EAN barcodes.
- Checks open product databases first.
- Reviews ingredients, nutrition, positives, and potential concerns.
- Supports food, drink, beauty, and hair products.
- Uses AI only when a product or ingredient label needs extra analysis.
- Loads the app shell offline and can show products already saved on the device.
- Queues new label/photo submissions offline and syncs them when internet returns.

## Offline Behavior

GreenScan is designed to stay useful when a phone temporarily loses internet:

- Products already saved on the device can still be opened.
- New front-label photos, ingredient photos, pasted ingredients, and Nutrition Facts can be saved to a small local queue.
- When the device comes back online and GreenScan is opened, queued items are sent for analysis.
- Queue entries are deduplicated by barcode, product type, label text, and image fingerprint so the same item is not submitted repeatedly.
- New AI analysis still requires internet and a configured AI provider/API key.

## Self-Hosting and API Keys

This repository does not include GreenScan production secrets, API keys, credits, or free-trial usage.

If you clone or deploy your own copy, you must provide your own:

- Cloudflare account and Worker/KV configuration.
- OpenAI or other AI provider API key.
- Helper service configuration, if you use OCR/image compression helpers.
- Google OAuth credentials, if you enable sign-in.
- Usage limits, billing controls, and secret storage.

Do not commit real API keys or tokens to this repository.

## Main Files

- `app/` - static PWA frontend.
- `cloudflare-worker.js` - Cloudflare Worker API backend.
- `wrangler.toml` - frontend Worker/assets deploy config.
- `wrangler-clearscan-api.toml` - API Worker deploy config.

## Deployment

Deploy only from an authenticated Cloudflare environment:

```powershell
cd C:\greenscan-production-project
.\deploy-greenscan.cmd
```

For your own fork, update the Wrangler configs and secrets for your own Cloudflare account before deploying.
