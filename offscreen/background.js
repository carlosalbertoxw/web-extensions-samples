// A service worker has no DOM: there is no `document`, no DOMParser, no
// <audio>, no canvas and no clipboard. MV2 background *pages* had all of that,
// and an offscreen document is what replaces them: an invisible HTML page the
// extension can open when it genuinely needs a DOM, and should close again when
// it is done.
//
// Every offscreen document must declare one of the reasons Chrome recognises,
// and only one can exist at a time.

const OFFSCREEN_PATH = "offscreen.html";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === "offscreen") {
    return; // Not ours: this one is addressed to the offscreen document.
  }

  if (message.action === "parseHtml") {
    parseHtml(message.html).then(sendResponse);
    return true; // Keep the message channel open for the async reply.
  }
});

async function parseHtml(html) {
  await ensureOffscreenDocument();

  // The message is broadcast to every extension context, so the offscreen
  // document filters on `target` and the listener above ignores it in turn.
  const stats = await chrome.runtime.sendMessage({
    target: "offscreen",
    action: "parseHtml",
    html,
  });

  // Close it again: an open offscreen document keeps the worker alive and
  // consumes memory for as long as it exists.
  await chrome.offscreen.closeDocument();
  return stats;
}

// Creating a document that already exists throws, and two calls arriving at
// once would both see "none open", so the check and the creation are guarded.
let creating = null;

async function ensureOffscreenDocument() {
  const existing = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
  });
  if (existing.length > 0) {
    return;
  }

  if (creating) {
    await creating;
    return;
  }

  creating = chrome.offscreen.createDocument({
    url: OFFSCREEN_PATH,
    reasons: [chrome.offscreen.Reason.DOM_PARSER],
    justification: "Parse an HTML string with DOMParser, which the worker lacks.",
  });
  try {
    await creating;
  } finally {
    creating = null;
  }
}
