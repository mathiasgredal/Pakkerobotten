// Roads and coords objects are expected to be loaded
const canvas : HTMLCanvasElement  = document.querySelector("#town")
const ctx : CanvasRenderingContext2D = canvas.getContext("2d");

ctx.scale(2,2);

let packages : Package_Location[] = [
    {current: "A", destination: "B"}, 
    {current: "A", destination: "C"}, 
    {current: "A", destination: "G"},
    {current: "G", destination: "P"}];


var state : State = new State("A", packages);


drawRoads();
drawLocations();
drawPackages();



