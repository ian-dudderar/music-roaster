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

const avatar = sessionStorage.getItem("avatar");
const grade = sessionStorage.getItem("grade");
const token = sessionStorage.getItem("token");

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

  getContent();

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // const button = document.getElementById("try-again");
  // button.classList.add("fade");
  // button.disabled = false;
}

async function getContent() {
  fetch(`response2?token=${token}`).then((res) => {
    res.json().then((data) => {
      // const loader = document.querySelector(".loading-container");
      // loader.style.display = "none";
      hydratePage(data);
    });
  });
}

async function thinking() {
  const prompts = [fake_prompts[1], fake_prompts[7]];
  await sleep(3000);
  textDelay(prompts);
}

function hydratePage(data) {
  const { images, textRes } = data;
  // const main = document.querySelector("main");
  // const div = document.createElement("div");
  // div.classList.add("response");
  // main.appendChild(div);
  // textDelay(textRes);
  thinking();
  displayImages(images);
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
