// The three differences that break a Chrome extension on Firefox:
//
//   1. The namespace. Firefox exposes `browser`; Chrome has always exposed
//      `chrome` and also defines `browser` since Chrome 148. Firefox defines
//      `chrome` too, as an alias, so neither name tells the engines apart.
//   2. The return value. In Manifest V3 both engines return promises, so the
//      callback-versus-promise gap that once needed a polyfill is gone for the
//      calls this example makes.
//   3. The manifest. Firefox MV3 ignores background.service_worker and wants
//      background.scripts, and it requires browser_specific_settings.gecko.id.
//      The manifest in this folder declares both keys: each browser reads the
//      one it understands and ignores the other. Chrome only accepts the pair
//      since version 121, which is why the manifest asks for it.
//
// For a larger codebase that also targets older engines, Mozilla's
// webextension-polyfill covers the remaining gaps. It is not used here so the
// examples stay dependency-free.

export const api = globalThis.browser ?? globalThis.chrome;

// runtime.getBrowserInfo only exists in Firefox, which makes it a reliable probe
// where the namespace names are not.
export const engine = typeof api.runtime.getBrowserInfo === "function" ? "Firefox" : "Chromium";
