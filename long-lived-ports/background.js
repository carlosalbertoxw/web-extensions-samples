// sendMessage (see the "message-passing" example) is a one-shot request and a
// single reply. A port is the other half of the API: an open channel that both
// sides can push through as many times as they like, until one of them
// disconnects.
//
// Ports are the right tool when the worker has to *stream* something back, or
// when a conversation has several steps. They also keep the service worker
// alive while they are open, which is the only supported way to do so.

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "ticker") {
    return;
  }

  let tick = 0;
  port.postMessage({ type: "hello", message: "Port opened by the service worker." });

  // Push a message every second without the popup asking for it. This is what a
  // one-shot sendMessage cannot do.
  const interval = setInterval(() => {
    tick += 1;
    port.postMessage({ type: "tick", tick });
  }, 1000);

  // Fires when the other end closes, which for a popup means the moment it
  // loses focus. Always clean up here or the timer leaks.
  port.onDisconnect.addListener(() => {
    clearInterval(interval);
    console.log(`Port closed after ${tick} ticks.`);
  });

  // The channel is two-way: the popup can talk back over the same port.
  port.onMessage.addListener((message) => {
    if (message.type === "reset") {
      tick = 0;
      port.postMessage({ type: "tick", tick });
    }
  });
});
