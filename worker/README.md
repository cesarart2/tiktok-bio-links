# go-click-logger

Cloudflare Worker that logs every `/go/*` click (slug, `?src=`, referrer, user-agent) to a
Workers Analytics Engine dataset (`go_clicks`), then passes the request through to GitHub
Pages unchanged — the static page still performs the redirect, so the Worker can never
break a link.

## Deploy (one-time)

```bash
cd worker
npx wrangler login        # interactive — opens the browser, needs the Cloudflare account
npx wrangler deploy
```

## Query clicks

```bash
# last 7 days, clicks per slug/src (needs an API token with Account Analytics read)
curl -s "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine/sql" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -d "SELECT blob1 AS slug, blob2 AS src, SUM(_sample_interval) AS clicks
      FROM go_clicks WHERE timestamp > NOW() - INTERVAL '7' DAY
      GROUP BY slug, src ORDER BY clicks DESC"
```

Referrer is `blob3`, user-agent `blob4` (filter obvious bots at query time).
