// The popup imports the same module, so this file is identical on every browser.

import { api, engine } from "./browser-api.js";

const engineField = document.getElementById("engine");
const countField = document.getElementById("count");

engineField.textContent = engine;

// One await, no callbacks, on both engines.
document.getElementById("increment").addEventListener("click", async () => {
  const { openCount } = await api.storage.local.get({ openCount: 0 });
  await api.storage.local.set({ openCount: openCount + 1 });
  countField.textContent = openCount + 1;
});

const { openCount } = await api.storage.local.get({ openCount: 0 });
countField.textContent = openCount;
