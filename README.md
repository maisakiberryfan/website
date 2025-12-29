# Berry Fansite

Unofficial fan website for VTuber Maisaki Berry (苺咲べりぃ). Pure frontend static site with API integration.

## Features

- **Multi-language**: Auto-detect browser language (zh/en/ja)
- **Song Database**: Searchable songlist with inline editing
- **Stream Archive**: Stream history with category filtering
- **Setlist Viewer**: Setlist data with fuzzy search
- **Analytics**: DuckDB-WASM powered in-browser SQL queries
- **Profile**: Debut countdown, outfit gallery

## Tech Stack

- **jQuery 3.7.1** - DOM manipulation
- **Bootstrap 5.3.3** - Dark theme UI
- **Tabulator 6.3.1** - Data tables with inline editing
- **Select2 4.1.0-rc.0** - Enhanced dropdowns with IME support
- **dayjs** - Date handling
- **marked.js** - Markdown rendering
- **DuckDB-WASM** - In-browser SQL engine

## Pages

- `/` - Home (latest video + updates)
- `/profile` - Profile with debut countdown
- `/history` - Timeline
- `/clothes` - Outfit gallery
- `/songlist` - Song database
- `/streamlist` - Stream archive
- `/setlist` - Setlist data
- `/analytics` - Data analysis

## Development

### Build
```bash
npm install
npm run build        # Build Tabulator CSS + JS bundle
```

### Dev Server
```bash
npm run dev          # Wrangler Pages dev (Port 8788)
```

### Scripts
- `npm run clean` - Clean dist folder
- `npm run build:tabulator` - Build custom Tabulator CSS
- `npm run build:js` - Bundle JS with esbuild

## API Integration

Configured in `config.js`:
- **Hyperdrive API**: Database operations
- **Worker API**: GitHub proxy, setlist parsing

Environment auto-detection:
- localhost → local dev servers
- production → Cloudflare Workers

## Deployment

Static site, deployable to:
- Firebase Hosting (configured)
- Cloudflare Pages
- Any static host

## License

This is an unofficial fan project. All rights to the original content belong to their respective owners.
