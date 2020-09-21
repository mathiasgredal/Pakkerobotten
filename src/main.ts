import {redraw} from "./visual"
import {Robot, randomRobot} from "./robot"
import {GeneratePackages} from "./packages"
import {NeuroEvolution} from "./neat"
import { find_path } from "./utility";

let robot = new Robot("A", GeneratePackages(50), undefined);
redraw(robot);

let neat: NeuroEvolution = new NeuroEvolution();

console.log(find_path("A", "A"));

neat.startEvaluation();

let robot_interval = setInterval(()=>{
    neat.update();
    //redraw(neat.robots[0]);
}, 10);




