// This page is never shown. It exists only to give the service worker access to
// the DOM APIs it does not have.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== "offscreen" || message.action !== "parseHtml") {
    return;
  }

  // DOMParser is the whole point: it does not exist inside a service worker.
  const document = new DOMParser().parseFromString(message.html, "text/html");

  sendResponse({
    title: document.title || "(no title)",
    links: document.querySelectorAll("a").length,
    images: document.querySelectorAll("img").length,
    headings: document.querySelectorAll("h1, h2, h3").length,
  });
});
