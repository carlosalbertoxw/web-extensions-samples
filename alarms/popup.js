// The popup creates and cancels the alarm. The alarm itself is handled in the
// background service worker (background.js), which is woken up when it fires.

const status = document.getElementById("status");

document.getElementById("start").addEventListener("click", () => {
  // delayInMinutes is the time until the alarm fires. The minimum allowed by
  // Chrome is 0.5 minutes for a packed (released) extension.
  chrome.alarms.create("reminder", { delayInMinutes: 1 });
  status.textContent = "Reminder scheduled for 1 minute from now.";
});

document.getElementById("cancel").addEventListener("click", () => {
  chrome.alarms.clear("reminder", (wasCleared) => {
    status.textContent = wasCleared
      ? "Reminder cancelled."
      : "There was no active reminder.";
  });
});
