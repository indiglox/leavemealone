import type { SiteName } from "../shared/types";

export function detectSite(hostname: string): SiteName | null {
  if (hostname.includes("facebook.com")) {
    return "facebook";
  }

  if (hostname.includes("youtube.com")) {
    return "youtube";
  }

  return null;
}
