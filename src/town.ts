interface Package_Location {
    current: string;
    destination: string;
}

class State {
    robot_loc: string;
    packages: Package_Location[];

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

        // Store the current transformation matrix
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        ctx.restore();

        drawRoads();
        drawLocations();
        drawPackages();


        console.log(this.packages);
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