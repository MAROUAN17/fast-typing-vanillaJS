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
let words = [];
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

async function init() {
    try {
        const res = await fetch("https://random-word-api.herokuapp.com/all");
        words = await res.json();
        seconds.textContent = `you have ${currentLevel} seconds to type the word`;
        let randIndex = Math.floor(Math.random() * words.length);
        currentWord.textContent = words[randIndex];
        scoreDisplay.textContent = `score : ${score}`;
        setInterval(countdown, 1000);
        setInterval(checkGameStatus, 50);
    } catch(err) {
        console.log(err.message);
    }
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
    let colorChar = '';
    for (let i = 0; i < currentWord.textContent.length; i++)  {
        console.log(i);
        if (i < wordInput.value.length) {
            if (wordInput.value.charAt(i) === currentWord.textContent.charAt(i))
                colorChar += `<span class="text-green-500">${currentWord.textContent.charAt(i)}</span>`;
            else
                colorChar += `<span class="text-red-500">${currentWord.textContent.charAt(i)}</span>`;
        }
        else {
            colorChar += `<span class="text-white">${currentWord.textContent.charAt(i)}</span>`;
        }
    }
    currentWord.innerHTML = colorChar;
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
