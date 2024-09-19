var playlists = [];
const fakeres = [
  "Hac feugiat cubilia curae aliquam vehicula diam. Primis nec enimcommodo sapien sagittis fermentum magna. Fermentum vulputate velitturpis pharetra cras euismod. Eget metus pharetra cursus pretium duis venenatis. Senectus vel hendrerit felis, himenaeos mollis finibus. Dignissim porttitor ridiculus ligula tellus ante morbi id elementum primis. Dolor proin mi hendrerit ultricies in felis. Feugiat cras odio tristique; rutrum taciti parturient quis hac. Viverra auctor rhoncus metus; imperdiet diam dui taciti? Lacus phasellus pellentesque tempor scelerisque vestibulum nascetur tincidunt?",
];
async function initializePage() {
  document.getElementById("image").src =
    sessionStorage.getItem("playlistPhoto");
  loadStars();
  textDelay(fakeres);
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

async function textDelay(text_array) {
  console.log("textdelay");
  let i = 1;
  let useCursor = true;
  for (let text of text_array) {
    if (i != text_array.length) {
      text = text + "..";
    } else {
      useCursor = false;
    }
    //Creates the element for the response text and passes them both to the typewriter effect
    const paragraph = document.createElement("p");
    document.querySelector(".rating-text").appendChild(paragraph);

    //Creates a blinking cursor element, then deletes it before the next cycle
    let cursor = await textTypewriterEffect(paragraph, text, useCursor);
    await sleep(2000);
    if (useCursor) paragraph.removeChild(cursor);
    i++;
  }
}

// Function to simulate typewriter effect
function textTypewriterEffect(element, text, useCursor, i = 0) {
  return new Promise((resolve) => {
    element.textContent += text[i];
    element.scrollIntoView();
    if (i === text.length - 1) {
      // Create a blinking cursor element and appends it
      const cursor = document.createElement("span");
      cursor.classList.add("cursor");
      cursor.innerHTML = "|";
      if (useCursor) element.appendChild(cursor);
      // element.appendChild(cursor);
      return resolve(cursor);
    } else {
      //Slightly randomizes the speed of the typewriter
      // return setTimeout(
      //   () =>
      //     resolve(textTypewriterEffect(element, text, useCursor, i + 1)),
      //   Math.floor(Math.random() * (30 - 0 + 1) + 0)
      // );
      return setTimeout(
        () => resolve(textTypewriterEffect(element, text, useCursor, i + 1)),
        Math.floor(Math.random() * (70 - 40 + 1) + 40)
      );
      // return resolve(
      //   textTypewriterEffect(element, text, useCursor, i + 1)
      // );
    }
  });
}

function onRetry() {
  sessionStorage.setItem("grade", false);
  window.location.href = `/callback`;
}

// document.addEventListener("DOMContentLoaded", loadStars);
document.addEventListener("DOMContentLoaded", initializePage);
