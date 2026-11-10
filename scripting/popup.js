// chrome.scripting is the MV3 replacement for tabs.executeScript. Unlike a
// declared content script, which the browser injects into every matching page
// whether it is needed or not, this API injects only when the extension asks.
//
// Paired with "activeTab" it needs no host permissions at all: clicking the
// toolbar icon grants access to that one tab, for that one visit. That is why
// this example can run anywhere without asking the user to trust it with
// "<all_urls>".

const status = document.getElementById("status");

// insertCSS adds a stylesheet the page cannot see, so a class on <html> marks
// whether the outline is on. The popup is destroyed every time it closes, and
// asking the page instead of a variable means a reopened popup still knows.
const MARKER_CLASS = "scripting-sample-outline";
const OUTLINE_CSS = `html.${MARKER_CLASS} a { outline: 2px solid #fbbc04 !important; }`;

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// func + args: the function is serialized and re-created inside the page, so it
// cannot close over anything from this file. Everything it needs comes in args.
document.getElementById("count").addEventListener("click", async () => {
  const tab = await getActiveTab();

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: countElements,
      args: ["a"],
    });
    // One result per frame injected; frame 0 is the top document.
    status.textContent = `This page has ${results[0].result} links.`;
  } catch (error) {
    status.textContent = "Cannot inject here. Try a normal website.";
    console.error(error);
  }
});

// executeScript flips the marker and reports the new state; insertCSS and
// removeCSS then add or take away the matching stylesheet.
document.getElementById("toggleCss").addEventListener("click", async () => {
  const tab = await getActiveTab();
  const target = { tabId: tab.id };

  try {
    const [{ result: enabled }] = await chrome.scripting.executeScript({
      target,
      func: toggleClass,
      args: [MARKER_CLASS],
    });

    if (enabled) {
      await chrome.scripting.insertCSS({ target, css: OUTLINE_CSS });
      status.textContent = "Styles injected.";
    } else {
      await chrome.scripting.removeCSS({ target, css: OUTLINE_CSS });
      status.textContent = "Styles removed.";
    }
  } catch (error) {
    status.textContent = "Cannot inject here. Try a normal website.";
    console.error(error);
  }
});

// These functions' bodies are what actually run inside the page, in the page's
// own context. They must be self-contained.
function countElements(selector) {
  return document.querySelectorAll(selector).length;
}

function toggleClass(className) {
  return document.documentElement.classList.toggle(className);
}
