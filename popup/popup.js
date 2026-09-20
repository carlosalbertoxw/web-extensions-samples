// The popup is a small HTML page the browser shows under the toolbar icon. It
// is created every time the icon is clicked and destroyed as soon as it loses
// focus, so it must never keep state in variables: anything the user changes is
// written to chrome.storage immediately and read back on the next open.

const someSetting = document.getElementById("someSetting");
const status = document.getElementById("status");

// Restore the saved value when the popup opens. The default is applied by
// passing an object to get(), so a first run behaves like "off".
chrome.storage.local.get({ someSetting: false }, (items) => {
  someSetting.checked = items.someSetting;
  render(items.someSetting);
});

// Persist on every change: the popup may disappear at any moment.
someSetting.addEventListener("change", () => {
  chrome.storage.local.set({ someSetting: someSetting.checked }, () => {
    render(someSetting.checked);
  });
});

function render(enabled) {
  status.textContent = enabled ? "Setting is on." : "Setting is off.";
}
