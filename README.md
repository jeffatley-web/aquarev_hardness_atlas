# Hotel Water Hardness Atlas — Deployment

New single page on **aquarevwater.us** (Webflow). Same split-deploy pattern as
the Data page: CSS + JS hosted on GitHub Pages, short embed pasted into Webflow.
Dark theme, self-contained: the block paints its own background and every style
is scoped to `#hwa`, so Webflow's global styles do not reach it.

## Files

| File | Role |
|---|---|
| `hardness-atlas.css` | Hosted on GitHub Pages. All styles, dark palette tokens on `#hwa`. |
| `hardness-atlas.js` | Hosted on GitHub Pages. Holds the 82-market dataset and renders key, filters, map, table, footer. |
| `webflow-embed-hardness-atlas.html` | Paste into the Webflow Embed element (about 1.9K chars). |

The map geometry comes from `datamaps.world.min.js` on cdnjs; d3 v7 and
topojson-client v3 also load from cdnjs. Nothing else is fetched at runtime.

## One-time GitHub Pages setup

1. Create a public repo: `jeffatley-web/aquarev_hardness_atlas`
2. Push `hardness-atlas.css` and `hardness-atlas.js` to the repo root.
3. Repo → Settings → Pages → Source: `main` branch, root.
4. Verify the URLs resolve:
   - https://jeffatley-web.github.io/aquarev_hardness_atlas/hardness-atlas.css
   - https://jeffatley-web.github.io/aquarev_hardness_atlas/hardness-atlas.js
5. In Webflow, add a new page (suggested slug `/water-hardness`), drop an
   Embed element into a full-width section, paste the contents of
   `webflow-embed-hardness-atlas.html`, publish.

If you host the files somewhere other than that repo, change the two
`jeffatley-web.github.io/aquarev_hardness_atlas/` URLs in the embed.

## Webflow page notes

- Give the section a dark background (`#111A21` matches the block) or let
  the block sit on its own; it paints itself either way.
- If the site has a fixed nav, add this to the page's custom code head so
  the table header sticks below it rather than under it:
  `<style>#hwa{--hwa-sticky-top:72px}</style>` (use the nav's real height).
- Fonts (Bitter, Public Sans, JetBrains Mono) load from Google Fonts via the
  first `<link>` in the embed. If those families are already added in
  Webflow's font settings, that line can be removed.

## Update workflow

1. Edit the dataset or copy in `hardness-atlas.js`, or styles in
   `hardness-atlas.css`. There is no separate master HTML for this page.
2. Push the changed file(s) to the GitHub Pages repo.
3. Bump the `?v=` cache buster on the matching line in the embed and
   re-paste it into Webflow if you want browsers to pick the change up
   immediately. If only CSS/JS changed and you can wait for caches, the
   push alone is enough.

The published Claude artifact version of the same page (with light and dark
themes) is at https://claude.ai/code/artifact/d733a2bd-0a50-44d3-84c6-7e47b3557018
and is the reference for any visual check.
