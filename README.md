# Visage B2B SDK

Lightweight, zero-dependency TypeScript SDK for the Visage B2B API. Verify AI likeness licenses, browse model rosters, track usage events, and integrate rights compliance into your pipeline.

## Installation

```bash
npm install visage-sdk
```

## Quick Start

### JavaScript / TypeScript

```ts
import { createVisageClient } from '@/sdk';

const visage = createVisageClient({
  apiKey: 'vsg_live_xxxxxxxxxxxxxxxx',
  // baseUrl: 'https://visagelabs.net/api' (default)
});
```

### Verify a License

```ts
const result = await visage.verifyLicense('VSG-A1B2-C3D4-E5F6');
console.log(result.status);          // "ACTIVE"
console.log(result.rights_summary);  // { media_types: [...], ... }
```

**Python (curl-equivalent):**

```python
import requests

resp = requests.get(
    "https://visagelabs.net/api/b2b-v1-verify-license",
    params={"license_key": "VSG-A1B2-C3D4-E5F6"},
    headers={"x-api-key": "vsg_live_xxxxxxxxxxxxxxxx"}
)
print(resp.json()["status"])
```

### Log a Usage Event

```ts
const event = await visage.logUsage({
  license_key: 'VSG-A1B2-C3D4-E5F6',
  platform_id: 'runway',
  event_type: 'generation',
  units: 1,
  asset_id: 'VA-550e8400-e29b-41d4-a716-446655440000',
  metadata: { campaign: 'Summer 2026' }
});
console.log(event.data.id); // event UUID
```

**Python:**

```python
resp = requests.post(
    "https://visagelabs.net/api/b2b-v1-usage-event",
    headers={"x-api-key": "vsg_live_xxxxxxxxxxxxxxxx"},
    json={
        "license_key": "VSG-A1B2-C3D4-E5F6",
        "platform_id": "runway",
        "event_type": "generation",
        "units": 1,
        "metadata": {"campaign": "Summer 2026"}
    }
)
```

### List Models

```ts
const { data, meta } = await visage.listModels({ limit: 10 });
console.log(`${meta.total} models available`);
```

### List Licenses

```ts
const { data } = await visage.listLicenses({ status: 'active' });
```

### List Deals

```ts
const { data } = await visage.listDeals({ status: 'completed', limit: 50 });
```

## Error Handling

```ts
import { VisageAuthError, VisageLicenseNotFoundError, VisageAPIError } from '@/sdk';

try {
  await visage.verifyLicense('VSG-INVALID-KEY');
} catch (err) {
  if (err instanceof VisageAuthError) {
    console.error('Bad API key:', err.message);     // 401
  } else if (err instanceof VisageLicenseNotFoundError) {
    console.error('Not found:', err.message);        // 404
  } else if (err instanceof VisageAPIError) {
    console.error(`API error ${err.statusCode}:`, err.message);
  }
}
```

## Request Tracing

All methods accept an optional `requestId` for tracing:

```ts
const result = await visage.verifyLicense('VSG-A1B2-C3D4-E5F6', 'trace-123');
```

## Authentication

All requests use the `x-api-key` header. Obtain your key from **Settings → API & Developer** in the Visage dashboard.

Key prefixes:
- `vsg_live_` — production
- `vsg_test_` — sandbox

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `verifyLicense(key)` | `GET /b2b-v1-verify-license` | Check license status and rights |
| `logUsage(params)` | `POST /b2b-v1-usage-event` | Record a usage event |
| `listModels(opts?)` | `GET /b2b-v1-models` | Browse available models |
| `listLicenses(opts?)` | `GET /b2b-v1-licenses` | List your licences |
| `listDeals(opts?)` | `GET /b2b-v1-deals` | List your deals |
