# web-extensions-samples

## Overview

This repository contains basic examples of how to implement useful functionalities for the development of web extensions.

Every folder is a standalone Manifest V3 extension that demonstrates a single feature, with no build step and no dependencies: load the folder and it runs.

The structure used in these examples is based on Chrome for Developers documentation.

For further documentation, please refer to the following link:

https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/

## Motivation

I have created this repository to store basic examples of useful functionalities for the development of web extensions.

## Technologies

- Javascript
- HTML
- CSS

## Browser support

The examples target **Chrome and Opera**, which share the same extension engine.

**Firefox is not drop-in compatible.** Its Manifest V3 implementation differs in ways that stop most of these folders from loading as they are:

- `background.service_worker` is ignored; Firefox expects `background.scripts`.
- `browser_specific_settings.gecko.id` is required.
- APIs live under the `browser` namespace and return promises instead of taking callbacks.
- `chrome.sidePanel` does not exist (Firefox uses `sidebar_action`), and `chrome.offscreen` and `chrome.identity.getProfileUserInfo` have no equivalent.

The [cross-browser](cross-browser/) example shows the manifest layout and the API shim that make one codebase run on all three.

## Examples

### Extension surfaces

| Example | What it shows |
| --- | --- |
| [popup](popup/) | Display a popup when clicking the extension icon and persist its state. |
| [action-onclicked](action-onclicked/) | React to the toolbar icon directly, with no popup at all. |
| [options-page](options-page/) | A dedicated options page saving preferences with `chrome.storage.sync`. |
| [side-panel](side-panel/) | Show a persistent UI in the browser side panel (`chrome.sidePanel`). |
| [badge](badge/) | Show and update text/color over the toolbar icon. |
| [context-menu](context-menu/) | Add options to the right-click context menu. |
| [omnibox](omnibox/) | Add an address-bar keyword (`chrome.omnibox`). |
| [keyboard-shortcuts](keyboard-shortcuts/) | Run actions with a keyboard shortcut (`chrome.commands`). |

### Background and messaging

| Example | What it shows |
| --- | --- |
| [background-service-worker](background-service-worker/) | Handle browser lifecycle and tab events from a service worker, keeping state in storage. |
| [message-passing](message-passing/) | One-shot messages between popup, content script and service worker. |
| [long-lived-ports](long-lived-ports/) | An open two-way channel with `chrome.runtime.connect`. |
| [offscreen](offscreen/) | Use DOM APIs the service worker lacks, through an offscreen document. |
| [alarms](alarms/) | Schedule tasks with `chrome.alarms` (MV3 `setInterval` replacement). |

### Acting on pages

| Example | What it shows |
| --- | --- |
| [content-script](content-script/) | Inject an interactive bar into any page and modify its DOM. |
| [scripting](scripting/) | Inject code and CSS on demand with `chrome.scripting` + `activeTab`. |
| [web-request-blocking](web-request-blocking/) | Block or redirect requests with `declarativeNetRequest`. |
| [fetch-api](fetch-api/) | Call an external API and show the result in the popup. |

### Browser data

| Example | What it shows |
| --- | --- |
| [storage](storage/) | Save data persistently with `chrome.storage.local`. |
| [tabs](tabs/) | List the open tabs and open new ones (`chrome.tabs`). |
| [bookmarks](bookmarks/) | Read and create bookmarks (`chrome.bookmarks`). |
| [downloads](downloads/) | Start downloads and follow their progress (`chrome.downloads`). |
| [identity](identity/) | Read the signed-in profile, plus OAuth reference (`chrome.identity`). |

### Notifications and polish

| Example | What it shows |
| --- | --- |
| [notification](notification/) | Show a native system notification. |
| [custom.notification](custom.notification/) | Show a custom HTML notification window. |
| [i18n](i18n/) | Translate the extension with `_locales` and `chrome.i18n`. |
| [cross-browser](cross-browser/) | One codebase that runs on Chrome, Opera and Firefox. |

## How to load an example

1. Open `chrome://extensions` in Chrome (or `opera://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the folder of the example you want to try.

To load an example in Firefox, open `about:debugging#/runtime/this-firefox` and choose **Load Temporary Add-on**, then select its `manifest.json`. Read the [Browser support](#browser-support) section first.

## Validating the examples

A dependency-free script checks every folder: that each `manifest.json` parses and declares MV3, that every file it references exists, that pages carry no inline scripts (which the MV3 CSP blocks), and that no JavaScript file was left empty.

```bash
npm run validate
```

It runs on every push and pull request through GitHub Actions.

## License

[MIT](LICENSE).
