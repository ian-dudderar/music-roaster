const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");
const state = urlParams.get("state");
const token = sessionStorage.getItem("token");

async function initializePage() {
  if (token) {
    return;
  }
  fetch(`/main?code=${code}&state=${state}`).then((res) => {
    res.json().then((data) => {
      sessionStorage.setItem("token", data.response.token);
      sessionStorage.setItem("avatar", data.response.profileImg);
    });
  });
}

function onClick() {
  sessionStorage.setItem("grade", false);
}

document.addEventListener("DOMContentLoaded", initializePage);
