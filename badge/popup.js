// The badge is a short label (up to ~4 chars) shown on top of the extension
// icon. Its text and background color are controlled through the chrome.action API.

document.getElementById("setText").addEventListener("click", () => {
  chrome.action.setBadgeText({ text: "NEW" });
});

document.getElementById("setNumber").addEventListener("click", () => {
  const number = Math.floor(Math.random() * 100);
  chrome.action.setBadgeText({ text: String(number) });
});

document.getElementById("setColor").addEventListener("click", () => {
  const color = `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
  chrome.action.setBadgeBackgroundColor({ color });
});

document.getElementById("clear").addEventListener("click", () => {
  // Setting an empty string removes the badge.
  chrome.action.setBadgeText({ text: "" });
});
