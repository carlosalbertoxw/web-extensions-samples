// Context menu items are created from the background service worker, usually
// once on installation. Each item fires the onClicked event when chosen.

chrome.runtime.onInstalled.addListener(() => {
  // Shown only when the user right-clicks selected text.
  chrome.contextMenus.create({
    id: "countLetters",
    title: 'Count letters in "%s"',
    contexts: ["selection"],
  });

  // Shown when right-clicking anywhere on the page.
  chrome.contextMenus.create({
    id: "sayHello",
    title: "Say hello from the extension",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "countLetters") {
    const text = info.selectionText || "";
    notify("Letters selected", `"${text}" has ${text.length} characters.`);
  }

  if (info.menuItemId === "sayHello") {
    notify("Hello!", "This message was triggered from the context menu.");
  }
});

function notify(title, message) {
  chrome.notifications.create(`ctx-${Date.now()}`, {
    type: "basic",
    iconUrl: "images/icon-48.png",
    title,
    message,
  });
}
