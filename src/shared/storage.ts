import browser from "./browser";
import { DEFAULT_SETTINGS, STORAGE_KEY } from "./constants";
import { normalizeSettings } from "./settings";
import type { ExtensionSettings } from "./types";

export async function getSettings(): Promise<ExtensionSettings> {
  const stored = await browser.storage.local.get(STORAGE_KEY);
  if (!(STORAGE_KEY in stored)) {
    await setSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  return normalizeSettings(stored[STORAGE_KEY]);
}

export async function setSettings(settings: ExtensionSettings): Promise<void> {
  await browser.storage.local.set({
    [STORAGE_KEY]: settings
  });
}

export function extractSettingsFromStorageChange(
  changes: Record<string, { newValue?: unknown }>
): ExtensionSettings | null {
  const settingChange = changes[STORAGE_KEY];
  if (!settingChange) {
    return null;
  }

  return normalizeSettings(settingChange.newValue);
}
