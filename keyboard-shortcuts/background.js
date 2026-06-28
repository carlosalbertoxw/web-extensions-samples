// Keyboard shortcuts are declared under "commands" in the manifest. The browser
// fires chrome.commands.onCommand with the command name when the keys are pressed.
// Shortcuts can be viewed and customized at chrome://extensions/shortcuts

chrome.commands.onCommand.addListener((command) => {
  if (command === "show-message") {
    chrome.notifications.create(`cmd-${Date.now()}`, {
      type: "basic",
      iconUrl: "images/icon-48.png",
      title: "Shortcut pressed",
      message: "You triggered this with Ctrl+Shift+Y.",
    });
  }
});
