# Leave Me Alone

Chrome-first browser extension that hides:

- Facebook Reels
- Facebook video surfaces
- Facebook Stories
- YouTube Shorts

## Chrome Web Store Readiness

This repo includes the materials needed to prepare a public Chrome Web Store submission for `Leave Me Alone`:

- a Chrome release zip flow
- GitHub-friendly markdown privacy and support docs in [`docs/`](/Users/jayson/Documents/projects/leavemealone/docs)
- Chrome Web Store listing copy and reviewer notes in [`docs/chrome-web-store/`](/Users/jayson/Documents/projects/leavemealone/docs/chrome-web-store)
- square extension icons in [`assets/icons/`](/Users/jayson/Documents/projects/leavemealone/assets/icons)

## Scripts

- `npm run build` builds the Chrome extension into `dist/chrome`
- `npm run build:chrome:release` builds a Chrome-ready runtime package without source maps
- `npm run build:firefox` builds the Firefox-ready package into `dist/firefox`
- `npm run release:chrome` creates a submission zip in `artifacts/`
- `npm test` runs the unit and DOM tests

## Load In Chrome

1. Run `npm install`
2. Run `npm run build`
3. Open `chrome://extensions`
4. Enable Developer mode
5. Load unpacked from `dist/chrome`

## Release For Chrome Web Store

1. Run `npm run release:chrome`
2. Upload the generated zip from [`artifacts/`](/Users/jayson/Documents/projects/leavemealone/artifacts)
3. Use the listing copy, privacy notes, and reviewer instructions from [`docs/chrome-web-store/`](/Users/jayson/Documents/projects/leavemealone/docs/chrome-web-store)
4. After the repo is public, use the GitHub URLs for [`docs/privacy-policy.md`](/Users/jayson/Documents/projects/leavemealone/docs/privacy-policy.md) and [`docs/support.md`](/Users/jayson/Documents/projects/leavemealone/docs/support.md) in the store dashboard

## Submission Checklist

- Run `npm test`
- Run `npx tsc --noEmit`
- Run `npm run release:chrome`
- Verify the popup loads with working icons and no broken assets
- Verify Facebook toggles off means no Facebook blocking activity
- Verify Facebook Stories collapses compactly when enabled
- Verify YouTube Shorts hiding still works on Home, Search, and Watch surfaces
- Fill out store listing, privacy fields, distribution, and reviewer notes using the docs in [`docs/chrome-web-store/`](/Users/jayson/Documents/projects/leavemealone/docs/chrome-web-store)
