# Block & Bull — website

A single-page site: socials hub, exchange offer cards, a community wins wall, and a feed grid that mirrors what gets posted on Instagram. Dark ink/gold brand, Archivo + Space Grotesk dual-font system, gamified scroll (progress bar, section rail nav, count-up stats, tilt cards, candlestick hero motion, cursor-reactive glow, parallax orbs, magnetic buttons, preloader).

## What changed in the redesign pass

- **Nav CTA → WEEX.** The top-right button now points to WEEX (`Trade on WEEX ↗`) per your instruction. Scoping note: I only changed the nav button — the **Exchanges section still lists Bybit as the featured "Primary partner"** card, because that follows the site-wide priority rule (Bybit → Binance → WEEX → Blofin) used across every other piece of content. If you want WEEX promoted to primary everywhere, not just the nav button, tell me and I'll update the Exchanges section and the underlying content-pillar rule too.
- **Live price ticker.** The old ticker was decorative text (BTC/ETH symbols, no real numbers). It's now a real embedded CoinGecko widget (`gecko-coin-ticker-widget`, free, no API key) showing actual live prices. Needs internet + real hosting to render (same `file://` limitation as the feed grid below) — falls back to a plain-text notice if it can't load.
- **Motion.** Preloader on first load, cursor-reactive gold glow behind the hero, parallax on the hero orbs and chart card while scrolling, magnetic pull on primary CTA buttons, reveal-on-scroll (already existed, kept).
- **New sections:**
  - **Start Here** (3-step onboarding: pick exchange → fund & verify → follow the desk) — the thing most crypto-influencer sites have and this one was missing.
  - **FAQ** (5 straight-answer Q&As on advice/referral-links/which-exchange/posting-cadence/guarantees) — restates existing disclosures in a format people actually read, and doubles as a trust signal.
- **Sticky mobile bar.** On phones, a small "Ready to trade? See offers ↓" bar slides up once you scroll past the hero (hides again near the footer so it doesn't cover the disclosure).
- **Exchange cards** now show a one-line "Best for" tag per exchange (derived from the existing feature bullets, nothing new invented) for faster scanning.

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole site — one file, no build step |
| `assets/brand/` | Logo files copied from `brand/` |
| `assets/feed/` | Post images synced from the content pipeline |
| `data/instagram-feed.json` | The feed manifest `index.html` reads |
| `tools/sync_instagram_feed.py` | Regenerates the manifest + copies images |

## Viewing it

Opening `index.html` directly (double-click) works for everything except the feed grid — browsers block `fetch()` of local JSON files over `file://` for security reasons. Two ways around that:

**Quick local preview:**
```
cd website
python3 -m http.server 8000
```
then open `http://localhost:8000`.

**Real hosting** (pick one, all free for a static site like this):
- **Netlify / Vercel** — drag the `website` folder into their dashboard, or connect a GitHub repo. Done in under 5 minutes, gives you a live URL and free HTTPS.
- **GitHub Pages** — push `website/` to a repo, enable Pages in settings.
- **Cloudflare Pages** — same idea, also free.

Once hosted, point `blocknbull.xyz` (or whatever domain you register) at it with a CNAME record from your registrar.

## The Instagram sync mechanism

You asked for "whatever I post on Instagram shows up on the site." There are two ways to do that — I built one of them now, and documented the other for when you're ready.

### Option A — sync from the content pipeline (already working)

Every Daily Block, Smart Money, Culture, or Weekly Read post already gets written to `outputs/daily/<date>/` or `outputs/pillars/<pillar>/<slug>/` with its Instagram caption and images, before you ever post it. `tools/sync_instagram_feed.py` scans those folders, pulls the caption + lead image from each, copies the image into `assets/feed/`, and writes `data/instagram-feed.json`. The site reads that file and renders the grid.

Run it any time after new content is generated:
```
cd website/tools
python3 sync_instagram_feed.py
```

It already ran once — the feed section is currently showing your 5 most recent real posts (Aug 1 daily block, the Weekly Read, Chart School, Myth Busted, and the CLARITY Act daily block).

**To automate this fully:** ask me to add a final step to the P1/P2/P3/P4/P5 scheduled tasks that runs this script after each content run. Every time a pillar fires, the site updates itself — no Instagram API needed, because the content already exists locally before it's posted.

The one manual gap: this mirrors what *we generate*, not what's literally live on the Instagram grid (e.g., if you edit a caption before posting, or post something outside this pipeline, this won't see it). For a handful of days that gap won't matter; if you want a byte-for-byte mirror of the real account, see Option B.

### Option B — pull directly from the live Instagram account (needs your setup)

This requires Meta's own OAuth flow, which only the account owner can complete — I can't do this from here. Roughly:

1. Convert the @blocknbull account to an **Instagram Business or Creator account** (Instagram app → Settings → Account type).
2. Link it to a **Facebook Page** (required even though you're not using the Page itself).
3. Create an app at **developers.facebook.com**, add the **Instagram Graph API** product.
4. Generate a **long-lived access token** scoped to `instagram_basic` and `pages_show_list`.
5. Call `GET /{ig-user-id}/media?fields=caption,media_url,permalink,timestamp&access_token=...` to pull real posts.
6. Either run that call from a small serverless function (Netlify/Vercel function, or a scheduled GitHub Action) that writes the same `instagram-feed.json` shape Option A produces, or swap `index.html`'s fetch URL to call the API directly (not recommended — it would expose your access token in the browser).

Because both options feed the site the same JSON shape, you can start with Option A today and swap in Option B later without touching `index.html` at all.

**Faster no-code alternative to Option B:** embed widgets like **SnapWidget**, **Elfsight**, or **Behold.so** connect to Instagram's API on your behalf (they handle the OAuth) and give you a `<script>` embed tag. Drop that into a new `<section>` if you'd rather not build the API integration yourself — lower effort, small monthly fee on most of them past a free tier.

## Adding real PnL screenshots to the Wins wall

The wall currently shows 6 empty placeholder slots — deliberately. I didn't fabricate fake trade screenshots or invented profit numbers; that would be both dishonest and a compliance risk (SEBI/ASCI rules on financial results claims are strict, and a fake "win" is a fake win).

To add real ones:
1. Save your screenshots into `assets/wins/` (create the folder).
2. In `index.html`, find the `winsGrid` JS block (`for(let i=1;i<=6;i++)`) and replace it with real `<img>` cards — happy to do this for you the moment you share the screenshots, or you can swap the placeholder `<div class="win-slot">` markup for `<img src="assets/wins/win1.png">` directly.
3. Keep the disclaimer banner underneath — it's there to keep the section compliant, not decorative. Don't remove it.

## Updating exchange offers

The bonus amounts in the Exchanges section (`$30,000`, `30,000 USDT`, etc.) are the same figures used across all your social content. Exchange promos change — the P6 scheduled task already re-checks these monthly. When it flags an update, edit the `.ex-offer` text in `index.html` to match.

## Brand rules this site follows

- Logo: only `assets/brand/icon-dark.png`, never redrawn — same rule as every other Block & Bull asset.
- Colors/fonts: Ink/Panel/Gold palette and Archivo + Space Grotesk, matching `brand/BRAND_GUIDE.md`.
- Every section touching money carries a disclosure or disclaimer. Don't ship a version that removes them.
