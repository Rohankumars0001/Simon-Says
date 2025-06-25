let gameSeq = [];
let userSeq = [];
let btns = ["yellow","red", "purple", "green"];  // array of btn classes

let started = false;
let level = 0;

let h2 = document.querySelector("h2"); //to show levels

document.addEventListener("keypress", function(){ //to start game 
    if(started === false){
    console.log("game started!");
    started = true;
    levelup(); //calling func to level up if started is true
    }
});

function gameFlash(btn){
    btn.classList.add("flash");  // adding to class where the background color changes when flashing
    setTimeout(function(){
        btn.classList.remove("flash");  // and removing as soon as flashed by setting timer
}, 250);
}

function userFlash(btn){
    btn.classList.add("userFlash");  // adding to class where the background color changes when flashing
    setTimeout(function(){
        btn.classList.remove("userFlash");  // and removing as soon as flashed by setting timer
}, 250);
}

function levelup(){
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;  // level increase and showing it

    let randIdx = Math.floor(Math.random()*3);  // generating random number to btn flash 
    let randColor = btns[randIdx]; // picking a color name in array using randIdx
    let randBtn = document.querySelector(`.${randColor}`);  // selecting or accessing the btn named on this class "randomly selected class"
    gameSeq.push(randColor);
    gameFlash(randBtn); // flashing
    console.log(gameSeq);

}

//----------------------------------------USER INTE---------------------------------------
function checkAns(idx){

  if ( userSeq[idx] === gameSeq[idx]){
   if(userSeq.length == gameSeq.length){
   setTimeout(levelup, 1000);
}
}else{
    console.log("GAME OVER!");
    h2.innerHTML = `GAME OVER! <b> YOUR SCORE${level}</b> <br> Press any key to start again.`;
    document.querySelector("body").style.backgroundColor = "#D0342C";
    setTimeout(function(){
        document.querySelector("body").style.backgroundColor = "#C0BBB2";
    },1000);
    reset();
  }
}


function btnPress(){
    let btn = this;
    userFlash(btn);

    userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for(btn of allBtns){
    btn.addEventListener("click", btnPress);
}

function reset(){
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}


