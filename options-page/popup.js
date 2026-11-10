// The popup's job here is to open the options page (chrome.runtime.openOptionsPage)
// and show a quick summary of the settings chosen there.

const summary = document.getElementById("summary");

async function showSummary() {
  const items = await chrome.storage.sync.get({ theme: "light", notifications: false });
  summary.textContent = `Theme: ${items.theme} · Notifications: ${
    items.notifications ? "on" : "off"
  }`;
}

document.getElementById("openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

showSummary();
