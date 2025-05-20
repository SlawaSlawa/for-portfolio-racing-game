"use strict";

const treesListEl = document.querySelectorAll(".tree");
const bg = document.querySelector(".bg");
const startBtn = document.querySelector(".start-btn");

const treesList = [];
const speed = 3;
const bgHeight = bg.clientHeight;

let isStop = false;

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

startBtn.addEventListener("click", stopGame);
