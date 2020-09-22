import {redraw} from "./visual"
import {Robot, randomRobot} from "./robot"
import {GeneratePackages} from "./packages"
import {NeuroEvolution} from "./neat"
import { find_path } from "./utility";

let robot = new Robot("A", GeneratePackages(50), undefined);
redraw(robot);

let neat: NeuroEvolution = new NeuroEvolution();

console.log(find_path("A", "A"));

document.getElementById("save").addEventListener("click", ()=> {
    console.log(JSON.stringify(neat.neat.population));
})

document.getElementById("load").addEventListener("click", ()=> {
    console.log(JSON.stringify(neat.neat.population));
})


neat.startEvaluation();

let robot_interval = setInterval(()=>{
    neat.update();
    //redraw(neat.robots[0]);
}, 10);




