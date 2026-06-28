// A small notes widget to show the side panel keeps working while the user
// browses other tabs. Notes are persisted with chrome.storage.local.

const notes = document.getElementById("notes");
const status = document.getElementById("status");

chrome.storage.local.get("sidePanelNotes", (result) => {
  notes.value = result.sidePanelNotes || "";
});

document.getElementById("save").addEventListener("click", () => {
  chrome.storage.local.set({ sidePanelNotes: notes.value }, () => {
    status.textContent = "Notes saved.";
    setTimeout(() => (status.textContent = ""), 1500);
  });
});
