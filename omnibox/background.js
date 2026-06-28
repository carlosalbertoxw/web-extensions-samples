// The omnibox API lets the extension react to text typed in the address bar
// after its keyword. Type the keyword ("ext") followed by a space to activate it.

const SITES = {
  docs: "https://developer.chrome.com/docs/extensions",
  github: "https://github.com",
  mdn: "https://developer.mozilla.org",
};

// Update the suggestions shown as the user types.
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const suggestions = Object.keys(SITES)
    .filter((key) => key.startsWith(text.toLowerCase()))
    .map((key) => ({
      content: key,
      description: `Open ${key} → ${SITES[key]}`,
    }));
  suggest(suggestions);
});

// Handle the final input when the user presses Enter.
chrome.omnibox.onInputEntered.addListener((text) => {
  const url = SITES[text.toLowerCase()] || `https://www.google.com/search?q=${encodeURIComponent(text)}`;
  chrome.tabs.update({ url });
});

// Hint shown when the keyword is active.
chrome.omnibox.setDefaultSuggestion({
  description: "Type docs, github or mdn (or any text to search Google)",
});
