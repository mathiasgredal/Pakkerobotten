import {coords, roads} from "./data"
import { IPackage } from "./packages";
import {Robot} from "./robot"

// TODO: Should this be moved to an external configuration file?
const LOCATION_SIZE = 20;
const LOCATION_TEXT_SIZE = "25px";
const ROAD_WIDTH = 5;

const LOCATION_COLOR: string = "black";
const LOCATION_TEXT_COLOR: string = "white";
const ROAD_COLOR: string = "black";
const ROBOT_COLOR: string = "blue";

// Get canvas from html
const canvas : HTMLCanvasElement  = document.querySelector("#town")
const ctx : CanvasRenderingContext2D = canvas.getContext("2d");
ctx.scale(2,2);

export function redraw(robot: Robot) {
    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    ctx.restore();

    drawRoads();
    drawLocations(robot.robotLocation);
    drawAllPackages(robot.packages);
}

// Paint a small filled circle on the canvas for each key (location) in coords (randomly placed)
function drawLocations(robot_location: string) {
    for (let k in coords) {
        ctx.beginPath();
        ctx.arc(coords[k].x, coords[k].y, LOCATION_SIZE, 0, 2 * Math.PI);
        if(k == robot_location)
            ctx.fillStyle = ROBOT_COLOR;
        else
            ctx.fillStyle = LOCATION_COLOR;
        ctx.fill();
        ctx.font = LOCATION_TEXT_SIZE + " Comic Sans MS";
        ctx.fillStyle = LOCATION_TEXT_COLOR;
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
    ctx.lineWidth = ROAD_WIDTH;
    ctx.strokeStyle = ROAD_COLOR;
    ctx.stroke();
}

// // https://stackoverflow.com/a/13901170
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

function drawAllPackages(packages: IPackage[]) {
    for (let k in coords) {
        var packs: string[] = [];

        for (let p of packages) {
            if (k == p.current)
                packs.push(p.destination);
        }

        drawPackages(coords[k].x, coords[k].y, packs);
    }
}



