# Leave Me Alone

Leave Me Alone is a Chrome-first browser extension that cuts down doomscroll bait on:

- Facebook Reels
- Facebook video surfaces
- Facebook Stories
- YouTube Shorts

The codebase is set up for Chrome first, with a Firefox build path kept ready in parallel.

## Development

Install dependencies and build the unpacked Chrome extension:

1. Run `npm install`
2. Run `npm run build:chrome`
3. Open `chrome://extensions`
4. Enable Developer mode
5. Load unpacked from [`dist/chrome`](/Users/jayson/Documents/projects/leavemealone/dist/chrome)

Useful commands:

- `npm run build:chrome` builds the Chrome extension into `dist/chrome`
- `npm run build:firefox` builds the Firefox-ready package into `dist/firefox`
- `npm run release:chrome` creates the Chrome Web Store upload zip in `artifacts/`
- `npm test` runs the test suite
- `npx tsc --noEmit` runs type-checking

## Store Submission

Chrome Web Store materials live here:

- public docs: [`docs/`](/Users/jayson/Documents/projects/leavemealone/docs)
- listing copy and reviewer notes: [`docs/chrome-web-store/`](/Users/jayson/Documents/projects/leavemealone/docs/chrome-web-store)
- store and extension icons: [`assets/`](/Users/jayson/Documents/projects/leavemealone/assets)

To prepare a release:

1. Run `npm test`
2. Run `npx tsc --noEmit`
3. Run `npm run release:chrome`
4. Upload the zip from [`artifacts/`](/Users/jayson/Documents/projects/leavemealone/artifacts)
