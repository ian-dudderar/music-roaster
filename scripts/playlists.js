var playlists = [];
async function onLoad() {
  const avatar = sessionStorage.getItem("avatar");
  if (avatar) {
    const avatarContainer = document.querySelector(".user-avatar");
    const avatarImg = document.createElement("img");
    avatarImg.src = avatar;
    avatarContainer.appendChild(avatarImg);
  }

  fetch(`/get-playlists?token=${sessionStorage.getItem("token")}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.response);
      playlists = data.response;
    })
    .then(() => initializePage());
}

let selectedPlaylist = null;

function onSubmit() {
  console.log("submitting");
  window.location.href = `/grade?playlist=${selectedPlaylist.id}`;
}

function createPlaylistItem(playlist) {
  const playlistItem = document.createElement("button");
  playlistItem.className = "playlist-item";
  playlistItem.dataset.id = playlist.id;

  const coverHtml = `
                <div class="playlist-cover">
                    <img src=${playlist.image.url} alt="${playlist.name} cover">
                </div>
            `;

  playlistItem.innerHTML = `
                ${coverHtml}
                <div class="playlist-name">${playlist.name}</div>
                <div class="playlist-tracks">${playlist.tracks} tracks</div>
            `;

  playlistItem.addEventListener("click", () => selectPlaylist(playlist));

  return playlistItem;
}

function selectPlaylist(playlist) {
  var id = playlist.id;
  var playlistPhoto = playlist.image.url;
  sessionStorage.setItem("playlistPhoto", playlistPhoto);
  const previousSelected = document.querySelector(
    ".playlist-item.selected"
  );
  if (previousSelected) {
    previousSelected.classList.remove("selected");
    previousSelected.querySelector(".selected-overlay")?.remove();
  }

  const newSelected = document.querySelector(
    `.playlist-item[data-id="${id}"]`
  );
  if (newSelected) {
    newSelected.classList.add("selected");
    const overlay = document.createElement("div");
    overlay.className = "selected-overlay";
    overlay.innerHTML = '<div class="checkmark"></div>';
    newSelected.querySelector(".playlist-cover").appendChild(overlay);
  }

  selectedPlaylist = playlist;
  updateGradeButton();
}

function updateGradeButton() {
  const gradeButton = document.getElementById("gradeButton");
  gradeButton.disabled = !selectedPlaylist;
}

function initializePage() {
  const playlistGrid = document.getElementById("playlistGrid");
  playlists.forEach((playlist) => {
    playlistGrid.appendChild(createPlaylistItem(playlist));
  });
}

document.addEventListener("DOMContentLoaded", onLoad);