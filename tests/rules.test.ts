import { beforeEach, describe, expect, it } from "vitest";
import { findBoundary } from "../src/content/dom";
import { categorizeRule, SiteBlocker } from "../src/content/blocker";
import { HideManager } from "../src/content/hide-manager";
import { FACEBOOK_RULES, YOUTUBE_RULES } from "../src/content/rules";
import { DEFAULT_SETTINGS } from "../src/shared/constants";

describe("rule categories", () => {
  it("maps Facebook rules to the configured hide categories", () => {
    expect(FACEBOOK_RULES.rules.some((rule) => categorizeRule(rule) === "facebook:reels")).toBe(true);
    expect(FACEBOOK_RULES.rules.some((rule) => categorizeRule(rule) === "facebook:videos")).toBe(true);
    expect(FACEBOOK_RULES.rules.some((rule) => categorizeRule(rule) === "facebook:stories")).toBe(true);
  });

  it("maps YouTube rules to shorts", () => {
    expect(YOUTUBE_RULES.rules.every((rule) => categorizeRule(rule) === "youtube:shorts")).toBe(true);
  });
});

describe("SiteBlocker DOM behavior", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("hides Facebook reel cards and unhides them when disabled", () => {
    document.body.innerHTML = `
      <div role="feed">
        <div class="card">
          <article role="article">
            <a href="https://www.facebook.com/reel/123">Watch reel</a>
          </article>
        </div>
      </div>
    `;

    const blocker = new SiteBlocker("facebook", new HideManager());
    blocker.start(DEFAULT_SETTINGS);

    const card = document.querySelector('[role="article"]');
    expect(card?.getAttribute("data-lma-hidden")).toBe("true");

    blocker.updateSettings({
      ...DEFAULT_SETTINGS,
      facebook: {
        ...DEFAULT_SETTINGS.facebook,
        reels: false
      }
    });

    expect(card?.hasAttribute("data-lma-hidden")).toBe(false);
    blocker.stop();
  });

  it("hides YouTube shorts shelves", () => {
    document.body.innerHTML = `
      <ytd-rich-shelf-renderer id="shelf">
        <span>Shorts</span>
      </ytd-rich-shelf-renderer>
    `;

    const blocker = new SiteBlocker("youtube", new HideManager());
    blocker.start(DEFAULT_SETTINGS);

    expect(document.getElementById("shelf")?.getAttribute("data-lma-hidden")).toBe("true");
    blocker.stop();
  });

  it("does not promote oversized ancestors into hidden boundaries", () => {
    document.body.innerHTML = `
      <main role="main" id="main">
        <div class="feed-card">
          <a id="reel-link" href="https://www.facebook.com/reel/123">Reel</a>
        </div>
      </main>
    `;

    const reelLink = document.getElementById("reel-link");
    const boundary = reelLink ? findBoundary(reelLink, "[role='main']") : null;

    expect(boundary).toBe(reelLink);
  });

  it("keeps stories visible when only reels are enabled in a mixed tray", () => {
    document.body.innerHTML = `
      <div role="region">
        <div role="listitem" id="story-item">
          <a href="https://www.facebook.com/stories/abc">Your story</a>
        </div>
        <div role="listitem" id="reel-item">
          <a href="https://www.facebook.com/reel/123">A reel</a>
        </div>
      </div>
    `;

    const blocker = new SiteBlocker("facebook", new HideManager());
    blocker.start({
      ...DEFAULT_SETTINGS,
      facebook: {
        reels: true,
        videos: false,
        stories: false
      }
    });

    expect(document.getElementById("reel-item")?.getAttribute("data-lma-hidden")).toBe("true");
    expect(document.getElementById("story-item")?.hasAttribute("data-lma-hidden")).toBe(false);
    blocker.stop();
  });

  it("collapses the full stories tray instead of leaving empty story slots", () => {
    document.body.innerHTML = `
      <div role="region" id="stories-tray">
        <div role="listitem"><a aria-label="Create story" href="https://www.facebook.com/stories/create">Create story</a></div>
        <div role="listitem"><a href="https://www.facebook.com/stories/abc">Story one</a></div>
        <div role="listitem"><a href="https://www.facebook.com/stories/def">Story two</a></div>
        <button aria-label="Next stories">Next</button>
      </div>
    `;

    const blocker = new SiteBlocker("facebook", new HideManager());
    blocker.start({
      ...DEFAULT_SETTINGS,
      facebook: {
        reels: false,
        videos: false,
        stories: true
      }
    });

    expect(document.getElementById("stories-tray")?.getAttribute("data-lma-hidden")).toBe("true");
    blocker.stop();
  });
});
