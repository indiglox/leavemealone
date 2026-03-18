import type { ExtensionSettings } from "./types";

export const STORAGE_KEY = "settings";

export const DEFAULT_SETTINGS: ExtensionSettings = {
  facebook: {
    reels: true,
    videos: true,
    stories: true
  },
  youtube: {
    shorts: true
  }
};
