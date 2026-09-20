// The popup uses the same shim, so this file is identical on every browser.

import { storage, engine } from "./browser-api.js";

const engineField = document.getElementById("engine");
const countField = document.getElementById("count");

engineField.textContent = engine;

// One await, no callbacks, on both engines.
document.getElementById("increment").addEventListener("click", async () => {
  const { openCount = 0 } = await storage.get({ openCount: 0 });
  await storage.set({ openCount: openCount + 1 });
  countField.textContent = openCount + 1;
});

const { openCount = 0 } = await storage.get({ openCount: 0 });
countField.textContent = openCount;
