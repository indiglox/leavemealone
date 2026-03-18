import type { HideCategory } from "../shared/types";

const HIDDEN_ATTRIBUTE = "data-lma-hidden";
const HIDE_REASON_ATTRIBUTE = "data-lma-hide-reasons";
const STYLE_ID = "lma-style";

export function ensureStyleDocument(documentRef: Document): void {
  if (documentRef.getElementById(STYLE_ID)) {
    return;
  }

  const style = documentRef.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    [${HIDDEN_ATTRIBUTE}="true"] {
      display: none !important;
    }
  `;

  const target = documentRef.head ?? documentRef.documentElement;
  target.prepend(style);
}

export class HideManager {
  private reasons = new WeakMap<Element, Set<HideCategory>>();

  private getReasons(element: Element): Set<HideCategory> {
    const cached = this.reasons.get(element);
    if (cached) {
      return new Set(cached);
    }

    const serialized = element.getAttribute(HIDE_REASON_ATTRIBUTE);
    if (!serialized) {
      return new Set<HideCategory>();
    }

    return new Set(
      serialized
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean) as HideCategory[]
    );
  }

  hide(element: Element, reason: HideCategory): void {
    const reasonSet = this.getReasons(element);
    reasonSet.add(reason);
    this.reasons.set(element, reasonSet);
    element.setAttribute(HIDDEN_ATTRIBUTE, "true");
    element.setAttribute(HIDE_REASON_ATTRIBUTE, [...reasonSet].join(","));
  }

  clearCategory(reason: HideCategory): void {
    const hidden = Array.from(document.querySelectorAll(`[${HIDE_REASON_ATTRIBUTE}]`));
    for (const element of hidden) {
      const reasonSet = this.getReasons(element);
      reasonSet.delete(reason);

      if (reasonSet.size === 0) {
        this.reasons.delete(element);
        element.removeAttribute(HIDDEN_ATTRIBUTE);
        element.removeAttribute(HIDE_REASON_ATTRIBUTE);
        continue;
      }

      this.reasons.set(element, reasonSet);
      element.setAttribute(HIDE_REASON_ATTRIBUTE, [...reasonSet].join(","));
    }
  }

  syncActiveReasons(activeReasons: Set<HideCategory>): void {
    const hidden = Array.from(document.querySelectorAll(`[${HIDE_REASON_ATTRIBUTE}]`));
    for (const element of hidden) {
      const reasonSet = this.getReasons(element);
      const nextReasons = new Set([...reasonSet].filter((reason) => activeReasons.has(reason)));

      if (nextReasons.size === 0) {
        this.reasons.delete(element);
        element.removeAttribute(HIDDEN_ATTRIBUTE);
        element.removeAttribute(HIDE_REASON_ATTRIBUTE);
        continue;
      }

      this.reasons.set(element, nextReasons);
      element.setAttribute(HIDE_REASON_ATTRIBUTE, [...nextReasons].join(","));
    }
  }
}
