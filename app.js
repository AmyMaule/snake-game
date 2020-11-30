let board = document.getElementById("game-board");
let width = 24;
let height = 24;
let boardSquares = [];
let snakeSquares = [];
let allSquares = width*height;
let currentSnake = [];
let movingRight = true;
let movingLeft = false;
let movingUp = false;
let movingDown = false;
let gameOver = false;
let playAgainButton = document.getElementById("gameover");
let startButton = document.querySelector("#start-btn");
let gameStarted = false;
let makeInterval;
let scoreBoard = document.querySelector("#score");
let score = 0;
let highscoreboard = document.querySelector("#highscore");
const isStorage = "undefined" !== typeof localStorage;
let highscore;

document.addEventListener("keydown", function(e) {
    e.preventDefault();
});

if (isStorage && JSON.parse(localStorage.getItem("highscore"))) {
    highscore = JSON.parse(localStorage.getItem("highscore"));
        if (highscore > score) {
        highscoreboard.innerText = `High score: ${highscore}`;
        }
    } else if(JSON.parse(localStorage.getItem("highscore")) == null) {
        highscore = 0;
        highscoreboard.innerText = `High score: 0`;
}

let changeScore = () => {
    if (score < JSON.parse(localStorage.getItem("highscore"))) highscore = JSON.parse(localStorage.getItem("highscore"));
    if (currentSnake.length <= 4) {
        score = 0;
    } else if (currentSnake.length > 4) {
        score = (currentSnake.length - 4) * 100;
    }
    scoreBoard.innerText = `Score: ${score}`;
    if (score > highscore) highscoreboard.innerText = `High score: ${score}`;
};

let createBoard = squares => {
    for (let i = 0; i < allSquares; i++) {
        const square = document.createElement("div");
        square.dataset.id = i;
        square.classList.add("board-square");
        if (i > 551 || i%24 == 0 || (i+1)%24 ==0 || i < 24) {
            square.classList.add("empty");
        }
        board.appendChild(square);
        squares.push(square);
    }
};
createBoard(boardSquares);

let howManySnakeSquares = () => {
    boardSquares.forEach((square)=>{
        if(square.classList.contains("snake")) {
            snakeSquares.push(square);
        }
    });
};
howManySnakeSquares();

let spawnSnake = () => {
    currentSnake.push(boardSquares[251], boardSquares[250], boardSquares[249], boardSquares[248]);
    currentSnake.forEach(square => square.classList.add("snake"));
};
spawnSnake();

let spawnApple = () => {
    changeScore();
    let randomSquare = Math.floor(Math.random() * allSquares);
    if(boardSquares[randomSquare].classList.contains("snake") || boardSquares[randomSquare].classList.contains("empty")) {
        spawnApple();
    } else {
        boardSquares[randomSquare].classList.add("apple");
    }
};
spawnApple();

let moveRight = () => {
    let snake0 = parseInt(currentSnake[0].dataset.id);
    if (movingUp && boardSquares[snake0+1].classList.contains("empty")) endGame();
    if (movingDown && boardSquares[snake0+1].classList.contains("empty")) endGame();
    snakeTouchesSnake();
    if (snakeTouchesLRWall() || movingLeft) return;
    if (!gameOver) {
    let currentHead = parseInt(currentSnake[0].dataset.id);
    let newHead = currentHead+1;
    currentSnake.unshift(boardSquares[newHead]);
    currentSnake[0].classList.add("snake");
    if (!currentSnake[0].classList.contains("apple")) {
        currentSnake[currentSnake.length-1].classList.remove("snake");
        currentSnake.pop();
     } else {
         currentSnake[0].classList.remove("apple");
         spawnApple();
     }
     movingDown = false;
     movingLeft = false;
     movingUp = false;
     movingRight = true;
    }
};

let moveDown = () => {
    let snake0 = parseInt(currentSnake[0].dataset.id);
    if (movingLeft && boardSquares[snake0+24].classList.contains("empty")) endGame();
    if (movingRight && boardSquares[snake0+24].classList.contains("empty")) endGame();
    snakeTouchesSnake();
    if (snakeTouchesUDWall() || movingUp) return;
    if (!gameOver) {
    let currentHead = parseInt(currentSnake[0].dataset.id);
    let newHead = currentHead+24;
    currentSnake.unshift(boardSquares[newHead]);
    currentSnake[0].classList.add("snake");
    if (!currentSnake[0].classList.contains("apple")) {
        currentSnake[currentSnake.length-1].classList.remove("snake");
        currentSnake.pop();
     } else {
        currentSnake[0].classList.remove("apple");
        spawnApple();
    }
    movingDown = true;
    movingLeft = false;
    movingUp = false;
    movingRight = false;
    }
};

