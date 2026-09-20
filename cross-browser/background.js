// Loaded as a service worker by Chrome and as a background script by Firefox.
// Nothing here may assume which one it is.

import { runtime, storage, engine } from "./browser-api.js";

runtime.onInstalled.addListener(async () => {
  await storage.set({ engine, installedAt: new Date().toISOString() });
  console.log(`Installed on ${engine}.`);
});
