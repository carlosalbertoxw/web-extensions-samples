// This file is about the options-page surface itself: a full HTML page declared
// under "options_ui" that the browser hosts for the extension's settings.
// (Persisting values is covered in depth by the "storage" example; here we just
// keep a couple of preferences with chrome.storage.sync.)

const theme = document.getElementById("theme");
const notifications = document.getElementById("notifications");
const status = document.getElementById("status");

// Load saved settings when the page opens.
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get({ theme: "light", notifications: false }, (items) => {
    theme.value = items.theme;
    notifications.checked = items.notifications;
  });
});

// Save settings and confirm to the user.
document.getElementById("save").addEventListener("click", () => {
  chrome.storage.sync.set(
    { theme: theme.value, notifications: notifications.checked },
    () => {
      status.textContent = "Options saved.";
      setTimeout(() => (status.textContent = ""), 1500);
    }
  );
});
