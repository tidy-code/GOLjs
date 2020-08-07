function createMonitor(canvas_el, dishW, dishH) {
    const ctx = canvas_el.getContext("2d");
    const { width = 500, height = 500 } = canvas_el;
    ctx.font = "7px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const block_width = width / dishW;
    const block_height = height / dishH;

    function putOnMonitor(PetriDish, withDots = false) {
        PetriDish.forEach((row, i) =>
            row.forEach((col, j) => {
                ctx.fillStyle = "hotpink";
                col
                    ? ctx.fillRect(
                          j * block_width,
                          i * block_height,
                          block_width,
                          block_height
                      )
                    : ctx.clearRect(
                          j * block_width,
                          i * block_height,
                          block_width,
                          block_height
                      );

                if (withDots && !col) {
                    ctx.fillStyle = "#ddd";
                    ctx.fillText(
                        "\u2022",
                        // countNeighbours(PetriDish, i, j),
                        j * block_width + block_width / 2,
                        i * block_height + block_height / 2
                    );
                }
            })
        );
    }
    return {
        putOnMonitor,
    };
}
