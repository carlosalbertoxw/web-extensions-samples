// The three differences that break a Chrome extension on Firefox:
//
//   1. The namespace. Firefox exposes `browser`; Chrome exposes `chrome`.
//      (Recent Chrome also defines `browser`, so `chrome` is the safer probe.)
//   2. The return value. Firefox returns promises; Chrome's older signatures
//      take a callback. Chrome has returned promises for most APIs since 88,
//      but not for every one of them.
//   3. The manifest. Firefox MV3 ignores background.service_worker and wants
//      background.scripts, and it requires browser_specific_settings.gecko.id.
//      The manifest in this folder declares both keys: each browser reads the
//      one it understands and ignores the other. Chrome logs a warning
//      about the unused background.scripts key; the extension still loads.
//
// In production the usual answer to 1 and 2 is Mozilla's official polyfill:
//
//   npm install webextension-polyfill
//   <script src="browser-polyfill.js"></script>   (before your own scripts)
//
// It is not vendored here so the examples stay dependency-free. The shim below
// covers the same ground for the handful of calls this example makes.

const native = globalThis.chrome ?? globalThis.browser;

export const runtime = native.runtime;

// promisify() wraps a callback-style API so the caller can always `await` it,
// whichever browser is running. If the API already returned a promise (Firefox,
// and modern Chrome) that promise is passed straight through.
function promisify(fn, thisArg) {
  return (...args) =>
    new Promise((resolve, reject) => {
      const maybePromise = fn.call(thisArg, ...args, (result) => {
        const error = native.runtime.lastError;
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      });

      // Firefox ignored the callback and returned a promise instead.
      if (maybePromise && typeof maybePromise.then === "function") {
        maybePromise.then(resolve, reject);
      }
    });
}

export const storage = {
  get: promisify(native.storage.local.get, native.storage.local),
  set: promisify(native.storage.local.set, native.storage.local),
};

export const engine = globalThis.browser && !globalThis.chrome ? "Firefox" : "Chromium";
