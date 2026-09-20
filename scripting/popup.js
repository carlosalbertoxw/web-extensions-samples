// chrome.scripting is the MV3 replacement for tabs.executeScript. Unlike a
// declared content script, which the browser injects into every matching page
// whether it is needed or not, this API injects only when the extension asks.
//
// Paired with "activeTab" it needs no host permissions at all: clicking the
// toolbar icon grants access to that one tab, for that one visit. That is why
// this example can run anywhere without asking the user to trust it with
// "<all_urls>".

const status = document.getElementById("status");

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

// insertCSS / removeCSS inject styles the same way, and can be undone.
let stylesInjected = false;
document.getElementById("toggleCss").addEventListener("click", async () => {
  const tab = await getActiveTab();
  const injection = {
    target: { tabId: tab.id },
    css: "a { outline: 2px solid #fbbc04 !important; }",
  };

  try {
    if (stylesInjected) {
      await chrome.scripting.removeCSS(injection);
      status.textContent = "Styles removed.";
    } else {
      await chrome.scripting.insertCSS(injection);
      status.textContent = "Styles injected.";
    }
    stylesInjected = !stylesInjected;
  } catch (error) {
    status.textContent = "Cannot inject here. Try a normal website.";
    console.error(error);
  }
});

// This function's body is what actually runs inside the page, in the page's
// own context. It must be self-contained.
function countElements(selector) {
  return document.querySelectorAll(selector).length;
}
