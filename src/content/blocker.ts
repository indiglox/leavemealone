import type { ExtensionSettings, HideCategory, SiteName } from "../shared/types";
import { findBoundary, shouldHideMatch, uniqueMatches } from "./dom";
import { HideManager } from "./hide-manager";
import { FACEBOOK_RULES, YOUTUBE_RULES, type MatchRule, type SiteRuleSet } from "./rules";

function activeReasonsForSettings(site: SiteName, settings: ExtensionSettings): Set<HideCategory> {
  if (site === "facebook") {
    return new Set(
      (Object.entries(settings.facebook) as Array<[keyof ExtensionSettings["facebook"], boolean]>)
        .filter(([, enabled]) => enabled)
        .map(([key]) => `facebook:${key}` as HideCategory)
    );
  }

  return new Set(
    (Object.entries(settings.youtube) as Array<[keyof ExtensionSettings["youtube"], boolean]>)
      .filter(([, enabled]) => enabled)
      .map(([key]) => `youtube:${key}` as HideCategory)
  );
}

function getRuleSet(site: SiteName): SiteRuleSet {
  return site === "facebook" ? FACEBOOK_RULES : YOUTUBE_RULES;
}

export function categorizeRule(rule: MatchRule): HideCategory {
  return rule.category;
}

export class SiteBlocker {
  private observer: MutationObserver | null = null;
  private rescanTimer: number | null = null;
  private lastSettings: ExtensionSettings | null = null;

  constructor(
    private site: SiteName,
    private hideManager: HideManager
  ) {}

  start(settings: ExtensionSettings): void {
    this.lastSettings = settings;
    this.scan(document, settings);
    this.refreshObservation(settings);
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    if (this.rescanTimer !== null) {
      window.clearTimeout(this.rescanTimer);
      this.rescanTimer = null;
    }
  }

  updateSettings(settings: ExtensionSettings): void {
    this.lastSettings = settings;
    this.hideManager.syncActiveReasons(activeReasonsForSettings(this.site, settings));
    this.refreshObservation(settings);
    this.scan(document, settings);
  }

  rescan(): void {
    if (this.lastSettings) {
      this.scan(document, this.lastSettings);
    }
  }

  private scheduleScan(): void {
    if (this.rescanTimer !== null) {
      return;
    }

    this.rescanTimer = window.setTimeout(() => {
      this.rescanTimer = null;
      if (this.lastSettings) {
        this.scan(document, this.lastSettings);
      }
    }, 180);
  }

  private refreshObservation(settings: ExtensionSettings): void {
    const ruleSet = getRuleSet(this.site);
    if (!ruleSet.settingsEnabled(settings)) {
      this.observer?.disconnect();
      this.observer = null;
      return;
    }

    if (this.observer) {
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      if (!mutations.some((mutation) => mutation.addedNodes.length > 0)) {
        return;
      }

      this.scheduleScan();
    });

    const target = document.body ?? document.documentElement;
    this.observer.observe(target, {
      childList: true,
      subtree: true
    });
  }

  private scan(root: ParentNode, settings: ExtensionSettings): void {
    const ruleSet = getRuleSet(this.site);
    const activeReasons = activeReasonsForSettings(this.site, settings);
    this.hideManager.syncActiveReasons(activeReasons);

    if (!ruleSet.settingsEnabled(settings)) {
      return;
    }

    for (const rule of ruleSet.rules) {
      if (!activeReasons.has(rule.category)) {
        this.hideManager.clearCategory(rule.category);
        continue;
      }

      for (const element of uniqueMatches(root, rule.selector)) {
        if (!shouldHideMatch(element, rule)) {
          continue;
        }

        const boundary = findBoundary(element, rule.boundarySelector);
        this.hideManager.hide(boundary, rule.category);
      }
    }
  }
}
