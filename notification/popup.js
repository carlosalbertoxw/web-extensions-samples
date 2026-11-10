// chrome.notifications shows a notification drawn by the operating system. The
// extension only chooses the text and the icon; for full control over the
// layout see the "custom-notification" example.

document.getElementById("show").addEventListener("click", () => {
  // Each id must be unique: creating a notification with the id of one that is
  // still visible replaces it instead of showing a second one.
  chrome.notifications.create(`notification-${Date.now()}`, {
    type: "basic",
    iconUrl: "images/icon-48.png",
    title: "Hello from the extension",
    message: "This is a native system notification.",
  });
});
