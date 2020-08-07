const canvas = document.querySelector("canvas");
const speedRANGE = document.getElementById("speed");
const speedGauge = document.getElementById("speed-gauge");
const autoSpeed = document.getElementById("autospeed");

const fps = FPS();

const DISH_ROWS = 100;
const DISH_COLS = 100;
let autoSpeedIntervalId = 0;
let stepIntervalID = 0;
let fpsIntervalID = 0;

const PD = createPetriDish(DISH_COLS, DISH_ROWS, canvas);

PD.setCells([
    [5, 14],
    [5, 15],
    [5, 16],
    [4, 15],
    [3, 4],
]);

// load samples to localStorage
if (!~Object.keys(localStorage).indexOf("saved_Spaceship")) {
    localStorage.setItem(
        "saved_Spaceship",
        "[[8,4],[8,5],[8,6],[9,3],[9,4],[9,5],[9,6],[9,7],[10,3],[10,4],[10,5],[10,7],[10,8],[11,6],[11,7]]"
    );
}
if (!~Object.keys(localStorage).indexOf("saved_Simple Gun")) {
    localStorage.setItem(
        "saved_Simple Gun",
        "[[3,28],[4,26],[4,28],[5,16],[5,17],[5,24],[5,25],[5,38],[5,39],[6,15],[6,19],[6,24],[6,25],[6,38],[6,39],[7,4],[7,5],[7,14],[7,20],[7,24],[7,25],[8,4],[8,5],[8,14],[8,18],[8,20],[8,21],[8,26],[8,28],[9,14],[9,20],[9,28],[10,15],[10,19],[11,16],[11,17]]"
    );
}

function bind({ element, event, callback }) {
    if (typeof element === "string") {
        document.getElementById(element).addEventListener(event, callback);
    } else {
        element.addEventListener(event, callback);
    }
}

function fireEvent(element, eventName) {
    const evt = new Event(eventName, {
        bubbles: true,
        cancelable: false,
    });
    element.dispatchEvent(evt);
}

bind({
    element: "runStep",
    event: "click",
    callback: () => {
        PD.runStep();
    },
});

bind({
    element: "stop",
    event: "click",
    callback: () => {
        autoSpeed.checked = false;
        fireEvent(autoSpeed, "change");
        speedRANGE.value = 0;
        fireEvent(speedRANGE, "input");
    },
});

bind({
    element: "reset",
    event: "click",
    callback: () => {
        confirm("Are you sure?") && PD.reset();
    },
});

bind({
    element: "setDish",
    event: "click",
    callback: (e) => {
        PD.toggleEdit();
        e.currentTarget.classList.toggle("active");
    },
});

bind({
    element: "save",
    event: "click",
    callback: () => {
        localStorage.setItem(
            "saved_" + prompt("enter a name for it"),
            JSON.stringify(PD.getLiveCells())
        );
    },
});

bind({
    element: "sticky-cells",
    event: "change",
    callback: () => {
        canvas.classList.toggle("sticky");
    },
});

bind({
    element: document,
    event: "click",
    callback: ({ target }) => {
        if (~target.className.indexOf("load_from_storage")) {
            PD.reset();
            PD.setCells(
                JSON.parse(localStorage.getItem("saved_" + target.textContent))
            );
        }
    },
});

bind({
    element: speedRANGE,
    event: "input",
    callback: ({ currentTarget: { value } }) => {
        clearInterval(stepIntervalID);
        speedGauge.textContent = value + "/s";
        if (+value !== 0) {
            stepIntervalID = setInterval(() => {
                fps.gameLoop();
                PD.runStep();
            }, 1000 / +value);
        }
    },
});

function enableAutoSpeed() {
    clearInterval(autoSpeedIntervalId);
    if (+speedRANGE.value === 0) {
        setSpeed();
    }
    autoSpeedIntervalId = setInterval(setSpeed, 5000);
    fpsIntervalID = setInterval(function () {
        document.getElementById("fps-gauge").innerHTML = `(${fps.getFPS()}fps)`;
    }, 1000);
    fps.init();
}

function setSpeed() {
    speedRANGE.value = ~~fps.getFPS() + 5;
    fireEvent(speedRANGE, "input");
}

function disableAutoSpeed() {
    clearInterval(autoSpeedIntervalId);
    clearInterval(fpsIntervalID);
    fps.kill();
}
bind({
    element: autospeed,
    event: "change",
    callback: ({ currentTarget: { checked } }) => {
        if (checked) {
            enableAutoSpeed();
        } else {
            disableAutoSpeed();
        }
    },
});

// read saved dishes from localStorage
function loadSavedStates() {
    function ListItem(name) {
        const li = document.createElement("LI");
        li.className = "load_from_storage";
        const textNode = document.createTextNode(name);
        li.appendChild(textNode);
        return li;
    }
    const ul = document.createElement("UL");
    Object.keys(localStorage).forEach((key) => {
        if (/^saved_/.test(key)) {
            ul.appendChild(ListItem(key.replace(/^saved_/, "")));
        }
    });
    document.getElementById("saved-items").appendChild(ul);
}

loadSavedStates();
