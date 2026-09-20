// The custom notification is a small extension window created with
// chrome.windows.create. It is opened from the service worker and not from the
// popup on purpose: the popup is destroyed the moment it loses focus, which
// happens as soon as the new window appears, and any timer started there would
// die with it. The service worker outlives the popup, so it can also close the
// window again.

const WINDOW_WIDTH = 350;
const WINDOW_HEIGHT = 150;
const VISIBLE_FOR_MS = 5000;

let notificationWindowId = null;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "showCustomNotification") {
    showCustomNotification();
  }
});

async function showCustomNotification() {
  // Only one notification at a time: reuse the slot if it is still open.
  await closeCustomNotification();

  // A service worker has no `window` or `screen` object, so the position is
  // derived from the browser window the user is currently working in.
  const current = await chrome.windows.getCurrent();
  const left = Math.max(0, (current.left || 0) + (current.width || 0) - WINDOW_WIDTH - 20);
  const top = Math.max(0, (current.top || 0) + (current.height || 0) - WINDOW_HEIGHT - 40);

  const created = await chrome.windows.create({
    url: "custom_notification.html",
    type: "popup",
    focused: false,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    left,
    top,
  });
  notificationWindowId = created.id;

  // A short setTimeout is safe here because the worker is only suspended after
  // about 30 seconds of inactivity. For longer delays use chrome.alarms, which
  // wakes the worker back up (see the "alarms" example).
  setTimeout(closeCustomNotification, VISIBLE_FOR_MS);
}

async function closeCustomNotification() {
  if (notificationWindowId === null) {
    return;
  }
  const id = notificationWindowId;
  notificationWindowId = null;
  try {
    await chrome.windows.remove(id);
  } catch {
    // The user already closed it; nothing to do.
  }
}

// Keep the tracked id honest if the user closes the window by hand.
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === notificationWindowId) {
    notificationWindowId = null;
  }
});
