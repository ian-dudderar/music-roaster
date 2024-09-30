const fake_prompts = [
  "Hmm...",
  "Interesting...",
  "I see...",
  "I’m noticing some interesting influences in your selections...",
  "I’m detecting a common theme here...",
  "Let me dive deeper into your preferences...",
  "I'm picking up on some cool trends... just kidding...",
  "Sorting through your 'music'... if you can call it that...",
  "Running your tunes through my vibe-o-meter... not looking good...",
];

const fake_images = [
  "https://i.scdn.co/image/ab67616d0000b273c9fec49c8930fb10e4756dfe",
  "https://i.scdn.co/image/ab67616d0000b273f239a45be61917fd61898241",
  "https://i.scdn.co/image/ab67616d0000b273583ce664168dca88fdc1c4c1",
  "https://i.scdn.co/image/ab67616d0000b273310909bc20d587f8792a7039",
  "https://i.scdn.co/image/ab67616d0000b273adfadf345224340773549507",
  "https://i.scdn.co/image/ab67616d0000b27306596cef717cbdce8b874778",
  "https://i.scdn.co/image/ab67616d0000b2736b405be80472a13cd4b2e80b",
  "https://i.scdn.co/image/ab67616d0000b2732a1073dd2629bffca89c2288",
  "https://i.scdn.co/image/ab67616d0000b273904234ebed6cf856b54f9861",
  "https://i.scdn.co/image/ab67616d0000b273a8bcf8fac8520ac2cbf72ea7",
];

// Used to determine which option the user selected
const grade = sessionStorage.getItem("grade");
const avatar = sessionStorage.getItem("avatar");
const token = sessionStorage.getItem("token");
const playlistId = sessionStorage.getItem("playlistId");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function initializePage() {
  if (avatar) {
    const avatarContainer = document.getElementById("avatar");
    const avatarImg = document.createElement("img");
    avatarImg.src = avatar;
    avatarContainer.appendChild(avatarImg);
  }

  const header = document.getElementById("header");
  grade === "true"
    ? (header.textContent = "Rate my Playlist")
    : (header.textContent = "Roast my Spotify");

  // loading();

  getContent(grade);

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // const button = document.getElementById("try-again");
  // button.classList.add("fade");
  // button.disabled = false;
}

async function loading() {
  loadingImages(fake_images);
}

async function loadingImages(imgs) {
  const container = document.querySelector(".loading-container");
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");
  container.prepend(imageContainer);
  for (const img of imgs) {
    const image = document.createElement("img");
    image.src = img;
    imageContainer.appendChild(image);
  }
  const images = document.querySelectorAll(".image-container img");
  let count = 0;
  while (true) {
    if (count === images.length) {
      count = 0;
    }
    images[count].classList.add("entering");
    await new Promise((resolve) => setTimeout(resolve, 300));
    images[count].classList.remove("entering");
    images[count].classList.add("exiting");
    await new Promise((resolve) => setTimeout(resolve, 300));
    count++;
  }
}

async function getContent(grade) {
  // let playlistId = null;
  console.log("GET CONTENT GRADE: ", grade);
  fetch(
    `response2?token=${token}&grade=${grade}&playlistId=${playlistId}`
  ).then((res) => {
    res.json().then((data) => {
      hydratePage(data, grade);
    });
  });
}

async function thinking() {
  const prompts = [fake_prompts[1], fake_prompts[7]];
  await sleep(3000);
  textDelay(prompts);
}

async function hydratePage(data, grade) {
  const loader = document.querySelector(".loading-container");
  loader.classList.add("exiting");
  await sleep(1000);
  loader.style.display = "none";
  const { images, textRes } = data;
  const div = document.querySelector(".response");
  div.style.display = "flex";
  const footer = document.getElementById("footer");
  footer.style.opacity = "100%";

  // textDelay(textRes);
  textDisplay(textRes);
  displayImages(images);
  await sleep(2000);
  displayButton();
  if (grade === "true") {
    console.log(typeof grade);
    console.log("hydrating grade");
    generateStars(div);
  } else {
    console.log("Not grade");
  }
}

function textDisplay(text_array) {
  const response = document.querySelector(".response");
  // paragraph.textContent = textRes;
  for (let text of text_array) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    document.querySelector(".response").appendChild(paragraph);
  }
}

async function displayImages(imgs) {
  const response = document.querySelector(".response");
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");
  response.prepend(imageContainer);
  for (const img of imgs) {
    const image = document.createElement("img");
    image.src = img;
    imageContainer.appendChild(image);
  }
  const images = document.querySelectorAll(".image-container img");
  let count = 0;
  while (true) {
    if (count === images.length) {
      count = 0;
    }
    images[count].classList.add("entering");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    images[count].classList.remove("entering");
    images[count].classList.add("exiting");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    count++;
  }
}

function generateStars(div) {
  const starContainer = document.getElementById("star-container");
  starContainer.style.display = "flex";
  const stars = document.querySelectorAll(".star");
  let visibleStars = 0;

  function activateStars(count) {
    if (visibleStars < count) {
      // positionStars(visibleStars + 1);
      stars[visibleStars].classList.add("active", "animate");
      visibleStars++;
      setTimeout(() => activateStars(count), 500);
    }
  }

  activateStars(2);
}

function displayButton() {
  const footer = document.getElementById("footer");
  const button = document.getElementById("try-again");
  footer.style.opacity = "100%";
  button.classList.add("fade");
  button.disabled = false;
}

async function textDelay(text_array) {
  let i = 1;

  // Only uses the blinking cursor if there is more text to follow
  let useCursor = true;
  for (let text of text_array) {
    if (i != text_array.length) {
      text = text + "..";
    } else {
      useCursor = false;
    }
    //Creates the element for the response text and passes them both to the typewriter effect
    const paragraph = document.createElement("p");
    document.querySelector(".response").appendChild(paragraph);

    //Creates the blinking cursor element, then deletes it before the next cycle
    let cursor = await textTypewriterEffect(paragraph, text, useCursor);
    await sleep(4000);
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
      return resolve(cursor);
    } else {
      //Slightly randomizes the speed of the typewriter
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

function onSubmit() {
  sessionStorage.setItem("grade", false);
  window.location.href = "/callback";
}

document.addEventListener("DOMContentLoaded", initializePage);
