import browser from "../shared/browser";
import { getSettings, extractSettingsFromStorageChange } from "../shared/storage";
import { detectSite } from "./platform";
import { HideManager, ensureStyleDocument } from "./hide-manager";
import { SiteBlocker } from "./blocker";
import { watchLocationChanges } from "./url-observer";

async function main(): Promise<void> {
  const site = detectSite(location.hostname);
  if (!site) {
    return;
  }

  ensureStyleDocument(document);
  const hideManager = new HideManager();
  const blocker = new SiteBlocker(site, hideManager);
  let currentSettings = await getSettings();
  let started = false;

  const start = () => {
    if (started) {
      return;
    }

    started = true;
    blocker.start(currentSettings);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  watchLocationChanges(() => blocker.rescan());

  browser.storage.onChanged.addListener((changes: Record<string, { newValue?: unknown }>, areaName: string) => {
    if (areaName !== "local") {
      return;
    }

    const nextSettings = extractSettingsFromStorageChange(changes);
    if (nextSettings) {
      currentSettings = nextSettings;
      if (started) {
        blocker.updateSettings(nextSettings);
      }
    }
  });
}

void main();
