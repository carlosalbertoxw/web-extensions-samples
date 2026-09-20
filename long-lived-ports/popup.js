// The popup opens the port as soon as it loads. When the popup is destroyed
// (it closes on blur) the port disconnects on its own and the worker is told.

const log = document.getElementById("log");
const counter = document.getElementById("counter");

const port = chrome.runtime.connect({ name: "ticker" });

port.onMessage.addListener((message) => {
  if (message.type === "tick") {
    counter.textContent = message.tick;
  }
  append(message.type === "tick" ? `tick ${message.tick}` : message.message);
});

port.onDisconnect.addListener(() => {
  append("Port closed.");
});

// Send a message back up the same channel.
document.getElementById("reset").addEventListener("click", () => {
  port.postMessage({ type: "reset" });
  append("Sent reset to the service worker.");
});

function append(text) {
  const line = document.createElement("div");
  line.textContent = text;
  log.prepend(line);
}
