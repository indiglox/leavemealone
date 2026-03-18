# Chrome Web Store Submission Checklist

## Build and package

- Run `npm test`
- Run `npx tsc --noEmit`
- Run `npm run release:chrome`
- Confirm the zip exists in [`artifacts/`](/Users/jayson/Documents/projects/leavemealone/artifacts)
- Confirm the zip contains only runtime files and no source maps

## Store listing

- Use the copy in [`listing-copy.md`](/Users/jayson/Documents/projects/leavemealone/docs/chrome-web-store/listing-copy.md)
- Add the final support URL
- Add the final privacy policy URL
- Upload the final square store icon
- Upload Chrome Web Store screenshots

## Privacy

- Use [`privacy-disclosure.md`](/Users/jayson/Documents/projects/leavemealone/docs/chrome-web-store/privacy-disclosure.md)
- Ensure store answers match the public privacy policy exactly

## Reviewer notes

- Paste the text from [`reviewer-notes.md`](/Users/jayson/Documents/projects/leavemealone/docs/chrome-web-store/reviewer-notes.md)
- Mention the Facebook signed-in limitation explicitly

## Manual QA

- Popup loads with no broken assets
- Toolbar icon appears correctly
- Facebook toggles off means no Facebook blocking activity
- Facebook Stories collapses compactly when enabled
- YouTube Shorts hiding works on Home, Search, and Watch
