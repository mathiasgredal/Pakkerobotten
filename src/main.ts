// Roads and coords objects are expected to be loaded
const canvas : HTMLCanvasElement  = document.querySelector("#town")
const ctx : CanvasRenderingContext2D = canvas.getContext("2d");

ctx.scale(2,2);

var state : State = new State("A", GeneratePackages(randomIntFromInterval(500, 1000)));

redraw();


let robot_interval = setInterval(()=>{
    runRobot();

    if(state.packages.length == 0){
        clearInterval(robot_interval);
        console.log("Done in "+state.iterations+" moves");
    }
}, 100);

