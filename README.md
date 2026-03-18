# Leave Me Alone

Leave Me Alone is an open-source browser extension that helps reduce doomscrolling by hiding high-distraction surfaces on Facebook and YouTube.

<img width="435" height="503" alt="Screenshot 2026-03-18 at 3 04 44 PM" src="https://github.com/user-attachments/assets/56387f35-8db4-4c27-bc8b-d9cfc69624c5" />

It currently supports:

- Facebook Reels
- Facebook video surfaces
- Facebook Stories
- YouTube Shorts

Chrome is the primary target today, and the codebase also keeps a Firefox build path ready.

## How It Works

The extension adds a popup with simple switches. Turn a surface on to hide it. Turn it off to let it show normally again.

Available controls:

- `Reels`: hides Facebook reel-specific surfaces
- `Video surfaces`: hides Facebook Watch-style video sections and related video modules
- `Stories`: hides the Facebook stories tray
- `Shorts`: hides YouTube Shorts shelves and Shorts-specific cards

The extension only runs on:

- `*://*.facebook.com/*`
- `*://*.youtube.com/*`

Your settings are stored locally in the browser so the extension remembers your choices.

## Install Locally In Chrome

1. Run `npm install`
2. Run `npm run build:chrome`
3. Open `chrome://extensions`
4. Turn on `Developer mode`
5. Click `Load unpacked`
6. Select `dist/chrome`

After loading it, open Facebook or YouTube and use the popup to choose what you want hidden.

## Development

Useful commands:

- `npm run build:chrome` builds the Chrome extension into `dist/chrome`
- `npm run build:firefox` builds the Firefox-ready package into `dist/firefox`
- `npm test` runs the test suite
- `npx tsc --noEmit` runs type-checking

Project areas:

- popup UI: [`src/popup/`](./src/popup)
- content blocking logic: [`src/content/`](./src/content)
- shared settings/storage helpers: [`src/shared/`](./src/shared)
- docs: [`docs/`](./docs)

## Privacy

Leave Me Alone does not require an account and does not send your settings to a server. It stores only your local hide/show preferences in browser storage.

See:

- [Privacy policy](./docs/privacy-policy.md)
- [Support](./docs/support.md)
