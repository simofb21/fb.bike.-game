// Game Constants
const boardWidth = 750;
const boardHeight = 250;
const cyclistWidth = 55;
const cyclistHeight = 55;
let gravity = 0.5;
let jumpVelocity = -9.6;
let BasevelocityX;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    BasevelocityX = -7;
    console.log("Mobile");
} else {
    BasevelocityX = -8;
}
let velocityX = BasevelocityX;
let velocityY = 0;
const BaseY = boardHeight;

// Game Elements
let board, context, cyclist, veichleArray = [], veichle = {}, gameOver = false, score = 0;
let cyclist_img, moto, car, camion;


//load asset
function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
    });
}

function initializeImages() {
    return Promise.all([
        loadImage("./img/cyclist.png").then(img => cyclist_img = img),
        loadImage("./img/moto.png").then(img => moto = img),
        loadImage("./img/car.png").then(img => car = img),
        loadImage("./img/camion.png").then(img => camion = img)
    ]);
}

//init
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    cyclist = {
        x: 50,
        y: boardHeight - cyclistHeight,
        width: cyclistWidth,
        height: cyclistHeight,
    };
    initializeImages().then(() => {
        //Render the new frame
        requestAnimationFrame(update);
        //Listen user input
        document.addEventListener("keydown", moveCyclist);
        window.addEventListener('touchend', moveCyclist);
        window.addEventListener('click', moveCyclist);
    });
};

// Game Reset Function
function resetGame() {
    cyclist.y = boardHeight - cyclistHeight;
    veichleArray = [];
    gameOver = false;
    score = 0;
    velocityX = BasevelocityX; // Reset speed
    velocityY = 0; // Reset vertical velocity
    gravity = 0.5; // Reset gravity
}

// Game Update Functions
let lastVeichleTime = Date.now();
const veichleRate = 1000; // Place a vehicle every 1000 milliseconds

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    displayScore();
    updateEntities();
    checkCollision();

    const currentTime = Date.now();
    if (currentTime - lastVeichleTime >= veichleRate) {
        placeveichle();
        lastVeichleTime = currentTime;
    }
}

function updateEntities() {
    // Update Cyclist
    cyclist.y = Math.min(cyclist.y + velocityY, boardHeight - cyclistHeight);
    velocityY += gravity;
    context.drawImage(cyclist_img, cyclist.x, cyclist.y, cyclist.width, cyclist.height);

    // Update Vehicles
    for (const veichle of veichleArray) {
        veichle.x +=velocityX;
        context.drawImage(veichle.img, veichle.x, veichle.y, veichle.width, veichle.height);
    }
}

// Score Function
function displayScore() {
    score += 0.10; // Increase score by 0.10
    context.fillStyle = "black";
    context.font = "25px comic sans ms";
    context.fillText(Math.floor(score), 5, 25);
}

// Collision Functions
function checkCollision() {
    for (const veichle of veichleArray) {
        if (cyclist.x < veichle.x + veichle.width - 15 && cyclist.x + cyclist.width - 15 > veichle.x && cyclist.y < veichle.y + veichle.height - 15 && cyclist.y + cyclist.height - 15 > veichle.y)
            gameOver = true;
    }

    if (gameOver) {
        alert("Sei stato investito! Hai fatto " + Math.floor(score) + " punti.");
        resetGame();
    }
}

// User Input Function
function moveCyclist(e) {
    if ((e.type == "keydown" && e.code == "Space") || e.type == "click" || e.type == "touchstart") {
        if (cyclist.y == boardHeight - cyclistHeight) {
            velocityY = jumpVelocity;
        }
    }
}

// Vehicle Function
function placeveichle() {
    const placeVeichleChance = Math.random();
    if (placeVeichleChance > 0.80) {
        veichle = {
            img: camion,
            width: 120,
            height: 60,
            x: boardWidth,
            y: BaseY - 60};
    } else if (placeVeichleChance < 0.30) {
        veichle = {
            img: moto,
            width: 55,
            height: 48,
            x: boardWidth,
            y: BaseY - 48};
    } else {
        veichle = {
            img: car,
            width: 68,
            height: 58,
            x: boardWidth,
            y: BaseY - 58 + 7};
    }
    veichleArray.push(veichle);

    if (veichleArray.length > 3) {
        veichleArray.shift();
    }
}