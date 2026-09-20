#!/usr/bin/env node
// Validates every example folder without installing any dependency.
// Checks that each manifest.json parses, that every file it references exists,
// that the HTML pages only load scripts/styles that are present, and that no
// JavaScript file was left empty. Run it with: npm run validate
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const errors = [];
const warnings = [];
let checkedFiles = 0;

function fail(example, message) {
  errors.push(`${example}: ${message}`);
}

function warn(example, message) {
  warnings.push(`${example}: ${message}`);
}

// Verifies a path referenced from a manifest or an HTML page really exists.
function expectFile(example, dir, relative, origin) {
  const target = path.join(dir, relative);
  checkedFiles += 1;
  if (!fs.existsSync(target)) {
    fail(example, `${origin} references "${relative}", which does not exist`);
    return false;
  }
  if (path.extname(target) === ".js" && fs.statSync(target).size === 0) {
    fail(example, `"${relative}" is empty`);
    return false;
  }
  return true;
}

function validateManifest(example, dir) {
  const manifestPath = path.join(dir, "manifest.json");
  let manifest;

  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    fail(example, `manifest.json is not valid JSON (${error.message})`);
    return null;
  }

  if (manifest.manifest_version !== 3) {
    fail(example, `manifest_version is ${manifest.manifest_version}, expected 3`);
  }
  for (const field of ["name", "version", "description"]) {
    if (!manifest[field]) {
      fail(example, `manifest.json is missing "${field}"`);
    }
  }

  const from = "manifest.json";
  if (manifest.background && manifest.background.service_worker) {
    expectFile(example, dir, manifest.background.service_worker, from);
  }
  // Firefox reads background.scripts where Chrome reads background.service_worker.
  for (const file of (manifest.background || {}).scripts || []) {
    expectFile(example, dir, file, from);
  }
  if (manifest.action && manifest.action.default_popup) {
    expectFile(example, dir, manifest.action.default_popup, from);
  }
  if (manifest.options_ui && manifest.options_ui.page) {
    expectFile(example, dir, manifest.options_ui.page, from);
  }
  if (manifest.side_panel && manifest.side_panel.default_path) {
    expectFile(example, dir, manifest.side_panel.default_path, from);
  }
  for (const entry of manifest.content_scripts || []) {
    for (const file of [...(entry.js || []), ...(entry.css || [])]) {
      expectFile(example, dir, file, from);
    }
  }
  for (const size of ["16", "32", "48", "128"]) {
    if (!manifest.icons || !manifest.icons[size]) {
      warn(example, `manifest.json has no ${size}px icon`);
    } else {
      expectFile(example, dir, manifest.icons[size], from);
    }
  }
  for (const resource of (manifest.declarative_net_request || {}).rule_resources || []) {
    if (expectFile(example, dir, resource.path, from)) {
      try {
        JSON.parse(fs.readFileSync(path.join(dir, resource.path), "utf8"));
      } catch (error) {
        fail(example, `${resource.path} is not valid JSON (${error.message})`);
      }
    }
  }
  for (const entry of manifest.web_accessible_resources || []) {
    for (const file of entry.resources || []) {
      if (!file.includes("*")) {
        expectFile(example, dir, file, from);
      }
    }
  }

  // Localized extensions must ship the folder named by default_locale.
  const localized = String(manifest.name).startsWith("__MSG_");
  if (localized && !manifest.default_locale) {
    fail(example, "manifest.json uses __MSG_ placeholders but has no default_locale");
  }
  if (manifest.default_locale) {
    expectFile(example, dir, path.join("_locales", manifest.default_locale, "messages.json"), from);
  }

  return manifest;
}

// Extension pages cannot use inline scripts under the MV3 CSP, so every page
// must point at a real file.
function validateHtml(example, dir) {
  for (const file of fs.readdirSync(dir)) {
    if (path.extname(file) !== ".html") {
      continue;
    }
    const html = fs.readFileSync(path.join(dir, file), "utf8");

    if (!/<html[^>]*\slang=/i.test(html)) {
      warn(example, `${file} has no lang attribute on <html>`);
    }
    if (!/<title>/i.test(html)) {
      warn(example, `${file} has no <title>`);
    }
    if (/<script(?![^>]*\ssrc=)[^>]*>[\s\S]*?\S[\s\S]*?<\/script>/i.test(html)) {
      fail(example, `${file} contains an inline <script>, which the MV3 CSP blocks`);
    }

    for (const match of html.matchAll(/<script[^>]*\ssrc=["']([^"']+)["']/gi)) {
      if (!/^https?:/i.test(match[1])) {
        expectFile(example, dir, match[1], file);
      }
    }
    for (const match of html.matchAll(/<link[^>]*\shref=["']([^"']+)["']/gi)) {
      if (!/^https?:/i.test(match[1])) {
        expectFile(example, dir, match[1], file);
      }
    }
  }
}

// Every messages.json must define the same keys as the default locale.
function validateLocales(example, dir, manifest) {
  const localesDir = path.join(dir, "_locales");
  if (!manifest || !manifest.default_locale || !fs.existsSync(localesDir)) {
    return;
  }
  const defaultFile = path.join(localesDir, manifest.default_locale, "messages.json");
  if (!fs.existsSync(defaultFile)) {
    return;
  }
  const expected = Object.keys(JSON.parse(fs.readFileSync(defaultFile, "utf8")));

  for (const locale of fs.readdirSync(localesDir)) {
    const file = path.join(localesDir, locale, "messages.json");
    if (locale === manifest.default_locale || !fs.existsSync(file)) {
      continue;
    }
    let messages;
    try {
      messages = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
      fail(example, `_locales/${locale}/messages.json is not valid JSON (${error.message})`);
      continue;
    }
    for (const key of expected) {
      if (!messages[key]) {
        fail(example, `_locales/${locale}/messages.json is missing the key "${key}"`);
      }
    }
  }
}

const examples = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
  .map((entry) => entry.name)
  .filter((name) => name !== "scripts" && name !== "node_modules")
  .sort();

for (const example of examples) {
  const dir = path.join(root, example);
  if (!fs.existsSync(path.join(dir, "manifest.json"))) {
    fail(example, "folder has no manifest.json");
    continue;
  }
  const manifest = validateManifest(example, dir);
  validateHtml(example, dir);
  validateLocales(example, dir, manifest);
}

for (const warning of warnings) {
  console.log(`warning  ${warning}`);
}
for (const error of errors) {
  console.error(`error    ${error}`);
}

console.log(
  `\n${examples.length} examples checked, ${checkedFiles} referenced files verified, ` +
    `${errors.length} errors, ${warnings.length} warnings.`
);

process.exit(errors.length > 0 ? 1 : 0);