let moveUp = () => {
    let snake0 = parseInt(currentSnake[0].dataset.id);
    if (movingLeft && boardSquares[snake0-24].classList.contains("empty")) endGame();
    if (movingRight && boardSquares[snake0-24].classList.contains("empty")) endGame();
    snakeTouchesSnake();
    if (snakeTouchesUDWall() || movingDown) return;
    if (!gameOver) {
    let currentHead = parseInt(currentSnake[0].dataset.id);
    let newHead = currentHead-24;
    currentSnake.unshift(boardSquares[newHead]);
    currentSnake[0].classList.add("snake");
    if (!currentSnake[0].classList.contains("apple")) {
        currentSnake[currentSnake.length-1].classList.remove("snake");
        currentSnake.pop();
     } else {
        currentSnake[0].classList.remove("apple");
        spawnApple();
    }
    movingDown = false;
    movingLeft = false;
    movingUp = true;
    movingRight = false;
    }
};

let moveLeft = () => {
    let snake0 = parseInt(currentSnake[0].dataset.id);
    if (movingUp && boardSquares[snake0-1].classList.contains("empty")) endGame();
    if (movingDown && boardSquares[snake0-1].classList.contains("empty")) endGame();
    snakeTouchesSnake();
    if (snakeTouchesLRWall() || movingRight) return;
    if (!gameOver) {
    let currentHead = parseInt(currentSnake[0].dataset.id);
    let newHead = currentHead-1;
    currentSnake.unshift(boardSquares[newHead]);
    currentSnake[0].classList.add("snake");
    if (!currentSnake[0].classList.contains("apple")) {
       currentSnake[currentSnake.length-1].classList.remove("snake");
       currentSnake.pop();
    } else {
        currentSnake[0].classList.remove("apple");
        spawnApple();
    }
    movingDown = false;
    movingLeft = true;
    movingUp = false;
    movingRight = false;
    }
};

let snakeDirection = e => {
    let direction = e.keyCode;
    if (direction === 37) moveLeft();
    if (direction === 38) moveUp();
    if (direction === 39) moveRight();
    if (direction === 40) moveDown();
};

let moveSnake = () => {
    if (movingRight) moveRight();
    if (movingLeft) moveLeft();
    if (movingUp) moveUp();
    if (movingDown) moveDown();
};

function saveScore(highscore) {
    if (score > highscore) {
        highscore = score;
        (localStorage.setItem("highscore", JSON.stringify(highscore)));
    }
}

let endGame = () => {
    clearInterval(makeInterval);
    gameOver = true;
    document.removeEventListener("keydown", snakeDirection);
    playAgainButton.classList.remove("hidden");
    gameStarted = false;  
    saveScore(highscore);
};

let snakeTouchesSnake = () => {
    for(let i = 0; i < currentSnake.length; i++) {
        if (i != 0 && currentSnake[0] == currentSnake[i]) endGame();
    }
};

let snakeTouchesLRWall = () => {
    let snake0 = parseInt(currentSnake[0].dataset.id);
    if (movingRight && boardSquares[snake0+1].classList.contains("empty")) {
        setTimeout(function() {
            if (movingRight) {
                endGame();
            }
        }, 400);
        return true;

    } else if (movingLeft && boardSquares[snake0-1].classList.contains("empty")) {
        setTimeout(function() {
            if (movingLeft) {
                endGame();
            }
        }, 400);
        return true;
    } else return false;
};

let snakeTouchesUDWall = () => {
    let snake0 = parseInt(currentSnake[0].dataset.id);
    if (movingUp && boardSquares[snake0-24].classList.contains("empty")) {
        setTimeout(function() {
            if (movingUp) {
             endGame();
            }
        }, 400);
        return true;
    } else if (movingDown && boardSquares[snake0+24].classList.contains("empty")) {
        setTimeout(function() {
            if (movingDown) {
                endGame();
            }
        }, 400);
        return true;
    } else return false;
};

startButton.addEventListener("click", function() {
    gameStarted = true;
    startButton.classList.add("hidden");
    if (gameStarted) {
        makeInterval = setInterval(moveSnake, 400);
    }
});

playAgainButton.addEventListener("click", function() {
    boardSquares.forEach(square => {
        square.classList.remove("apple");
        square.classList.remove("snake");
    });
    playAgainButton.classList.add("hidden");
    howManySnakeSquares();
    snakeSquares = [];
    currentSnake = [];
    movingRight = true;
    movingLeft = false;
    movingUp = false;
    movingDown = false;
    gameOver = false;
    gameStarted = true;
    spawnSnake();
    spawnApple();
    if (gameStarted) {
        makeInterval = setInterval(moveSnake, 400);
    }
    document.addEventListener("keydown", snakeDirection);
});

document.addEventListener("keydown", snakeDirection);
