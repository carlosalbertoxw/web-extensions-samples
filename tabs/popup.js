// The chrome.tabs API lets an extension read and control the browser's tabs.

const tabList = document.getElementById("tabList");

// List every tab in the current window and let the user jump to one.
chrome.tabs.query({ currentWindow: true }, (tabs) => {
  tabs.forEach((tab) => {
    const item = document.createElement("li");
    item.textContent = tab.title || tab.url;
    item.title = tab.url;
    item.addEventListener("click", () => {
      // Activate (focus) the clicked tab.
      chrome.tabs.update(tab.id, { active: true });
      window.close();
    });
    tabList.appendChild(item);
  });
});

// Open a brand new tab.
document.getElementById("openTab").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://chrome.dev" });
});
