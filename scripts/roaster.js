const fake_res = [
  "Lorem ipsum odor amet, consectetuer adipiscing elit. Suspendisse tortor ac aliquet; mattis ipsum at venenatis? Porttitor rhoncus vestibulum litora fringilla vitae porttitor laoreet. Fames ultricies ac nulla, scelerisque habitant ligula. Erat viverra ornare interdum posuere dis dui. Tortor ac mauris nullam elit pulvinar tempus. Cubilia eu turpis risus per mauris.",
  "Placerat praesent non proin vulputate tincidunt penatibus duis tristique. Est laoreet justo erat fringilla tristique lacinia quisque suspendisse. Purus eu est duis; quis nostra pharetra natoque fusce. Ultricies commodo sit parturient justo luctus; cursus congue torquent. Nec nullam erat mi rutrum sodales dapibus. Accumsan iaculis arcu habitasse euismod aliquet integer diam nisl. Rutrum augue pulvinar mi ac phasellus vehicula. Lectus donec nisl netus ante pharetra facilisi luctus fermentum inceptos. Dolor ac orci risus vehicula sagittis integer.",
  "Sagittis magnis taciti urna viverra litora facilisi. Ullamcorper gravida molestie augue morbi potenti. Sem velit mollis placerat metus feugiat eleifend. Fusce felis purus at urna montes vivamus lobortis morbi. Sed venenatis vel mauris bibendum pretium torquent vel. In malesuada torquent integer, mollis amet scelerisque natoque ullamcorper. Vitae lacinia egestas finibus amet magna nullam venenatis!",
];

// textDelay(res);
onLoad();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function onLoad() {
  const token = sessionStorage.getItem("token");
  const avatar = sessionStorage.getItem("avatar");
  if (avatar) {
    const avatarContainer = document.querySelector(".user-avatar");
    const avatarImg = document.createElement("img");
    avatarImg.src = avatar;
    avatarContainer.appendChild(avatarImg);
  }
  fetch(`/response2?token=${token}`).then((res) => {
    res.json().then((data) => {
      console.log(data);
      // const loader = document.querySelector(".progress-bar");
      // loader.style.display = "none";
      const prompt = document.querySelector(".loading-container");
      prompt.style.display = "none";
      const res = document.querySelector(".response-container");
      res.style.display = "flex";
      initializeImages(data.response);
      fakeRes();
      // textDelay(fake_res);
    });
  });
}

function fakeRes() {
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

  const prompts = [fake_prompts[1], fake_prompts[7]];
  textDelay(prompts);
}

function initializeImages(images) {
  // const imageContainer = document.createElement("div");
  const imageContainer = document.querySelector(".imagecontainer");
  // imageContainer.classList.add("imagecontainer");
  // document.querySelector(".container").appendChild(imageContainer);
  // const imageContainer = document.querySelector(".imagecontainer");
  for (const image of images) {
    let img = document.createElement("img");
    img.src = image;
    imageContainer.appendChild(img);
  }
  fadeImages(imageContainer);
}

async function fadeImages(imageContainer) {
  const images = document.querySelectorAll(".imagecontainer img");
  let count = 0;
  while (true) {
    if (count === images.length) {
      count = 0;
    }
    images[count].classList.add("entering");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    images[count].classList.remove("entering");
    images[count].classList.add("exiting");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    count++;
  }
}

// populateSlider(albums);

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
    document.querySelector(".text-response").appendChild(paragraph);

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
