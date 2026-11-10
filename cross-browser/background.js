// Loaded as a service worker by Chrome and as a background script by Firefox.
// Nothing here may assume which one it is.

import { api, engine } from "./browser-api.js";

api.runtime.onInstalled.addListener(async () => {
  await api.storage.local.set({ engine, installedAt: new Date().toISOString() });
  console.log(`Installed on ${engine}.`);
});
