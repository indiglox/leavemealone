import { DEFAULT_SETTINGS } from "./constants";
import type { ExtensionSettings, SiteName } from "./types";

function mergeRecord<T extends Record<string, boolean>>(defaults: T, input: unknown): T {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const merged = { ...defaults };

  for (const key of Object.keys(defaults) as Array<keyof T>) {
    if (typeof source[key as string] === "boolean") {
      merged[key] = source[key as string] as T[keyof T];
    }
  }

  return merged;
}

export function normalizeSettings(input: unknown): ExtensionSettings {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return {
    facebook: mergeRecord(DEFAULT_SETTINGS.facebook, source.facebook),
    youtube: mergeRecord(DEFAULT_SETTINGS.youtube, source.youtube)
  };
}

export function updateSiteSetting<K extends SiteName, T extends keyof ExtensionSettings[K]>(
  settings: ExtensionSettings,
  site: K,
  key: T,
  value: boolean
): ExtensionSettings {
  return {
    ...settings,
    [site]: {
      ...settings[site],
      [key]: value
    }
  } as ExtensionSettings;
}
