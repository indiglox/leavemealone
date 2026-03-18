import type { ExtensionSettings, HideCategory } from "../shared/types";

export type MatchRule = {
  category: HideCategory;
  selector: string;
  boundarySelector?: string;
  predicate?: (element: Element) => boolean;
};

export type SiteRuleSet = {
  settingsEnabled: (settings: ExtensionSettings) => boolean;
  rules: MatchRule[];
};

function textOrAriaIncludes(element: Element, value: string): boolean {
  const text = `${element.textContent ?? ""} ${element.getAttribute("aria-label") ?? ""}`.toLowerCase();
  return text.includes(value);
}

function hrefIncludes(element: Element, value: string): boolean {
  if (!(element instanceof HTMLAnchorElement)) {
    return false;
  }

  return element.href.toLowerCase().includes(value);
}

function findFacebookStoryTray(element: Element): Element | null {
  return (
    element.closest('[data-pagelet*="Stories"]') ??
    element.closest('[aria-label*="Stories"]') ??
    element.closest('[role="region"]')
  );
}

function looksLikeFacebookStoryTray(element: Element): boolean {
  const tray = findFacebookStoryTray(element);
  if (!tray) {
    return false;
  }

  const storyCount = tray.querySelectorAll(
    'a[href*="/stories/"], a[aria-label*="Create story"], a[aria-label*="Your story"], a[aria-label*="story"]'
  ).length;

  return storyCount >= 2 || textOrAriaIncludes(tray, "create story") || textOrAriaIncludes(tray, "stories");
}

export const FACEBOOK_RULES: SiteRuleSet = {
  settingsEnabled: (settings) =>
    settings.facebook.reels || settings.facebook.videos || settings.facebook.stories,
  rules: [
    {
      category: "facebook:reels",
      selector:
        'a[href*="/reel/"], a[href*="/watch/reels/"], a[aria-label*="Reels"], a[aria-label*="reel"]',
      boundarySelector:
        '[role="article"], [role="listitem"], [data-pagelet*="FeedUnit"], [data-pagelet*="Reels"], [role="link"]'
    },
    {
      category: "facebook:reels",
      selector: '[aria-label*="Reels and short videos"], [aria-label="Reels"]',
      boundarySelector: '[role="tab"], nav li, nav [role="listitem"], [role="link"]'
    },
    {
      category: "facebook:videos",
      selector:
        'a[href*="/watch/"]:not([href*="/watch/reels/"]), a[href*="/videos/"], a[aria-label="Watch"], a[aria-label*="Videos"]',
      boundarySelector:
        '[role="article"], [role="listitem"], [data-pagelet*="FeedUnit"], nav li, nav [role="listitem"], [role="tab"], [role="link"]'
    },
    {
      category: "facebook:videos",
      selector: '[role="tab"][aria-label="Watch"], [role="tab"][aria-label*="Videos"]',
      boundarySelector: '[role="tab"], nav li, nav [role="listitem"]'
    },
    {
      category: "facebook:stories",
      selector:
        '[data-pagelet*="Stories"], [aria-label*="Stories"], a[href*="/stories/"], a[aria-label*="Create story"], a[aria-label*="Your story"], a[aria-label*="story"]',
      boundarySelector: '[data-pagelet*="Stories"], [aria-label*="Stories"], [role="region"]',
      predicate: (element) => looksLikeFacebookStoryTray(element)
    }
  ]
};

export const YOUTUBE_RULES: SiteRuleSet = {
  settingsEnabled: (settings) => settings.youtube.shorts,
  rules: [
    {
      category: "youtube:shorts",
      selector:
        'ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts], ytd-reel-item-renderer, ytm-shorts-lockup-view-model'
    },
    {
      category: "youtube:shorts",
      selector:
        'a[href^="/shorts/"], a[href*="youtube.com/shorts/"], [title="Shorts"], [aria-label*="Shorts"]',
      boundarySelector:
        "ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-shelf-renderer, ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer"
    },
    {
      category: "youtube:shorts",
      selector: 'yt-formatted-string, span, a',
      boundarySelector:
        "ytd-rich-shelf-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-guide-entry-renderer",
      predicate: (element) => textOrAriaIncludes(element, "shorts") || hrefIncludes(element, "/shorts/")
    }
  ]
};
