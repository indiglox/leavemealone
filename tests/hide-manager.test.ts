import { beforeEach, describe, expect, it } from "vitest";
import { HideManager } from "../src/content/hide-manager";

describe("HideManager", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps overlapping hides until all reasons are cleared", () => {
    const manager = new HideManager();
    const element = document.createElement("div");
    document.body.append(element);

    manager.hide(element, "facebook:reels");
    manager.hide(element, "facebook:stories");
    manager.clearCategory("facebook:reels");

    expect(element.getAttribute("data-lma-hidden")).toBe("true");
    expect(element.getAttribute("data-lma-hide-reasons")).toContain("facebook:stories");

    manager.clearCategory("facebook:stories");
    expect(element.hasAttribute("data-lma-hidden")).toBe(false);
  });

  it("syncs hidden elements to active reasons", () => {
    const manager = new HideManager();
    const element = document.createElement("div");
    document.body.append(element);

    manager.hide(element, "youtube:shorts");
    manager.syncActiveReasons(new Set());

    expect(element.hasAttribute("data-lma-hidden")).toBe(false);
  });

  it("can unhide elements using DOM-stored reasons even with a fresh manager", () => {
    const firstManager = new HideManager();
    const element = document.createElement("div");
    document.body.append(element);

    firstManager.hide(element, "facebook:reels");
    expect(element.getAttribute("data-lma-hidden")).toBe("true");

    const secondManager = new HideManager();
    secondManager.syncActiveReasons(new Set());

    expect(element.hasAttribute("data-lma-hidden")).toBe(false);
    expect(element.hasAttribute("data-lma-hide-reasons")).toBe(false);
  });
});
