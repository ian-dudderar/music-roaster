var playlists = [];
async function initializePage() {
    document.getElementById("image").src =
        sessionStorage.getItem("playlistPhoto");
    loadStars();
}

function loadStars() {
    const starContainer = document.getElementById("star-container");
    const stars = document.querySelectorAll(".star");
    let visibleStars = 0;

    function fetchRandomNumber() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Math.floor(Math.random() * 5) + 1);
            }, 1000);
        });
    }

    function positionStars(count) {
        const starWidth = 48;
        const gap = 8;
        const totalWidth = count * starWidth + (count - 1) * gap;
        const startPosition = (starContainer.offsetWidth - totalWidth) / 2;

        for (let i = 0; i < count; i++) {
            // const position = startPosition + i * (starWidth + gap);
            // stars[i].style.left = `${position}px`;
        }
    }

    function activateStars(count) {
        if (visibleStars < count) {
            // positionStars(visibleStars + 1);
            stars[visibleStars].classList.add("active", "animate");
            visibleStars++;
            setTimeout(() => activateStars(count), 500);
        }
    }

    fetchRandomNumber().then((count) => {
        activateStars(5);
    });
}

// document.addEventListener("DOMContentLoaded", loadStars);
document.addEventListener("DOMContentLoaded", initializePage);