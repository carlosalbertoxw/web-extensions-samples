// The popup hands an HTML string to the service worker. The worker cannot parse
// it on its own, so it opens an offscreen document to do the work.

const SAMPLE_HTML = `
  <html>
    <head><title>A sample document</title></head>
    <body>
      <h1>Heading</h1>
      <h2>Subheading</h2>
      <p><a href="#one">One</a> <a href="#two">Two</a> <a href="#three">Three</a></p>
      <img src="a.png"><img src="b.png">
    </body>
  </html>`;

const result = document.getElementById("result");
const parseButton = document.getElementById("parse");

parseButton.addEventListener("click", async () => {
  result.textContent = "Parsing...";
  parseButton.disabled = true;

  try {
    const stats = await chrome.runtime.sendMessage({
      action: "parseHtml",
      html: SAMPLE_HTML,
    });
    if (stats.error) {
      throw new Error(stats.error);
    }

    result.replaceChildren();
    for (const [label, value] of Object.entries(stats)) {
      const line = document.createElement("div");
      line.textContent = `${label}: ${value}`;
      result.append(line);
    }
  } catch (error) {
    result.textContent = `Could not parse the document: ${error.message}`;
  } finally {
    parseButton.disabled = false;
  }
});
