// Keyboard shortcuts are declared under "commands" in the manifest. The browser
// fires chrome.commands.onCommand with the command name when the keys are pressed.
// Shortcuts can be viewed and customized at chrome://extensions/shortcuts

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "show-message") {
    return;
  }

  // The manifest only *suggests* a shortcut: the user can change it, and macOS
  // uses Command instead of Ctrl. getAll() reports the one actually in use.
  const commands = await chrome.commands.getAll();
  const { shortcut } = commands.find((entry) => entry.name === command);

  chrome.notifications.create(`cmd-${Date.now()}`, {
    type: "basic",
    iconUrl: "images/icon-48.png",
    title: "Shortcut pressed",
    message: `You triggered this with ${shortcut}.`,
  });
});
