// This file is about the options-page surface itself: a full HTML page declared
// under "options_ui" that the browser hosts for the extension's settings.
// (Persisting values is covered in depth by the "storage" example; here we just
// keep a couple of preferences with chrome.storage.sync.)

const DEFAULTS = { theme: "light", notifications: false };

const theme = document.getElementById("theme");
const notifications = document.getElementById("notifications");
const status = document.getElementById("status");

// Load saved settings when the page opens. The script sits at the end of
// <body>, so every element above already exists.
async function loadOptions() {
  const items = await chrome.storage.sync.get(DEFAULTS);
  theme.value = items.theme;
  notifications.checked = items.notifications;
}

// Save settings and confirm to the user.
document.getElementById("save").addEventListener("click", async () => {
  await chrome.storage.sync.set({ theme: theme.value, notifications: notifications.checked });
  status.textContent = "Options saved.";
  setTimeout(() => (status.textContent = ""), 1500);
});

loadOptions();
