function FPS() {
    var filterStrength = 20;
    var frameTime = 0,
        lastLoop = new Date(),
        thisLoop;
    let isAlive = false;

    let fpsIntervalID = 0;

    function updateFPS() {
        var thisFrameTime = (thisLoop = new Date()) - lastLoop;
        frameTime += (thisFrameTime - frameTime) / filterStrength;
        lastLoop = thisLoop;
    }

    function getFPS() {
        if (frameTime === 0) {
            return 0;
        }
        return (1000 / frameTime).toFixed(1);
    }

    function init() {
        isAlive = true;
        fpsIntervalID = setInterval(function () {
            document.getElementById("fps-gauge").innerHTML =
                frameTime === 0 ? "0fps" : fps.getFPS() + " fps";
        }, 1000);
    }

    function kill() {
        isAlive = false;
        clearInterval(fpsIntervalID);
    }

    function gameLoop() {
        isAlive && updateFPS();
    }

    return {
        getFPS,
        gameLoop,
        init,
        kill,
    };
}
