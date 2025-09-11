const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log("Connected!"));

let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"]; // array of btn classes

let started = false;
let level = 0;

let h2 = document.querySelector("h2"); // to show levels

// Start game on key press
document.addEventListener("keypress", function () {
  if (started === false) {
    console.log("game started!");
    started = true;
    levelUp();
  }
});

// Flash for game sequence
function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(function () {
    btn.classList.remove("flash");
  }, 400);
}

// Flash when user clicks
function userFlash(btn) {
  btn.classList.add("userFlash");
  setTimeout(function () {
    btn.classList.remove("userFlash");
  }, 250);
}

// Level up
function levelUp() {
  userSeq = [];
  level++;
  h2.innerText = `Level ${level}`;

  let randIdx = Math.floor(Math.random() * 4); // FIXED: should be *4 not *3
  let randColor = btns[randIdx];
  let randBtn = document.querySelector(`.${randColor}`);
  gameSeq.push(randColor);

  // Flash the chosen button
  gameFlash(randBtn);

  console.log("Game sequence:", gameSeq);
}

// Check answer
function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 1000);
    }
  } else {
    console.log("GAME OVER!");
    h2.innerHTML = `GAME OVER! <b>Your Score: ${level}</b><br>Press any key to start again.`;
    document.querySelector("body").style.backgroundColor = "#D0342C";
    setTimeout(function () {
      document.querySelector("body").style.backgroundColor = "#1a1a2e";
    }, 1000);
    reset();
  }
}

// Button press by user
function btnPress() {
  let btn = this;
  userFlash(btn);

  let userColor = btn.getAttribute("id");
  userSeq.push(userColor);

  checkAns(userSeq.length - 1);
}

// Add click listeners
let allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
  btn.addEventListener("click", btnPress);
}

// Reset game
function reset() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
}
let message = document.getElementById("message");

function showMessage(text) {
  message.innerText = text;
}
// Start game
document.addEventListener("keypress", function () {
  if (started === false) {
    started = true;
    showMessage("Watch closely!"); // show when game starts
    levelUp();
  }
});

function levelUp() {
  userSeq = [];
  level++;
  h2.innerText = `Level ${level}`;

  showMessage("Watch closely!");

  let randIdx = Math.floor(Math.random() * 4);
  let randColor = btns[randIdx];
  let randBtn = document.querySelector(`.${randColor}`);
  gameSeq.push(randColor);

  // Flash the chosen button
  setTimeout(() => {
    gameFlash(randBtn);
    // After flashing, tell user it's their turn
    setTimeout(() => showMessage("Your turn! Repeat the sequence"), 600);
  }, 500);

  console.log("Game sequence:", gameSeq);
}

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      showMessage("Good job! Get ready for next level");
      setTimeout(levelUp, 1000);
    }
  } else {
    h2.innerHTML = `GAME OVER! <b>Your Score: ${level}</b><br>Press any key to start again.`;
    showMessage(""); // clear message
    document.querySelector("body").style.backgroundColor = "#D0342C";
    setTimeout(function () {
      document.querySelector("body").style.backgroundColor = "#1a1a2e";
    }, 1000);
    reset();
  }
}
