export function watchLocationChanges(callback: () => void): () => void {
  let previousUrl = location.href;
  const intervalId = window.setInterval(() => {
    if (location.href !== previousUrl) {
      previousUrl = location.href;
      callback();
    }
  }, 500);

  const handlePopstate = () => {
    if (location.href !== previousUrl) {
      previousUrl = location.href;
      callback();
    }
  };

  window.addEventListener("popstate", handlePopstate);

  return () => {
    window.clearInterval(intervalId);
    window.removeEventListener("popstate", handlePopstate);
  };
}
