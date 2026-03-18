import type { MatchRule } from "./rules";

export function findBoundary(element: Element, boundarySelector?: string): Element {
  if (!boundarySelector) {
    return element;
  }

  const boundary = element.closest(boundarySelector);
  if (!boundary) {
    return element;
  }

  if (boundary.matches("html, body, [role='main'], [role='feed']")) {
    return element;
  }

  const rect = boundary.getBoundingClientRect();
  const isOversized =
    rect.width >= window.innerWidth * 0.85 && rect.height >= window.innerHeight * 1.5;

  return isOversized ? element : boundary;
}

export function uniqueMatches(root: ParentNode, selector: string): Element[] {
  return Array.from(root.querySelectorAll(selector));
}

export function shouldHideMatch(element: Element, rule: MatchRule): boolean {
  return rule.predicate ? rule.predicate(element) : true;
}
