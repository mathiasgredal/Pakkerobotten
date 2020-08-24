// Roads and coords objects are expected to be loaded
var canvas = document.querySelector("#town");
var ctx = canvas.getContext("2d");
ctx.scale(2, 2);
var packages = [
    { current: "A", destination: "B" },
    { current: "A", destination: "C" },
    { current: "A", destination: "G" },
    { current: "G", destination: "P" }
];
var state = new State("A", packages);
drawRoads();
drawLocations();
drawPackages();
