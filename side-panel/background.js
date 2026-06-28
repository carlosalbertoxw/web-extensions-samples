// The side panel is a UI that stays open alongside the page (unlike the popup,
// which closes on blur). Here we make clicking the toolbar icon open the panel.

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});
