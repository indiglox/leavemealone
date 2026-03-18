import { getSettings, setSettings } from "../shared/storage";
import { updateSiteSetting } from "../shared/settings";
import type { ExtensionSettings, SiteName } from "../shared/types";

type ToggleDefinition = {
  id: string;
  site: SiteName;
  key: string;
};

const TOGGLES: ToggleDefinition[] = [
  { id: "facebook-reels", site: "facebook", key: "reels" },
  { id: "facebook-videos", site: "facebook", key: "videos" },
  { id: "facebook-stories", site: "facebook", key: "stories" },
  { id: "youtube-shorts", site: "youtube", key: "shorts" }
];

function getToggle(id: string): HTMLInputElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Missing toggle: ${id}`);
  }

  return element;
}

function render(settings: ExtensionSettings): void {
  for (const { id, site, key } of TOGGLES) {
    const toggle = getToggle(id);
    toggle.checked = settings[site][key as keyof typeof settings[typeof site]];
  }
}

function setupTabs(): void {
  const tabButtons = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".platform-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");
      const targetId = button.getAttribute("data-target");
      if (targetId) {
        document.getElementById(targetId)?.classList.add("active");
      }
    });
  });
}

function getElement<T extends Element>(id: string, type: { new (): T }): T {
  const element = document.getElementById(id);
  if (!(element instanceof type)) {
    throw new Error(`Missing element: ${id}`);
  }

  return element;
}

function setupViews(): void {
  const mainView = getElement("main-view", HTMLElement);
  const linksView = getElement("links-view", HTMLElement);
  const openButton = getElement("open-links-view", HTMLButtonElement);
  const closeButton = getElement("close-links-view", HTMLButtonElement);

  const showView = (view: "main" | "links") => {
    const showMain = view === "main";
    mainView.classList.toggle("active", showMain);
    linksView.classList.toggle("active", !showMain);
  };

  openButton.addEventListener("click", () => showView("links"));
  closeButton.addEventListener("click", () => showView("main"));
}

async function main(): Promise<void> {
  setupTabs();
  setupViews();
  let settings = await getSettings();
  render(settings);

  for (const { id, site, key } of TOGGLES) {
    const toggle = getToggle(id);
    toggle.addEventListener("change", async () => {
      settings = updateSiteSetting(
        settings,
        site,
        key as never,
        toggle.checked
      );
      await setSettings(settings);
      render(settings);
    });
  }
}

void main();
