# web-extensions-samples

## Overview

This repository contains basic examples of how to implement useful functionalities for the development of web extensions.

The structure used in these examples is based on Chrome for Developers documentation, but can also work for Opera and Firefox.

For further documentation, please refer to the following link:

https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/

## Motivation

I have created this repository to store basic examples of useful functionalities for the development of web extensions.

## Technologies

- Javascript
- HTML
- CSS

## Examples

Each folder is a standalone extension that demonstrates a single feature.

| Example | What it shows |
| --- | --- |
| [popup](popup/) | Display a popup when clicking the extension icon. |
| [storage](storage/) | Save data persistently with `chrome.storage.local`. |
| [notification](notification/) | Show a native system notification. |
| [custom.notification](custom.notification/) | Show a custom HTML notification window. |
| [content-script](content-script/) | Inject an interactive bar into any page and modify its DOM. |
| [background-service-worker](background-service-worker/) | Handle browser lifecycle and tab events from a service worker, keeping state in storage. |
| [message-passing](message-passing/) | Communicate between popup, content script and background service worker. |
| [context-menu](context-menu/) | Add options to the right-click context menu. |
| [keyboard-shortcuts](keyboard-shortcuts/) | Run actions with a keyboard shortcut (`chrome.commands`). |
| [tabs](tabs/) | List the open tabs and open new ones (`chrome.tabs`). |
| [options-page](options-page/) | A dedicated options page saving preferences with `chrome.storage.sync`. |
| [badge](badge/) | Show and update text/color over the toolbar icon. |
| [alarms](alarms/) | Schedule tasks with `chrome.alarms` (MV3 setInterval replacement). |
| [side-panel](side-panel/) | Show a persistent UI in the browser side panel (`chrome.sidePanel`). |
| [omnibox](omnibox/) | Add an address-bar keyword (`chrome.omnibox`). |
| [web-request-blocking](web-request-blocking/) | Block or redirect requests with `declarativeNetRequest`. |
| [i18n](i18n/) | Translate the extension with `_locales` and `chrome.i18n`. |
| [fetch-api](fetch-api/) | Call an external API and show the result in the popup. |

## How to load an example

1. Open `chrome://extensions` in Chrome (or `opera://extensions` / `about:debugging` in Firefox).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the folder of the example you want to try.
