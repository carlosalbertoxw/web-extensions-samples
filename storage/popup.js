// chrome.storage persists data for the extension. It offers several areas:
//   - local:   stays on this device (largest quota).
//   - sync:    synced across the user's signed-in devices.
//   - session: kept only in memory until the browser closes.
// This example uses "local" and shows the full set / get / remove / onChanged cycle.

const input = document.getElementById("value");
const saved = document.getElementById("saved");

function render(value) {
  saved.textContent = value ? value : "(nothing saved)";
}

// get: read the stored value when the popup opens.
chrome.storage.local.get("note", (result) => render(result.note));

// onChanged: fires whenever a value changes, from anywhere in the extension,
// so the UI never has to be refreshed manually.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.note) {
    render(changes.note.newValue);
  }
});

// set: write the value.
document.getElementById("save").addEventListener("click", () => {
  chrome.storage.local.set({ note: input.value });
});

// remove: delete the value.
document.getElementById("remove").addEventListener("click", () => {
  chrome.storage.local.remove("note");
  input.value = "";
});
