// The popup starts the conversation: it asks the content script (running inside
// the active tab) for information about the page, and tells the background
// service worker to keep a running count of how many analyses were requested.

document.getElementById("analyze").addEventListener("click", async () => {
  const result = document.getElementById("result");

  // Find the tab the user is currently looking at.
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Send a message to the content script and wait for its reply. It rejects if
  // nothing is listening: chrome:// pages never get content scripts, and tabs
  // that were already open when the extension was installed only get one after
  // a reload.
  let response;
  try {
    response = await chrome.tabs.sendMessage(tab.id, { action: "analyze" });
  } catch {
    result.textContent =
      "Could not reach the page. Open a normal website (not chrome:// pages), or reload it, and try again.";
    return;
  }

  render(result, response);

  // Also notify the background service worker (popup -> background).
  chrome.runtime.sendMessage({ action: "analysisDone" });
});

// The response comes from the visited page, so it is untrusted input. Building
// the output with innerHTML would let a page choose the markup that runs inside
// the extension; createElement + textContent cannot be escaped out of.
function render(container, response) {
  container.replaceChildren();

  const title = document.createElement("strong");
  title.textContent = response.title;
  container.append(title);

  for (const [label, value] of [
    ["Links", response.links],
    ["Images", response.images],
    ["Paragraphs", response.paragraphs],
  ]) {
    container.append(document.createElement("br"), `${label}: ${value}`);
  }
}
