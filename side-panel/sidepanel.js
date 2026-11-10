// A small notes widget to show the side panel keeps working while the user
// browses other tabs. Notes are persisted with chrome.storage.local.

const notes = document.getElementById("notes");
const status = document.getElementById("status");

async function loadNotes() {
  const { sidePanelNotes } = await chrome.storage.local.get({ sidePanelNotes: "" });
  notes.value = sidePanelNotes;
}

document.getElementById("save").addEventListener("click", async () => {
  await chrome.storage.local.set({ sidePanelNotes: notes.value });
  status.textContent = "Notes saved.";
  setTimeout(() => (status.textContent = ""), 1500);
});

loadNotes();
