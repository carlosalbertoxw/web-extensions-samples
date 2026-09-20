// chrome.i18n.getMessage returns the string for the current browser language,
// reading it from the _locales/<lang>/messages.json file. If there is no folder
// for the user's language, the default_locale (en) is used as a fallback.

// Instead of naming every element by id, the page marks what it wants
// translated with data-i18n="<message key>". The same three lines then localize
// a page of any size, which is how it is normally done in a real extension.
for (const element of document.querySelectorAll("[data-i18n]")) {
  const message = chrome.i18n.getMessage(element.dataset.i18n);
  if (message) {
    element.textContent = message;
  }
}

// getUILanguage reports the language the browser UI is running in, which is the
// one used to pick the _locales folder.
document.documentElement.lang = chrome.i18n.getUILanguage();
document.getElementById("language").textContent = chrome.i18n.getUILanguage();
