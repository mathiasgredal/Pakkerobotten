function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function GeneratePackages(n) {
    var random_packages = [];
    var locations = Object.keys(coords);
    for (var i = 0; i < n; i++) {
        var some_package = { current: "", destination: "" };
        some_package.current = locations[randomIntFromInterval(0, locations.length - 1)];
        var destination = some_package.current;
        while (destination == some_package.current)
            destination = locations[randomIntFromInterval(0, locations.length - 1)];
        some_package.destination = destination;
        random_packages.push(some_package);
    }
    return random_packages;
}
var State = /** @class */ (function () {
    function State(robot_loc, packages) {
        this.robot_loc = robot_loc;
        this.packages = packages;
    }
    State.prototype.move = function (to) {
        var _this = this;
        // Check if robot loc is connected to to
        var connections = build_connections();
        if (!connections[this.robot_loc].includes(to)) {
            console.log("ERROR: tried to move robot to non neighbouring location");
            return;
        }
        this.packages.forEach(function (element, index) {
            // Any packages on the this location will be moved to the next loc
            if (element.current == _this.robot_loc) {
                element.current = to;
            }
        });
        this.packages = this.packages.filter(function (element) {
            return element.current != element.destination;
        });
        this.robot_loc = to;
        redraw();
        console.log(this.packages);
    };
    return State;
}());
// Build connection object, each key (location) should contain an array of all connected locations
function build_connections() {
    var connections = {};
    for (var k in coords) {
        connections[k] = [];
        for (var r in roads) {
            if (roads[r][0] == k)
                connections[k].push(roads[r][1]);
            else if (roads[r][1] == k)
                connections[k].push(roads[r][0]);
        }
    }
    return connections;
}
