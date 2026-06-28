// The background service worker listens for messages from the popup. Every time
// an analysis is reported it increases a counter and shows it on the badge, so
// the full round trip (popup -> content script -> popup -> background) is visible.

let analysisCount = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeBackgroundColor({ color: "#34a853" });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "analysisDone") {
    analysisCount += 1;
    chrome.action.setBadgeText({ text: String(analysisCount) });
  }
});
