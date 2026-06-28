// chrome.i18n.getMessage returns the string for the current browser language,
// reading it from the _locales/<lang>/messages.json file. If there is no folder
// for the user's language, the default_locale (en) is used as a fallback.

document.getElementById("title").textContent = chrome.i18n.getMessage("extName");
document.getElementById("greeting").textContent = chrome.i18n.getMessage("greeting");
