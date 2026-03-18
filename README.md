# Leave Me Alone

Leave Me Alone is an open-source browser extension that helps reduce doomscrolling by hiding high-distraction surfaces on Facebook and YouTube.

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
6. Select [`dist/chrome`](/Users/jayson/Documents/projects/leavemealone/dist/chrome)

After loading it, open Facebook or YouTube and use the popup to choose what you want hidden.

## Development

Useful commands:

- `npm run build:chrome` builds the Chrome extension into `dist/chrome`
- `npm run build:firefox` builds the Firefox-ready package into `dist/firefox`
- `npm test` runs the test suite
- `npx tsc --noEmit` runs type-checking

Project areas:

- popup UI: [`src/popup/`](/Users/jayson/Documents/projects/leavemealone/src/popup)
- content blocking logic: [`src/content/`](/Users/jayson/Documents/projects/leavemealone/src/content)
- shared settings/storage helpers: [`src/shared/`](/Users/jayson/Documents/projects/leavemealone/src/shared)
- docs: [`docs/`](/Users/jayson/Documents/projects/leavemealone/docs)

## Privacy

Leave Me Alone does not require an account and does not send your settings to a server. It stores only your local hide/show preferences in browser storage.

See:

- [Privacy policy](/Users/jayson/Documents/projects/leavemealone/docs/privacy-policy.md)
- [Support](/Users/jayson/Documents/projects/leavemealone/docs/support.md)
