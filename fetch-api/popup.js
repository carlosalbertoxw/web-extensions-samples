// An extension can call external HTTP APIs with the standard fetch(). The API's
// domain must be listed under "host_permissions" in the manifest.

const status = document.getElementById("status");
const photo = document.getElementById("photo");

async function loadDog() {
  status.textContent = "Loading...";
  photo.removeAttribute("src");

  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await response.json();
    photo.src = data.message; // The API returns the image URL in "message".
    status.textContent = "";
  } catch (error) {
    status.textContent = "Could not load the image.";
    console.error(error);
  }
}

document.getElementById("load").addEventListener("click", loadDog);

// Load one automatically when the popup opens.
loadDog();
