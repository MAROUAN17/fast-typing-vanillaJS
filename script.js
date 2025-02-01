addEventListener('load', init);

let currentSentenceC = document.querySelector("#current-sentence");
let wpmDisplay = document.querySelector("#words-per-min");
let timeDisplay = document.querySelector("#time");
let message = document.querySelector("#message");
let easyBtn = document.querySelector("#easy");
let mediumBtn = document.querySelector("#medium");
let hardBtn = document.querySelector("#hard");
let nbrMistakesC = document.querySelector("#nbr-mistakes");
let currentAccuracy = document.querySelector("#current-accuracy");
let currentWordsContainer = document.querySelector("#current-word-container");
let openModalBtn = document.querySelector("#open-modal-btn");
let closeModalBtn = document.querySelector("#close-modal-btn");
let modalItem = document.querySelector("#finish-modal");
let resutlMessage = document.querySelector("#message-result");
let typeSpeed = document.querySelector("#speed-type");
let accuracyRateC = document.querySelector("#accuracy-display");
let tryAgainBtn = document.querySelector("#tryagain-btn");

closeModalBtn.addEventListener("click", () => {
    modalItem.classList.add("hidden");
})

tryAgainBtn.addEventListener("click", init);

let nbrMistakes = 0;
let words = [];
let timer = 60;
let isPlaying = false;
let score = 0;
let wordToCompare = '';
let nbrWordsTyped = 0;
let currentSentence = "";
let correctChar = 0;
let wpm = 0;
let accuracy = 0;

async function init() {
    try {
        const res = await fetch("https://random-word-api.herokuapp.com/all");
        words = await res.json();
        let randIndex = Math.floor(Math.random() * words.length);
        let i = 0;
        while (i < 20) {
            if (words[randIndex].length < 7) {
                currentSentence += words[randIndex];
                if (i != 19)
                    currentSentence += " ";
                i++;
            }
            randIndex = Math.floor(Math.random() * words.length);
        }
        currentSentenceC.textContent = currentSentence;
        wpmDisplay.textContent = `${score}`;
        setInterval(countdown, 1000);
        setInterval(checkGameStatus, 50);
    } catch(err) {
        console.log(err.message);
    }
}

currentWordsContainer.addEventListener('keyup', (ev) => {
    matchWords(ev.key);
});


addEventListener("input", startMatch);

function tryAgain() {
    modalItem.classList.add("hidden");
    accuracy = 0;
    wpm = 0;
    let i = 0;
    while (i < 20) {
        if (words[randIndex].length < 7) {
            currentSentence += words[randIndex];
            if (i != 19)
                currentSentence += " ";
            i++;
        }
        randIndex = Math.floor(Math.random() * words.length);
    }
    currentSentenceC.textContent = currentSentence;
    wpmDisplay.textContent = `${score}`;
}

function matchWords(key) {
    isPlaying = true;
    let colorChar = '';
    let incorrect = false;
    if (key == "Backspace")
        wordToCompare = wordToCompare.slice(0, -1);
    else
        wordToCompare += key;
    for (let i = 0; i < currentSentenceC.textContent.length; i++)  {
        if (i < wordToCompare.length) {
            if (wordToCompare.charAt(i) === currentSentenceC.textContent.charAt(i))
                colorChar += `<span class="text-green-500">${currentSentenceC.textContent.charAt(i)}</span>`;
            else {
                colorChar += `<span class="text-red-500">${currentSentenceC.textContent.charAt(i)}</span>`;
                if (key != "Backspace")
                    incorrect = true;
            }
            nbrWordsTyped++;
        }
        else
            colorChar += `<span class="text-white">${currentSentenceC.textContent.charAt(i)}</span>`;
    }
    if (incorrect)
        nbrMistakes++;
    currentSentenceC.innerHTML = colorChar;
    if (wordToCompare === currentSentenceC.textContent)
        return (true);
    else
        return (false);
}

function calculateWPM() {
    let elapsedTime = 60 - timer;
    if (wordToCompare.length > 0)
        return (Math.round(((wordToCompare.length)  / 5) / (elapsedTime / 60)));
    else
        return (0);
}

function calculateAccuracy() {
    let correctChar = 0;
    if (wordToCompare.length > 0) {
        for(let i = 0 ; i < wordToCompare.length; i++) {
            if (wordToCompare.charAt(i) === currentSentence.charAt(i))
                correctChar++;
        }
        let accuracyRate = (correctChar / wordToCompare.length) * 100;
        return (Math.round(accuracyRate));
    }
    else
        return (0);
}

function countdown() {
    if (isPlaying === true && timer > 0)
        timer--;
}

function checkGameStatus() {
    wpm = calculateWPM();
    accuracy = calculateAccuracy();
    timeDisplay.textContent = timer;
    nbrMistakesC.textContent = nbrMistakes;
    wpmDisplay.textContent = wpm;
    currentAccuracy.textContent = accuracy;
    currentAccuracy.textContent = calculateAccuracy();
    if (!isPlaying && timer == 0) {
        nbrMistakes = 0;
        score = 0;
    }
    if (isPlaying === true && (timer == 0 || wordToCompare.length == currentSentence.length)) {
        isPlaying = false;
        modalItem.classList.remove("hidden");
        if (wpm < 20)
            resutlMessage.textContent = "You're Slow As Hell!";
        else if (wpm > 20 && wpm < 50)
            resutlMessage.textContent = "Not That Bad!";
        else if (wpm > 50)
            resutlMessage.textContent = "You Type very Fast!";
        typeSpeed.textContent = `${wpm}`
        accuracyRateC.textContent = `${accuracy}%`
    }
}
