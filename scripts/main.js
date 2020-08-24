// Roads and coords objects are expected to be loaded
var canvas = document.querySelector("#town");
var ctx = canvas.getContext("2d");
ctx.scale(2, 2);
var state = new State("A", GeneratePackages(randomIntFromInterval(500, 1000)));
redraw();
