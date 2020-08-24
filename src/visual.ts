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

// https://stackoverflow.com/a/13901170
function drawPackages(centerX: number, centerY: number, packs: string[]) {
    // value of theta corresponding to end of last coil
    const coils = 6;
    const radius = 150;
    const rotation = Math.PI * 1.5;

    const thetaMax = coils * 2 * Math.PI;

    // How far to step away from center for each side.
    const awayStep = radius / thetaMax;

    // distance between points to plot
    const chord = 30;

    let i = 0;
    for (let theta = chord / awayStep; theta <= thetaMax;) {
        // How far away from center
        const away = awayStep * theta;
        //
        // How far around the center.
        const around = theta + rotation;
        //
        // Convert 'around' and 'away' to X and Y.
        const x = centerX + Math.cos(around) * away;
        const y = centerY + Math.sin(around) * away;

        // Now that you know it, do it.
        if (i < packs.length) {
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();

            ctx.font = "13px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(packs[i], x, y);
        }

        // to a first approximation, the points are on a circle
        // so the angle between them is chord/radius
        theta += chord / away;
        i++;
    }
}

function drawAllPackages() {
    for (let k in coords) {
        var packs: string[] = [];

        for (let p of state.packages) {
            if (k == p.current)
                packs.push(p.destination);
        }

        drawPackages(coords[k].x, coords[k].y, packs);
    }
}



function redraw() {
    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    ctx.restore();

    drawRoads();
    drawLocations();
    drawAllPackages();
}