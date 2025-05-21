"use strict";

const treesListEl = document.querySelectorAll(".tree");
const bg = document.querySelector(".bg");
const startBtn = document.querySelector(".start-btn");
const car = document.querySelector(".car");

const treesList = [];
const speed = 3;
const step = 3;
const bgHeight = bg.clientHeight;

let isStop = false;

const carInfo = {
    currentX: car.offsetLeft,
    currentY: car.offsetTop,
    stopIdUp: null,
    stopIdDown: null,
    stopIdLeft: null,
    stopIdRight: null,
    isAnimatedUp: false,
    isAnimatedDown: false,
    isAnimatedLeft: false,
    isAnimatedRight: false,
};

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
    }
}

function moveToTop() {
    const y = carInfo.currentY - step;
    carInfo.currentY = y;
    car.style.top = y + "px";
    carInfo.stopIdUp = requestAnimationFrame(moveToTop);
}
function moveToDown() {
    const y = carInfo.currentY + step;
    carInfo.currentY = y;
    car.style.top = y + "px";
    carInfo.stopIdDown = requestAnimationFrame(moveToDown);
}
function moveToLeft() {
    const x = carInfo.currentX - step;
    carInfo.currentX = x;
    car.style.left = x + "px";
    carInfo.stopIdLeft = requestAnimationFrame(moveToLeft);
}
function moveToRight() {
    const x = carInfo.currentX + step;
    carInfo.currentX = x;
    car.style.left = x + "px";
    carInfo.stopIdRight = requestAnimationFrame(moveToRight);
}

startBtn.addEventListener("click", stopGame);

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

treesList.forEach((tree) => {
    requestAnimationFrame(moveBg(tree));
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

// ArrowUp
// KeyW
// ArrowLeft
// KeyA
// ArrowRight
// KeyD
// ArrowDown
// KeyS
