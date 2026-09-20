// The background service worker is the extension's event handler. It has no UI
// and the browser starts it whenever one of the events it listens to fires, then
// may stop it again. Because it can be suspended at any time, state that must
// survive is kept in chrome.storage instead of plain variables.

// Lifecycle event: runs when the extension is installed AND when it is updated
// or the browser itself updates, so the reason has to be checked before
// resetting anything the user has accumulated.
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason !== chrome.runtime.OnInstalledReason.INSTALL) {
    return;
  }

  // Awaiting the write matters: opening the tab below fires tabs.onCreated, and
  // if the counter had not been initialised yet that first tab would be counted
  // against an empty store and then overwritten by this set().
  await chrome.storage.local.set({
    installedAt: new Date().toLocaleString(),
    tabsOpened: 0,
  });

  // Opening a page is visible proof the worker reacted to the install event.
  chrome.tabs.create({ url: "welcome.html" });
});

// Browser event: fires every time ANY tab is opened, even while no popup is
// showing and even after the worker had been suspended (it is woken up for this).
chrome.tabs.onCreated.addListener(() => {
  incrementTabsOpened();
});

// A read followed by a write is not atomic. Opening several tabs at once (for
// example restoring a window) delivers the events faster than storage responds,
// so two handlers could read the same value and one increment would be lost.
// Chaining every update on a single promise serializes them inside this worker.
let pending = Promise.resolve();

function incrementTabsOpened() {
  pending = pending.then(async () => {
    const { tabsOpened = 0 } = await chrome.storage.local.get("tabsOpened");
    await chrome.storage.local.set({ tabsOpened: tabsOpened + 1 });
  });
  return pending;
}
