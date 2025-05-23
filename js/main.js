"use strict";

const treesListEl = document.querySelectorAll(".tree");
const bg = document.querySelector(".bg");
const startBtn = document.querySelector(".start-btn");
const car = document.querySelector(".car");
const coin = document.querySelector(".coin");
const danger = document.querySelector(".danger");
const road = document.querySelector(".road");
const score = document.querySelector(".score");
const result = document.querySelector(".result");
const resultScore = document.querySelector(".result__score");
const restartBtn = document.querySelector(".restart-btn");
const recordEl = document.querySelector("#record");
const resultText = document.querySelectorAll(".result__text");
const newRecordTextWrapper = document.querySelector(".result__text--record");
const newRecordText = document.querySelector(
    ".result__text--record .result__score"
);
const oldRecord = document.querySelector(".old-record__num");

const treesList = [];
let speed = 3;
const step = 5;
const bgHeight = bg.clientHeight;
const roadWidth = road.clientWidth;

const record = localStorage.getItem("racing-game-record") || 0;
let scoreCounter = 0;
let isStop = false;

oldRecord.textContent = record;

const carInfo = {
    currentX: car.offsetLeft,
    currentY: car.offsetTop,
    width: car.width,
    height: car.height,
    stopIdUp: null,
    stopIdDown: null,
    stopIdLeft: null,
    stopIdRight: null,
    isAnimatedUp: false,
    isAnimatedDown: false,
    isAnimatedLeft: false,
    isAnimatedRight: false,
};
const coinInfo = {
    currentX: coin.offsetLeft,
    currentY: coin.offsetTop,
    width: coin.width,
    height: coin.height,
    stopId: null,
    hasPosX: false,
    isCollision: false,
};
const dangerInfo = {
    currentX: danger.offsetLeft,
    currentY: danger.offsetTop,
    width: danger.width,
    height: danger.height,
    stopId: null,
    hasPosX: false,
};

treesListEl.forEach((element) => {
    const tree = {
        el: element,
        width: element.clientWidth,
        height: element.clientHeight,
        currentX: element.offsetLeft,
        currentY: element.offsetTop,
        stopId: null,
    };

    treesList.push(tree);
});

function startGame() {
    isStop = false;
    treesList.forEach((tree) => {
        requestAnimationFrame(moveBg(tree));
    });
    requestAnimationFrame(moveCoin);
    requestAnimationFrame(moveDanger);
}

function stopGame() {
    const svgEls = startBtn.querySelectorAll("svg");
    svgEls.forEach((item) => {
        if (item.closest(".start-btn__icon--active")) {
            item.classList.remove("start-btn__icon--active");
        } else {
            item.classList.add("start-btn__icon--active");
        }
    });

    isStop = !isStop;

    if (!isStop) {
        treesList.forEach((tree) => {
            requestAnimationFrame(moveBg(tree));
        });
        cancelAnimationFrame(coinInfo.stopId);

        cancelAnimationFrame(carInfo.stopIdUp);
        carInfo.isAnimatedUp = false;
        cancelAnimationFrame(carInfo.stopIdDown);
        carInfo.isAnimatedDown = false;
        cancelAnimationFrame(carInfo.stopIdLeft);
        carInfo.isAnimatedLeft = false;
        cancelAnimationFrame(carInfo.stopIdRight);
        carInfo.isAnimatedRight = false;
    }
}

function moveBg(elementInfo) {
    return () => {
        let y = elementInfo.currentY + speed;
        elementInfo.currentY = y;
        elementInfo.el.style.top = y + "px";
        if (y > bgHeight) {
            elementInfo.currentY = -elementInfo.el.clientHeight;
        }

        if (!isStop) {
            elementInfo.stopId = requestAnimationFrame(moveBg(elementInfo));
        } else {
            cancelAnimationFrame(elementInfo.stopId);
        }
    };
}

function moveDanger() {
    if (!isStop) {
        const y = dangerInfo.currentY + speed;
        let x = 0;

        if (!dangerInfo.hasPosX) {
            x = Math.floor(Math.random() * (roadWidth - dangerInfo.width));
            dangerInfo.hasPosX = true;
            danger.style.left = x + "px";
            dangerInfo.currentX = x;
        }

        dangerInfo.currentY = y;
        danger.style.top = y + "px";

        if (dangerInfo.currentY > bgHeight) {
            dangerInfo.currentY = -dangerInfo.height - 400;
            dangerInfo.hasPosX = false;
        }

        if (hasCollision(dangerInfo)) {
            stopGame();
            renderResult();
        }

        dangerInfo.stopId = requestAnimationFrame(moveDanger);
    }
}

