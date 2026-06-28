// The background service worker is the extension's event handler. It has no UI
// and the browser starts it whenever one of the events it listens to fires, then
// may stop it again. Because it can be suspended at any time, state that must
// survive is kept in chrome.storage instead of plain variables.

// Lifecycle event: runs once when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    installedAt: new Date().toLocaleString(),
    tabsOpened: 0,
  });
  // Opening a page is visible proof the worker reacted to the install event.
  chrome.tabs.create({ url: "welcome.html" });
});

// Browser event: fires every time ANY tab is opened, even while no popup is
// showing and even after the worker had been suspended (it is woken up for this).
chrome.tabs.onCreated.addListener(() => {
  chrome.storage.local.get("tabsOpened", (result) => {
    chrome.storage.local.set({ tabsOpened: (result.tabsOpened || 0) + 1 });
  });
});
