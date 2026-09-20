// chrome.action.onClicked only fires when the manifest declares NO
// "default_popup". The two are mutually exclusive: if a popup is set, the
// browser opens it and this event never arrives.
//
// This is the right shape for an extension whose whole job is one toggle —
// there is nothing to put in a popup, so clicking the icon just does the thing.

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeBackgroundColor({ color: "#1a73e8" });
});

chrome.action.onClicked.addListener(async (tab) => {
  // Clicking the icon is what grants "activeTab" access to this tab, so the
  // extension needs no host permissions to touch the page below.
  const enabled = await toggleStateFor(tab.id);

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: applyReadingMode,
      args: [enabled],
    });
  } catch (error) {
    // chrome:// pages and the Web Store reject injection.
    console.error(error);
    return;
  }

  // The badge is per-tab, so each tab shows its own state.
  await chrome.action.setBadgeText({ tabId: tab.id, text: enabled ? "ON" : "" });
});

// Per-tab state lives in storage.session: it must survive the worker being
// suspended, but it is meaningless once the browser closes.
async function toggleStateFor(tabId) {
  const key = `readingMode:${tabId}`;
  const stored = await chrome.storage.session.get({ [key]: false });
  const enabled = !stored[key];
  await chrome.storage.session.set({ [key]: enabled });
  return enabled;
}

// Forget a tab's state when it goes away, so the keys do not pile up.
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(`readingMode:${tabId}`);
});

// Runs inside the page, not here.
function applyReadingMode(enabled) {
  const id = "action-onclicked-reading-mode";
  document.getElementById(id)?.remove();

  if (!enabled) {
    return;
  }

  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    body {
      max-width: 42em !important;
      margin: 0 auto !important;
      font-size: 1.15em !important;
      line-height: 1.7 !important;
      background: #fbf8f1 !important;
    }`;
  document.head.append(style);
}
