// const intro = [
//     "Welcome to your personalized Spotify rating experience. Discover how your music taste aligns with the world.",
//     "Our advanced algorithm analyzes your listening habits and compares them to millions of other users.",
// ];

// // const intro = ["Welcome to your personalized ", "Spotify rating experience", ". Discover how your music taste aligns with the world."]

// function sleep(ms) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// }

// // textDelay(intro);

// async function textDelay(text_array) {
//     for (const text of text_array) {
//         //Creates the element for the response text and passes them both to the typewriter effect
//         const paragraph = document.createElement("p");
//         document.querySelector(".text").appendChild(paragraph);

//         //Creates a blinking cursor element, then deletes it before the next cycle
//         let cursor = await textTypewriterEffect(paragraph, text);
//         await sleep(2000);
//         paragraph.removeChild(cursor);
//     }
//     var link = document.querySelector(".link");
//     var button = document.createElement("button");
//     button.classList.add("enter-button");
//     link.appendChild(button);
// }

// // Function to simulate typewriter effect
// function textTypewriterEffect(element, text, i = 0) {
//     return new Promise((resolve) => {
//         element.textContent += text[i];
//         element.scrollIntoView();
//         if (i === text.length - 1) {
//             // Create a blinking cursor element and appends it
//             const cursor = document.createElement("span");
//             cursor.classList.add("cursor");
//             cursor.innerHTML = "|";
//             element.appendChild(cursor);
//             return resolve(cursor);
//         } else {
//             //Slightly randomizes the speed of the typewriter
//             return setTimeout(
//                 () => resolve(textTypewriterEffect(element, text, i + 1)),
//                 Math.floor(Math.random() * (30 - 0 + 1) + 0)
//             );
//             // return resolve(textTypewriterEffect(element, text, i + 1));
//         }
//     });
// }


