addEventListener('load', init);

let currentWord = document.querySelector("#current-word");
let scoreDisplay = document.querySelector("#score");
let timeDisplay = document.querySelector("#time");
let message = document.querySelector("#message");
let easyBtn = document.querySelector("#easy");
let mediumBtn = document.querySelector("#medium");
let hardBtn = document.querySelector("#hard");
let nbrMistakesC = document.querySelector("#nbr-mistakes");
let currentLevelC = document.querySelector("#current-level");
let currentWordContainer = document.querySelector("#current-word-container");


let nbrMistakes = 0;
let levels = {
    "easy": {seconds: 5, wordLength: 5},
    "medium": {seconds: 3, wordLength: 8},
    "hard": {seconds: 2, wordLength: 12},
}
let words = [];
let currentLevel = levels.easy;
let timer = currentLevel.seconds;
let isPlaying = false;
let score = 0;
let wordToCompare = '';

easyBtn.addEventListener("click", () => {
    if (!isPlaying) {
        currentLevel = levels.easy;
        timer = currentLevel.seconds;
    }}
);
mediumBtn.addEventListener("click", () => {
    if (!isPlaying) {
        currentLevel = levels.medium;
        timer = currentLevel.seconds;
    }}
);
hardBtn.addEventListener("click", () => {
    if (!isPlaying) {
        currentLevel = levels.hard;
        timer = currentLevel.seconds;
    }}
);

async function init() {
    try {
        const res = await fetch("https://random-word-api.herokuapp.com/all");
        words = await res.json();
        let randIndex = Math.floor(Math.random() * words.length);
        console.log(currentLevel.wordLength);
        while (words[randIndex].length > currentLevel.wordLength) {
            randIndex = Math.floor(Math.random() * words.length);
        }
        currentWord.textContent = words[randIndex];
        scoreDisplay.textContent = `${score}`;
        setInterval(countdown, 1000);
        setInterval(checkGameStatus, 50);
    } catch(err) {
        console.log(err.message);
    }
}

currentWordContainer.addEventListener('keyup', (ev) => {
    startMatch(ev.key);
});

function generateWords() {
    let randIndex = Math.floor(Math.random() * words.length);
    while (words[randIndex].length > currentLevel.wordLength) {
        randIndex = Math.floor(Math.random() * words.length);
    }
    currentWord.textContent = words[randIndex];
    console.log("word length : ", currentWord.textContent.length);
    isPlaying = true;
    wordToCompare = "";
    i = 0;
    message.textContent = "";
    timer = currentLevel.seconds;
    score++;
    scoreDisplay.textContent = `${score}`;
}

addEventListener("input", startMatch);

function startMatch(key) {
    console.log(key)
    if (matchWords(key)) {
        console.log("CORRECT!!");
        generateWords();
    }
    else {
        console.log("WRONG!!");
    }
}
function matchWords(key) {
    let colorChar = '';
    if (key == "Backspace")
        wordToCompare = wordToCompare.slice(0, -1);
    else
        wordToCompare += key;
    console.log("string after slicing :", wordToCompare);
    for (let i = 0; i < currentWord.textContent.length; i++)  {
        if (i < wordToCompare.length) {
            if (wordToCompare.charAt(i) === currentWord.textContent.charAt(i))
                colorChar += `<span class="text-green-500">${currentWord.textContent.charAt(i)}</span>`;
            else {
                colorChar += `<span class="text-red-500">${currentWord.textContent.charAt(i)}</span>`;
                nbrMistakes++;
            }
        }
        else {
            colorChar += `<span class="text-white">${currentWord.textContent.charAt(i)}</span>`;
        }
    }
    currentWord.innerHTML = colorChar;
    if (wordToCompare === currentWord.textContent)
        return (true);
    else
        return (false);
}

function countdown() {
    if (isPlaying && timer > 0)
        timer--;
    if (timer == 0)
        isPlaying = false;
}

function checkGameStatus() {
    timeDisplay.textContent = timer;
    nbrMistakesC.textContent = nbrMistakes;
    if (currentLevel.seconds == 5)
        currentLevelC.textContent = "Easy";
    else if (currentLevel.seconds == 3)
        currentLevelC.textContent = "Medium";
    else if (currentLevel.seconds == 2)
        currentLevelC.textContent = "Hard";
    if (!isPlaying && timer == 0) {
        message.textContent = "Game Over";
        nbrMistakes = 0;
        score = 0;
    }
}
