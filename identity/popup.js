// chrome.identity covers two very different things:
//
//   1. getProfileUserInfo — who is signed into this Chrome profile. No network
//      call, no consent screen, no OAuth setup. This is what the example runs.
//   2. getAuthToken / launchWebAuthFlow — a real OAuth 2.0 token for calling an
//      API as the user. Those need an OAuth client registered with a provider,
//      so they are shown below as commented reference code rather than run.

const email = document.getElementById("email");
const id = document.getElementById("id");
const status = document.getElementById("status");

// "identity.email" is what makes the email field non-empty; with only
// "identity" the object comes back with blank strings.
chrome.identity.getProfileUserInfo({ accountStatus: "ANY" }, (info) => {
  if (!info.email) {
    status.textContent = "No account is signed into this Chrome profile.";
    return;
  }
  email.textContent = info.email;
  id.textContent = info.id;
  status.textContent = "";
});

// --- OAuth reference (not executed) --------------------------------------
//
// For a Google API, add to the manifest:
//
//   "oauth2": {
//     "client_id": "<id>.apps.googleusercontent.com",
//     "scopes": ["https://www.googleapis.com/auth/userinfo.profile"]
//   }
//
// then request a token. Chrome shows the consent screen and caches the result:
//
//   const { token } = await chrome.identity.getAuthToken({ interactive: true });
//   const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//
// For a non-Google provider use launchWebAuthFlow instead, and register
// chrome.identity.getRedirectURL() as the redirect URI:
//
//   const redirectUrl = await chrome.identity.launchWebAuthFlow({
//     url: authorizeUrl,
//     interactive: true,
//   });
