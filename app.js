let board = document.getElementById("game-board")
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
let gameOverScreen = document.getElementById("gameover")

let createBoard = squares => {
    for (let i = 0; i < allSquares; i++) {
        const square = document.createElement("div");
        square.dataset.id = i;
        square.classList.add("board-square")
        if (i > 551 || i%24 == 0 || (i+1)%24 ==0 || i < 24) {
            square.classList.add("empty")
        }
        board.appendChild(square);
        squares.push(square);
    }
};
createBoard(boardSquares);

let howManySnakeSquares = () => {
    boardSquares.forEach((square)=>{
        if(square.classList.contains("snake")) {
            snakeSquares.push(square)
        }
    })
}
howManySnakeSquares();

let spawnSnake = () => {
    currentSnake.push(boardSquares[251], boardSquares[250], boardSquares[249], boardSquares[248])
    currentSnake.forEach(square => square.classList.add("snake"))
}
spawnSnake();

let spawnApple = () => {
    let randomSquare = Math.floor(Math.random() * allSquares);
    if(boardSquares[randomSquare].classList.contains("snake") || boardSquares[randomSquare].classList.contains("empty")) {
        spawnApple()
    } else {
        boardSquares[randomSquare].classList.add("apple")
    }
}
spawnApple();

let moveRight = () => {
    let snake0 = parseInt(currentSnake[0].dataset.id);
    if (movingUp && boardSquares[snake0+1].classList.contains("empty")) endGame();
    if (movingDown && boardSquares[snake0+1].classList.contains("empty")) endGame();
    snakeTouchesSnake();
    if (snakeTouchesLRWall() || movingLeft) return;
    // add new head to snake
    if (!gameOver) {
    let currentHead = parseInt(currentSnake[0].dataset.id);
    let newHead = currentHead+1;
    currentSnake.unshift(boardSquares[newHead]);
    currentSnake[0].classList.add("snake")
    if (!currentSnake[0].classList.contains("apple")) {
        //remove end of snake if no apple is eaten
        currentSnake[currentSnake.length-1].classList.remove("snake")
        currentSnake.pop();
     } else {
         currentSnake[0].classList.remove("apple")
         spawnApple();
     }
     movingDown = false;
     movingLeft = false;
     movingUp = false;
     movingRight = true;
    }
}

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
    currentSnake[0].classList.add("snake")
    if (!currentSnake[0].classList.contains("apple")) {
        currentSnake[currentSnake.length-1].classList.remove("snake")
        currentSnake.pop();
     } else {
        currentSnake[0].classList.remove("apple")
        spawnApple();
    }
    movingDown = true;
    movingLeft = false;
    movingUp = false;
    movingRight = false;
    }
}

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
    currentSnake[0].classList.add("snake")
    if (!currentSnake[0].classList.contains("apple")) {
        currentSnake[currentSnake.length-1].classList.remove("snake")
        currentSnake.pop();
     } else {
        currentSnake[0].classList.remove("apple")
        spawnApple();
    }
    movingDown = false;
    movingLeft = false;
    movingUp = true;
    movingRight = false;
    }
}

let moveLeft = () => {
    let snake0 = parseInt(currentSnake[0].dataset.id);
    if (movingUp && boardSquares[snake0-1].classList.contains("empty")) endGame();
    if (movingDown && boardSquares[snake0-1].classList.contains("empty")) endGame();
    snakeTouchesSnake();
    if (snakeTouchesLRWall() || movingRight) return;
    if (!gameOver) {
     // add new head to snake
    let currentHead = parseInt(currentSnake[0].dataset.id);
    let newHead = currentHead-1;
    currentSnake.unshift(boardSquares[newHead]);
    currentSnake[0].classList.add("snake");
    if (!currentSnake[0].classList.contains("apple")) {
       currentSnake[currentSnake.length-1].classList.remove("snake")
       currentSnake.pop();
    } else {
        currentSnake[0].classList.remove("apple")
        spawnApple();
    }
    movingDown = false;
    movingLeft = true;
    movingUp = false;
    movingRight = false;
    }
}

let snakeDirection = e => {
    let direction = e.keyCode;
    if (direction === 37) moveLeft();
    if (direction === 38) moveUp();
    if (direction === 39) moveRight();
    if (direction === 40) moveDown();
}

let moveSnake = () => {
    if (movingRight) moveRight();
    if (movingLeft) moveLeft();
    if (movingUp) moveUp();
    if (movingDown) moveDown();
}

let endGame = () => {
    clearInterval(makeInterval)
    gameOver = true;
    document.removeEventListener("keydown", snakeDirection)
    gameOverScreen.classList.remove("hidden")
}

let snakeTouchesSnake = () => {
    for(let i = 0; i < currentSnake.length; i++) {
        if (i != 0 && currentSnake[0] == currentSnake[i]) endGame();
    }
}

let snakeTouchesLRWall = () => {
    let snake0 = parseInt(currentSnake[0].dataset.id);
    if (movingRight && boardSquares[snake0+1].classList.contains("empty")) {
        setTimeout(function() {
            if (movingRight) {
                endGame();
            }
        }, 400)
        return true // this is the magical line!

    } else if (movingLeft && boardSquares[snake0-1].classList.contains("empty")) {
        setTimeout(function() {
            if (movingLeft) {
                endGame();
            }
        }, 400)
        return true
    } else return false;
}

let snakeTouchesUDWall = () => {
    let snake0 = parseInt(currentSnake[0].dataset.id);
    if (movingUp && boardSquares[snake0-24].classList.contains("empty")) {
        setTimeout(function() {
            if (movingUp) {
             endGame();
            }
        }, 400)
        return true
    } else if (movingDown && boardSquares[snake0+24].classList.contains("empty")) {
        setTimeout(function() {
            if (movingDown) {
                endGame();
            }
        }, 400)
        return true
    } else return false;
}

let makeInterval = setInterval(moveSnake, 400)
document.addEventListener("keydown", snakeDirection)



/* 
if snake touches himself, snake dies
increase speed
*/