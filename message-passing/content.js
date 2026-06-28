// The content script listens for messages coming from the popup. When asked, it
// reads the page's DOM, briefly highlights the page so the user can see it acted,
// and sends the statistics back as the response.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== "analyze") {
    return;
  }

  // Visual feedback: flash a colored outline around the whole page.
  const previousOutline = document.body.style.outline;
  document.body.style.outline = "4px solid #1a73e8";
  setTimeout(() => {
    document.body.style.outline = previousOutline;
  }, 600);

  sendResponse({
    title: document.title,
    links: document.querySelectorAll("a").length,
    images: document.querySelectorAll("img").length,
    paragraphs: document.querySelectorAll("p").length,
  });
});
