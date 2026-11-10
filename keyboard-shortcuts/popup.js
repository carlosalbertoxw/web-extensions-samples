// The popup shows the shortcut Chrome actually assigned. The one in the
// manifest is only a suggestion: Chrome leaves it blank when another extension
// already uses those keys, and the user can change it at any time.

const shortcutField = document.getElementById("shortcut");
const hint = document.getElementById("hint");

async function showShortcut() {
  const commands = await chrome.commands.getAll();
  const { shortcut } = commands.find((entry) => entry.name === "show-message");

  if (shortcut) {
    shortcutField.textContent = shortcut;
    hint.textContent = "Press it anywhere to show a notification.";
  } else {
    shortcutField.textContent = "not assigned";
    hint.textContent =
      "Chrome did not assign the suggested keys, probably because another extension uses them.";
  }
}

showShortcut();
