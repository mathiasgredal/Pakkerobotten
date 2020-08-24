// Paint a small filled circle on the canvas for each key (location) in coords (randomly placed)
function drawLocations() {
    for (let k in coords) {
        ctx.beginPath();
        ctx.arc(coords[k].x, coords[k].y, 2 * 10, 0, 2 * Math.PI);
        if (k == state.robot_loc)
            ctx.fillStyle = "blue";
        else
            ctx.fillStyle = "black";
        ctx.fill();

        ctx.font = "25px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(k, coords[k].x, coords[k].y);
    }
}

function drawRoads() {
    for (let k in roads) {
        drawRoad(roads[k][0], roads[k][1]);
    }
}

function drawRoad(from, to) {
    ctx.beginPath();
    ctx.moveTo(coords[from].x, coords[from].y);
    ctx.lineTo(coords[to].x, coords[to].y);
    ctx.lineWidth = 5;
    ctx.stroke();
}

function drawPackages() {

    for (let k in coords) {
        // Get number of packages on location

        // Call function
    }

    state.packages.forEach((pack, index)=>{

        ctx.beginPath();
        ctx.rect(coords[pack.current].x + 10, coords[pack.current].y + 10, 10, 10);
        ctx.fillStyle = "green";
        ctx.fill();

        ctx.beginPath();
        ctx.rect(coords[pack.destination].x + 10, coords[pack.destination].y + 10, 10, 10);
        ctx.fillStyle = "red";
        ctx.fill();
    });
}