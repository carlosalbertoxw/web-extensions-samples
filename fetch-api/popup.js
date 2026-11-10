// An extension can call external HTTP APIs with the standard fetch(). The API's
// domain must be listed under "host_permissions" in the manifest.

const REQUEST_TIMEOUT_MS = 8000;

const status = document.getElementById("status");
const photo = document.getElementById("photo");
const loadButton = document.getElementById("load");

async function loadDog() {
  status.textContent = "Loading...";
  photo.removeAttribute("src");
  loadButton.disabled = true;

  try {
    // fetch() has no timeout of its own: without one a hung connection would
    // leave the popup saying "Loading..." forever. AbortSignal.timeout aborts
    // the request with a "TimeoutError" once the time is up.
    const response = await fetch("https://dog.ceo/api/breeds/image/random", {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    // fetch only rejects on network errors, so an HTTP 404 or 500 arrives here
    // as a perfectly resolved promise and has to be checked explicitly.
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    photo.src = data.message; // The API returns the image URL in "message".
    photo.alt = "A random dog";
    status.textContent = "";
  } catch (error) {
    status.textContent =
      error.name === "TimeoutError"
        ? "The request took too long."
        : "Could not load the image.";
    console.error(error);
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadDog);

// Load one automatically when the popup opens.
loadDog();
