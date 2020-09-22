import {redraw} from "./visual"
import {Robot, randomRobot} from "./robot"
import {GeneratePackages} from "./packages"
import {NeuroEvolution, calculatePath} from "./neat"
import { deepCopy, find_path } from "./utility";


let robot = new Robot("A", GeneratePackages(50), undefined);
redraw(robot);

let neat: NeuroEvolution = new NeuroEvolution();


document.getElementById("save").addEventListener("click", ()=> {
    console.log(JSON.stringify(neat.neat.population));
})

document.getElementById("load").addEventListener("click", ()=> {
    console.log(JSON.stringify(neat.neat.population));
})


let finished = calculatePath();

let aiMoves = deepCopy(finished.moves);



let robot_interval = setInterval(()=>{
    if(aiMoves.length == 0)
        return;
    finished.move(aiMoves.shift());
    redraw(finished);
}, 1000);




