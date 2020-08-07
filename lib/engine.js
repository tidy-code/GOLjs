// TODO: Render changes only (maybe set a base dish and update necessary changes)

function createPetriDish(w, h, canvas) {
    // initialize:
    let _dish = [];
    const { putOnMonitor } = createMonitor(canvas, w, h);
    implementWholes(_dish, h, w);
    let _editing = false;

    const block_width = ~~(canvas.width / w);
    const block_height = ~~(canvas.height / h);

    function implementWholes(PetriDish, w, h) {
        for (let i = 0; i < h; i++) {
            PetriDish.push([]);
            for (let j = 0; j < w; j++) {
                PetriDish[i].push(0);
            }
        }
    }

    function setCells(wholes, cell = 1) {
        wholes.forEach((whole) => {
            _dish[whole[0]][whole[1]] = cell;
        });
        putOnMonitor(_dish, _editing);
    }

    function reset() {
        _dish.length = 0;
        implementWholes(_dish, h, w);
        putOnMonitor(_dish, _editing);
    }

    function selectSquare({ offsetX, offsetY }) {
        const col = ~~(offsetY / block_height);
        const row = ~~(offsetX / block_width);
        setCells([[col, row]], _dish[col][row] === 1 ? 0 : 1);
    }

    function toggleEdit() {
        if (!_editing) {
            canvas.classList.add("selecting");
            canvas.addEventListener("click", selectSquare);
            _editing = true;
            putOnMonitor(_dish, _editing);
        } else {
            canvas.classList.remove("selecting");
            canvas.removeEventListener("click", selectSquare);
            _editing = false;
            putOnMonitor(_dish, _editing);
        }
    }

    function countNeighbours(ih, jw) {
        const topLeft = ih - 1 >= 0 && jw - 1 > 0 ? _dish[ih - 1][jw - 1] : 0;
        const top = ih - 1 >= 0 ? _dish[ih - 1][jw] : 0;
        const topRight = ih - 1 >= 0 && jw + 1 < w ? _dish[ih - 1][jw + 1] : 0;
        const right = jw + 1 < w ? _dish[ih][jw + 1] : 0;
        const bottomRight =
            ih + 1 < h && jw + 1 < w ? _dish[ih + 1][jw + 1] : 0;
        const bottom = ih + 1 < h ? _dish[ih + 1][jw] : 0;
        const bottomLeft =
            ih + 1 < h && jw - 1 >= 0 ? _dish[ih + 1][jw - 1] : 0;
        const left = jw - 1 >= 0 ? _dish[ih][jw - 1] : 0;
        return (
            topLeft +
            top +
            topRight +
            right +
            bottomRight +
            bottom +
            bottomLeft +
            left
        );
    }

    function getLiveCells() {
        const ones = _dish.reduce((rowAcc, rowCurr, rowIndex) => {
            return rowCurr.reduce((colAcc, colCurr, colIndex) => {
                if (colCurr === 1) {
                    colAcc.push([rowIndex, colIndex]);
                }
                return colAcc;
            }, rowAcc);
        }, []);

        return ones;
    }

    // let lastLoop = new Date();
    // function logFPS() {
    //     var thisLoop = new Date();
    //     var fps = 1000 / (thisLoop - lastLoop);
    //     console.log(fps);
    //     lastLoop = thisLoop;
    // }

    function runStep() {
        const newDish = JSON.parse(JSON.stringify(_dish));
        const h = newDish.length;
        const w = newDish[0].length;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                const neighbors = countNeighbours(i, j);
                if (neighbors === 3) {
                    newDish[i][j] = 1;
                } else if (neighbors === 2) {
                    continue;
                } else {
                    newDish[i][j] = 0;
                }
            }
        }
        _dish = newDish;
        putOnMonitor(_dish, _editing);
    }

    return {
        implementWholes,
        setCells,
        reset,
        countNeighbours,
        runStep,
        toggleEdit,
        getLiveCells,
    };
}
