export type BrowserTarget = "chrome" | "firefox";

export type FacebookSettings = {
  reels: boolean;
  videos: boolean;
  stories: boolean;
};

export type YouTubeSettings = {
  shorts: boolean;
};

export type ExtensionSettings = {
  facebook: FacebookSettings;
  youtube: YouTubeSettings;
};

export type FacebookCategory = keyof FacebookSettings;
export type YouTubeCategory = keyof YouTubeSettings;
export type HideCategory = `facebook:${FacebookCategory}` | `youtube:${YouTubeCategory}`;

export type SiteName = "facebook" | "youtube";
