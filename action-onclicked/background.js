// chrome.action.onClicked only fires when the manifest declares NO
// "default_popup". The two are mutually exclusive: if a popup is set, the
// browser opens it and this event never arrives.
//
// This is the right shape for an extension whose whole job is one toggle —
// there is nothing to put in a popup, so clicking the icon just does the thing.

// Top-level code runs every time the worker starts, which covers both a fresh
// install and a browser restart. The call is cheap and idempotent.
chrome.action.setBadgeBackgroundColor({ color: "#1a73e8" });

chrome.action.onClicked.addListener(async (tab) => {
  // Clicking the icon is what grants "activeTab" access to this tab, so the
  // extension needs no host permissions to touch the page below.
  let results;
  try {
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toggleReadingMode,
    });
  } catch (error) {
    // chrome:// pages and the Web Store reject injection.
    console.error(error);
    return;
  }

  // The page itself is the source of truth: the injected function reports
  // whether the mode ended up on or off. A separate copy of that state kept
  // in the extension would drift as soon as the page reloads or navigates.
  const enabled = results[0].result;

  // The badge is per-tab, so each tab shows its own state.
  await chrome.action.setBadgeText({ tabId: tab.id, text: enabled ? "ON" : "" });
});

// A tab-specific badge only resets when the tab closes, but the injected style
// is gone as soon as the tab loads a new page. Clear the badge to match.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    chrome.action.setBadgeText({ tabId, text: "" });
  }
});

// Runs inside the page, not here. Returns the new state.
function toggleReadingMode() {
  const id = "action-onclicked-reading-mode";
  const existing = document.getElementById(id);

  if (existing) {
    existing.remove();
    return false;
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
  (document.head ?? document.documentElement).append(style);
  return true;
}
