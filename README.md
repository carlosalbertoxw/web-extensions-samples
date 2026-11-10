# web-extensions-samples

## Overview

This repository contains basic examples of how to implement useful functionalities for the development of web extensions.

Every example folder is a standalone Manifest V3 extension that demonstrates a single feature, with no build step and no dependencies: load the folder and it runs. The only other folders are `scripts/`, which holds the validator, and `.github/`.

The structure used in these examples is based on the Chrome for Developers documentation. For further documentation, start with the [Hello World tutorial](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) and the [API reference](https://developer.chrome.com/docs/extensions/reference/api).

### Inside an example

Each folder uses the same file names, so they are easy to compare:

| File | Role |
| --- | --- |
| `manifest.json` | Declares the extension, its permissions and the minimum Chrome version its APIs need. |
| `background.js` | The service worker: reacts to browser events with no UI of its own. |
| `popup.html` / `popup.js` | The page shown when clicking the toolbar icon. |
| `images/` | The 16, 32, 48 and 128 px icons. |

Pages that only some examples have (`options.html`, `sidepanel.html`, `offscreen.html`, `content.js`...) are named after the surface they implement. Every JavaScript file opens with a comment that explains what it shows and why it is written that way.

## Motivation

I have created this repository to store basic examples of useful functionalities for the development of web extensions.

## Technologies

- JavaScript
- HTML
- CSS

## Browser support

The examples target **Chrome, Edge and Opera**, which share the Chromium extension engine. Every API call uses promises, and each `manifest.json` declares the `minimum_chrome_version` its APIs need.

**Firefox is not drop-in compatible.** Its Manifest V3 implementation differs in ways that stop most of these folders from loading as they are:

- `background.service_worker` is ignored; Firefox expects `background.scripts`.
- `browser_specific_settings.gecko.id` is required.
- Its own namespace is `browser`. Firefox also defines `chrome` as an alias, so the promise-based calls used here run as they are, but neither name can be used to detect the engine.
- `chrome.sidePanel` does not exist (Firefox uses `sidebar_action`), and `chrome.offscreen` and `chrome.identity.getProfileUserInfo` have no equivalent.

The [cross-browser](cross-browser/) example shows the manifest layout and the small module that make one codebase run on all of them.

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
| [custom-notification](custom-notification/) | Show a custom HTML notification window. |
| [i18n](i18n/) | Translate the extension with `_locales` and `chrome.i18n`. |
| [cross-browser](cross-browser/) | One codebase that runs on Chromium browsers and Firefox. |

## How to load an example

1. Open `chrome://extensions` in Chrome (`edge://extensions` in Edge, `opera://extensions` in Opera).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the folder of the example you want to try.

To load an example in Firefox, open `about:debugging#/runtime/this-firefox` and choose **Load Temporary Add-on**, then select its `manifest.json`. Read the [Browser support](#browser-support) section first.

## Validating the examples

A dependency-free script checks every folder: that each `manifest.json` parses and declares MV3, that every file it references exists, that pages carry no inline scripts (which the MV3 CSP blocks), that every JavaScript file compiles, and that code using `chrome.action` finds an `action` key in its manifest. It needs Node 22 or later.

```bash
npm run validate
```

It runs on every push and pull request through GitHub Actions, together with a CodeQL analysis. Dependabot proposes updates to the workflow actions once a month.

## License

[MIT](LICENSE).
