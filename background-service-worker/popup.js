// The popup only displays the state the service worker maintains. It reads it
// from storage and stays up to date through the onChanged event.

const tabsOpened = document.getElementById("tabsOpened");
const installedAt = document.getElementById("installedAt");

async function load() {
  const result = await chrome.storage.local.get(["tabsOpened", "installedAt"]);
  tabsOpened.textContent = result.tabsOpened || 0;
  // The worker stores a timestamp; formatting happens here, at display time,
  // so it follows the user's current locale.
  installedAt.textContent = result.installedAt
    ? new Date(result.installedAt).toLocaleString()
    : "-";
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.tabsOpened) {
    tabsOpened.textContent = changes.tabsOpened.newValue;
  }
});

load();
