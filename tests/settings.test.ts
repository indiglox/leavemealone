import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "../src/shared/constants";
import { normalizeSettings, updateSiteSetting } from "../src/shared/settings";

describe("normalizeSettings", () => {
  it("returns defaults for invalid input", () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it("merges partial site settings", () => {
    expect(
      normalizeSettings({
        facebook: { reels: false },
        youtube: {}
      })
    ).toEqual({
      facebook: {
        reels: false,
        videos: true,
        stories: true
      },
      youtube: {
        shorts: true
      }
    });
  });
});

describe("updateSiteSetting", () => {
  it("updates a single toggle without losing sibling values", () => {
    const updated = updateSiteSetting(DEFAULT_SETTINGS, "facebook", "stories", false);
    expect(updated.facebook.stories).toBe(false);
    expect(updated.facebook.reels).toBe(true);
    expect(updated.youtube.shorts).toBe(true);
  });
});