function moveCoin() {
    if (!isStop) {
        const y = coinInfo.currentY + speed;
        let x = 0;

        if (!coinInfo.hasPosX) {
            x = Math.floor(Math.random() * (roadWidth - coinInfo.width));
            coinInfo.hasPosX = true;
            coin.style.left = x + "px";
            coinInfo.currentX = x;
        }

        coinInfo.currentY = y;
        coin.style.top = y + "px";

        if (coinInfo.currentY > bgHeight || coin.style.display === "none") {
            coinInfo.currentY = -coinInfo.height - 100;
            coinInfo.hasPosX = false;
            coin.style.display = "block";
        }
        if (hasCollision(coinInfo) && !coinInfo.isCollision) {
            scoreCounter++;
            coinInfo.isCollision = true;
            score.textContent = scoreCounter;
            coin.style.display = "none";
            if (scoreCounter % 2 === 0) speed++;
        }

        if (!hasCollision(coinInfo)) coinInfo.isCollision = false;

        coinInfo.stopId = requestAnimationFrame(moveCoin);
    }
}

function moveToTop() {
    if (carInfo.currentY > 0 && !isStop) {
        const y = carInfo.currentY - step;
        carInfo.currentY = y;
        car.style.top = y + "px";
        carInfo.stopIdUp = requestAnimationFrame(moveToTop);
    }
}
function moveToDown() {
    if (carInfo.currentY < bgHeight - carInfo.height && !isStop) {
        const y = carInfo.currentY + step;
        carInfo.currentY = y;
        car.style.top = y + "px";
        carInfo.stopIdDown = requestAnimationFrame(moveToDown);
    }
}
function moveToLeft() {
    if (carInfo.currentX > 0 && !isStop) {
        const x = carInfo.currentX - step;
        carInfo.currentX = x;
        car.style.left = x + "px";
        carInfo.stopIdLeft = requestAnimationFrame(moveToLeft);
    }
}
function moveToRight() {
    if (carInfo.currentX < roadWidth - carInfo.width && !isStop) {
        const x = carInfo.currentX + step;
        carInfo.currentX = x;
        car.style.left = x + "px";
        carInfo.stopIdRight = requestAnimationFrame(moveToRight);
    }
}

function hasCollision(elementInfo) {
    const carTop = carInfo.currentY;
    const carBottom = carInfo.currentY + carInfo.height;
    const carLeft = carInfo.currentX;
    const carRight = carInfo.currentX + carInfo.width;

    if (
        carTop >= elementInfo.currentY + elementInfo.height ||
        carBottom <= elementInfo.currentY
    ) {
        return false;
    }

    if (
        carLeft >= elementInfo.currentX + elementInfo.width ||
        carRight <= elementInfo.currentX
    ) {
        return false;
    }

    return true;
}

function renderResult() {
    const currentScore = scoreCounter;

    result.classList.add("result--active");
    resultScore.textContent = scoreCounter;
    recordEl.textContent = record;
    startBtn.style.display = "none";

    if (record < currentScore) {
        localStorage.setItem("racing-game-record", currentScore);
        newRecordText.textContent = currentScore;
        resultText.forEach((item) => (item.style.display = "none"));
        newRecordTextWrapper.style.display = "block";
    }
}

startBtn.addEventListener("click", () => {
    if (!isStop) {
        stopGame();
    } else {
        startGame();
    }
});

restartBtn.addEventListener("click", () => {
    location.reload();
});

window.addEventListener("keydown", (evt) => {
    const code = evt.code;

    if (!carInfo.isAnimatedUp) {
        if (code === "ArrowUp" || code === "KeyW") {
            requestAnimationFrame(moveToTop);
            carInfo.isAnimatedUp = true;
        }
    }
    if (!carInfo.isAnimatedDown) {
        if (code === "ArrowDown" || code === "KeyS") {
            requestAnimationFrame(moveToDown);
            carInfo.isAnimatedDown = true;
        }
    }

    if (!carInfo.isAnimatedLeft) {
        if (code === "ArrowLeft" || code === "KeyA") {
            requestAnimationFrame(moveToLeft);
            carInfo.isAnimatedLeft = true;
        }
    }

    if (!carInfo.isAnimatedRight) {
        if (code === "ArrowRight" || code === "KeyD") {
            requestAnimationFrame(moveToRight);
            carInfo.isAnimatedRight = true;
        }
    }
});

window.addEventListener("keyup", (evt) => {
    const code = evt.code;
    if (code === "ArrowUp" || code === "KeyW") {
        cancelAnimationFrame(carInfo.stopIdUp);
        carInfo.isAnimatedUp = false;
    }

    if (code === "ArrowDown" || code === "KeyS") {
        cancelAnimationFrame(carInfo.stopIdDown);
        carInfo.isAnimatedDown = false;
    }

    if (code === "ArrowLeft" || code === "KeyA") {
        cancelAnimationFrame(carInfo.stopIdLeft);
        carInfo.isAnimatedLeft = false;
    }

    if (code === "ArrowRight" || code === "KeyD") {
        cancelAnimationFrame(carInfo.stopIdRight);
        carInfo.isAnimatedRight = false;
    }
});

startGame();
