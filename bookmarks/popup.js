// chrome.bookmarks exposes the browser's bookmark tree. The "bookmarks"
// permission is a powerful one — Chrome warns the user about it at install
// time — so an extension should only ask for it if it really needs the data.

const status = document.getElementById("status");
const list = document.getElementById("list");

// The tree has fixed root folders. "1" is the bookmarks bar and "2" is
// "Other bookmarks"; new items go there unless a folder is chosen.
const OTHER_BOOKMARKS_ID = "2";

document.getElementById("add").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Chrome refuses to bookmark its own internal pages.
  if (!tab.url || !/^https?:/.test(tab.url)) {
    status.textContent = "Open a normal website to bookmark it.";
    return;
  }

  try {
    await chrome.bookmarks.create({
      parentId: OTHER_BOOKMARKS_ID,
      title: tab.title || tab.url,
      url: tab.url,
    });
    status.textContent = "Bookmarked in Other bookmarks.";
    refresh();
  } catch (error) {
    status.textContent = "Could not create the bookmark.";
    console.error(error);
  }
});

// getRecent returns only real bookmarks, never folders, newest first.
async function refresh() {
  const recent = await chrome.bookmarks.getRecent(10);
  list.replaceChildren();

  if (recent.length === 0) {
    list.textContent = "No bookmarks yet.";
    return;
  }

  for (const bookmark of recent) {
    const entry = document.createElement("li");
    entry.textContent = bookmark.title || bookmark.url;
    entry.title = bookmark.url;
    entry.addEventListener("click", () => {
      chrome.tabs.create({ url: bookmark.url });
      window.close();
    });
    list.append(entry);
  }
}

// The tree changes from anywhere in the browser, so the popup listens rather
// than assuming its snapshot stays correct.
chrome.bookmarks.onCreated.addListener(refresh);
chrome.bookmarks.onRemoved.addListener(refresh);

refresh();
