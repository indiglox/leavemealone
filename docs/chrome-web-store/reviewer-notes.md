# Chrome Web Store Reviewer Notes

## Test overview

Leave Me Alone is a browser extension that hides:

- Facebook Reels
- Facebook video surfaces
- Facebook Stories
- YouTube Shorts

The popup provides a switch for each category. Settings are saved locally and apply immediately to open tabs.

## Public testing path

### YouTube

1. Open YouTube home, search results, or a watch page.
2. Enable `Shorts` in the popup.
3. Confirm Shorts shelves and Shorts-specific cards are hidden.
4. Disable `Shorts`.
5. Confirm the hidden Shorts surfaces return.

### Facebook

Facebook behavior depends on the reviewer's logged-in Facebook experience and the surfaces currently available to that account.

1. Open Facebook while signed in.
2. Enable `Stories` and confirm the stories tray collapses.
3. Enable `Reels` and confirm reel-specific surfaces are hidden when present.
4. Disable all Facebook switches and confirm Facebook blocking activity stops.

## Known reviewer limitation

Facebook may vary by account, region, A/B test bucket, and whether the reviewer is signed in. YouTube verification is fully public; Facebook verification may require a normal logged-in session to expose the targeted surfaces.
