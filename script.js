addEventListener('load', init);


let wordInput = document.querySelector("#word-input");
let currentWord = document.querySelector("#current-word");
let scoreDisplay = document.querySelector("#score");
let timeDisplay = document.querySelector("#time");
let message = document.querySelector("#message");
let seconds = document.querySelector("#seconds");
let easyBtn = document.querySelector("#easy");
let mediumBtn = document.querySelector("#medium");
let hardBtn = document.querySelector("#hard");


let levels = {
    "easy": 5,
    "medium": 3,
    "hard": 2,
}
let currentLevel = levels.easy;
let timer = currentLevel;
let isPlaying = false;
let score = 0;

easyBtn.addEventListener("click", () => {
    if(!isPlaying) {
        currentLevel = levels.easy;
        timer = currentLevel;
    }}
);
mediumBtn.addEventListener("click", () => {
    if(!isPlaying) {
        currentLevel = levels.medium;
        timer = currentLevel;
    }}
);
hardBtn.addEventListener("click", () => {
    if(!isPlaying) {
        currentLevel = levels.hard;
        timer = currentLevel;
    }}
);

const words = [
    'hat',
    'river',
    'lucky',
    'generate',
    'statue',
];

function init() {
    seconds.textContent = `you have ${currentLevel} seconds to type the word`;
    let randIndex = Math.floor(Math.random() * words.length);
    currentWord.textContent = words[randIndex];
    scoreDisplay.textContent = `score : ${score}`;
    setInterval(countdown, 1000);
    setInterval(checkGameStatus, 50);
}

function generateWords() {
    let randIndex = Math.floor(Math.random() * words.length);
    currentWord.textContent = words[randIndex];
    isPlaying = true;
    wordInput.value = "";
    message.textContent = "";
    timer = currentLevel;
    score++;
    scoreDisplay.textContent = `score : ${score}`;
}

addEventListener("input", startMatch);

function startMatch() {
    if (matchWords()) {
        console.log("CORRECT!!");
        generateWords();
    }
    else {
        console.log("WRONG!!");
    }
}

function matchWords() {
    if (wordInput.value === currentWord.textContent)
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
    seconds.textContent = `you have ${currentLevel} seconds to type the word`;
    if (!isPlaying && timer == 0) {
        message.textContent = "Game Over";
        score = 0;
    }
}
