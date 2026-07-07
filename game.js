const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

const menu = document.getElementById("menu");
const gameOver = document.getElementById("gameOver");
const scoreText = document.getElementById("scoreText");

const bird = new Image();
bird.src = "irem.PNG";

let birdX = 90;
let birdY = 300;
let birdSize = 80;

let gravity = 0.6;
let velocity = 0;

let pipes = [];
let score = 0;
let bestScore = Number(localStorage.getItem("bestScore") || 0);

let playing = false;


function startGame(){

    menu.style.display="none";
    canvas.style.display="block";
    gameOver.style.display="none";

    birdY=300;
    velocity=-8;
    pipes=[];
    score=0;

    createPipe();

    playing=true;

    loop();
}


function restartGame(){
    startGame();
}


function jump(){
    if(playing){
        velocity=-8;
    }
}


document.addEventListener("mousedown",jump);
document.addEventListener("touchstart",jump);



function createPipe(){

    let gap=250;
    let top=Math.random()*250+50;

    pipes.push({
        x:400,
        top:top,
        bottom:top+gap
    });

}



function drawBird(){

    ctx.drawImage(
        bird,
        birdX,
        birdY,
        birdSize,
        birdSize
    );

}



function drawPipes(){

    ctx.fillStyle="#ff8fc6";

    pipes.forEach(p=>{

        ctx.fillRect(
            p.x,
            0,
            70,
            p.top
        );


        ctx.fillRect(
            p.x,
            p.bottom,
            70,
            700-p.bottom
        );

    });

}function update(){

    velocity += gravity;
    birdY += velocity;


    pipes.forEach(p=>{

        p.x -= 3;


        if(
            birdX + birdSize > p.x &&
            birdX < p.x + 70 &&
            (
                birdY < p.top ||
                birdY + birdSize > p.bottom
            )
        ){

            endGame();

        }


        if(!p.passed && p.x + 70 < birdX){

            p.passed=true;
            score++;

        }

    });


    pipes = pipes.filter(p=>p.x > -100);


    if(
        pipes.length===0 ||
        pipes[pipes.length-1].x < 220
    ){

        createPipe();

    }



    if(birdY < 0 || birdY + birdSize > canvas.height){

        endGame();

    }

}



function drawScore(){

    ctx.fillStyle="white";
    ctx.font="bold 40px Arial";
    ctx.textAlign="center";

    ctx.fillText(
        score,
        200,
        60
    );

}



function endGame(){

    playing=false;


    if(score>bestScore){

        bestScore=score;

        localStorage.setItem(
            "bestScore",
            bestScore
        );

    }


    scoreText.textContent =
        score+" | En Yüksek: "+bestScore;


    gameOver.style.display="block";

}




function loop(){

    if(!playing) return;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    update();

    drawPipes();

    drawBird();

    drawScore();


    requestAnimationFrame(loop);

}



window.startGame=startGame;
window.restartGame=restartGame;
