// A content script runs in the context of the web page the user is visiting.
// It can read and modify that page's DOM. This script injects a bar at the top
// of every page and adds buttons that change the page visually.

(function () {
  // Avoid injecting the bar twice if the script runs again.
  if (document.getElementById("cs-sample-bar")) {
    return;
  }

  const bar = document.createElement("div");
  bar.id = "cs-sample-bar";
  bar.innerHTML = `
    <strong>Injected by the Content script extension</strong>
    <button id="cs-highlight">Highlight links</button>
    <button id="cs-darkmode">Toggle dark mode</button>
    <button id="cs-close">Close</button>
  `;

  document.documentElement.appendChild(bar);

  // Highlight every link on the page so the user can see the DOM being modified.
  let highlighted = false;
  document.getElementById("cs-highlight").addEventListener("click", () => {
    highlighted = !highlighted;
    document.querySelectorAll("a").forEach((link) => {
      link.classList.toggle("cs-sample-highlight", highlighted);
    });
  });

  // Invert the page colors as a quick "dark mode" demonstration.
  let dark = false;
  document.getElementById("cs-darkmode").addEventListener("click", () => {
    dark = !dark;
    document.documentElement.style.filter = dark ? "invert(1) hue-rotate(180deg)" : "";
  });

  document.getElementById("cs-close").addEventListener("click", () => {
    bar.remove();
  });
})();
