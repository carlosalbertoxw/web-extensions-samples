// The background service worker listens for messages from the popup. Every time
// an analysis is reported it increases a counter and shows it on the badge, so
// the full round trip (popup -> content script -> popup -> background) is visible.

// The worker is stopped after a few seconds of inactivity, which wipes every
// variable declared here. A plain `let analysisCount = 0` would silently reset
// the badge, so the counter lives in chrome.storage.session instead: it survives
// the worker being suspended and is cleared when the browser closes.
const COUNTER_KEY = "analysisCount";

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeBackgroundColor({ color: "#34a853" });
});

// setBadgeBackgroundColor has to be re-applied on every worker start, because
// onInstalled only fires once.
chrome.action.setBadgeBackgroundColor({ color: "#34a853" });

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "analysisDone") {
    incrementCounter();
  }
  // Returning nothing (undefined) keeps the message channel synchronous: this
  // listener never calls sendResponse.
});

// Reading and writing storage is asynchronous, so two messages arriving close
// together could both read the same value and lose one increment. Chaining the
// updates on a single promise serializes them.
let pending = Promise.resolve();

function incrementCounter() {
  pending = pending.then(async () => {
    const stored = await chrome.storage.session.get({ [COUNTER_KEY]: 0 });
    const next = stored[COUNTER_KEY] + 1;
    await chrome.storage.session.set({ [COUNTER_KEY]: next });
    await chrome.action.setBadgeText({ text: String(next) });
  });
  return pending;
}
