interface Package_Location {
    current: string;
    destination: string;
}

function randomIntFromInterval(min : number, max: number) : number { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

function GeneratePackages(n: number) : Package_Location[] {
    let random_packages : Package_Location[] = [];


    let locations = Object.keys(coords);

    for(let i = 0; i < n; i++) {
        let some_package: Package_Location = {current: "", destination: ""};

        some_package.current = locations[randomIntFromInterval(0, locations.length-1)]
        
        let destination = some_package.current;

        while(destination == some_package.current)
            destination = locations[randomIntFromInterval(0, locations.length-1)];
        
        some_package.destination = destination;

        random_packages.push(some_package);
    }
    return random_packages;
}

class State {
    robot_loc: string;
    packages: Package_Location[];
    iterations: number = 0;

    constructor(robot_loc: string, packages: Package_Location[]) {
        this.robot_loc = robot_loc;
        this.packages = packages;
    }

    move(to: string)
    {
        // Check if robot loc is connected to to
        let connections = build_connections();
        if(!connections[this.robot_loc].includes(to)){
            console.log("ERROR: tried to move robot to non neighbouring location");
            return;
        }

        this.packages.forEach((element, index)=>{
            // Any packages on the this location will be moved to the next loc
            if(element.current == this.robot_loc)
            {
                element.current = to;
            }
        });

        this.packages = this.packages.filter((element)=>{
            return element.current != element.destination;
        });
        
        this.robot_loc = to;

        redraw();

        this.iterations++;
    }
}

// Build connection object, each key (location) should contain an array of all connected locations
function build_connections() {
    var connections : {[id: string] : string[]} = {};

    for (let k in coords) {
        connections[k] = [] as string[];

        for (let r in roads) {
            if (roads[r][0] == k)
                connections[k].push(roads[r][1]);
            else if (roads[r][1] == k)
                connections[k].push(roads[r][0]);
        }
    }
    
    return connections;
}