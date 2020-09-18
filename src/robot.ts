import {IPackage} from "./packages"
import {build_connections, randomIntFromInterval} from "./utility"

export class Robot {
    robotLocation: string;
    totalMoves : number = 0;
    packages: IPackage[];
    brain: any;

    constructor(startLocation: string, startPackages: IPackage[], genome: any ) {
        this.robotLocation = startLocation;
        this.packages = startPackages;
        this.brain = genome;
    }

    move(to: string) {
        // Check if robot loc is connected to to
        let connections = build_connections();
        if(!connections[this.robotLocation].includes(to)){
            console.log("ERROR: tried to move robot to non neighbouring location");
            return;
        }
        this.packages.forEach((element, index)=>{
            // Any packages on the this location will be moved to the next loc
            if(element.current == this.robotLocation)
            {
                element.current = to;
            }
        });

        this.packages = this.packages.filter((element)=>{
            return element.current != element.destination;
        });

        this.robotLocation = to;
        this.totalMoves++;
    }


}

export function randomRobot(some_robot : Robot) : string {
    let next_move = "";

    // Get neighbours
    let connections = build_connections();
    let neighbours = connections[some_robot.robotLocation];

    // Pick move
    next_move = neighbours[randomIntFromInterval(0, neighbours.length-1)];

    return next_move;
}