// The popup only displays the state the service worker maintains. It reads it
// from storage and stays up to date through the onChanged event.

const tabsOpened = document.getElementById("tabsOpened");
const installedAt = document.getElementById("installedAt");

chrome.storage.local.get(["tabsOpened", "installedAt"], (result) => {
  tabsOpened.textContent = result.tabsOpened || 0;
  installedAt.textContent = result.installedAt || "-";
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.tabsOpened) {
    tabsOpened.textContent = changes.tabsOpened.newValue;
  }
});
