// The popup only asks the service worker to show the notification. It does not
// create the window itself: the popup is torn down as soon as the new window
// takes the focus, so the code that has to close it later must live somewhere
// that survives (see background.js).

document.getElementById("clickMe").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "showCustomNotification" });
  window.close();
});
