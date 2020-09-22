//@ts-ignore
import neataptic from "neataptic"
import { coords } from "./data";
import { GeneratePackages, IPackage } from "./packages";

import { randomRobot, Robot } from "./robot"
import { find_path, deepCopy } from "./utility";
import {trained_network} from "./network"




var Neat = neataptic.Neat;
var Methods = neataptic.methods;
var Config = neataptic.Config;
var Network = neataptic.Network;
var Architect = neataptic.architect;

// Network settings
const INPUT_SIZE = 33;
const START_HIDDEN_SIZE = 100;
const OUTPUT_SIZE = 10;

// GA settings
var PACKAGES_PER_PLAYER = 50;
var PLAYER_AMOUNT = 100;
var ITERATIONS = 250;
var MUTATION_RATE = 0.2;
var ELITISM = 5;

export function loadExternalNetwork(network_json: any) : any{
    var newPop = [];
    for(var i = 0; i < PLAYER_AMOUNT; i++){
        var json = network_json[i % network_json.length];
        newPop[i] = Network.fromJSON(json);
    }

    return newPop;
}
export function calculatePath() : Robot {
    let moves: string[] = [];
    let startRobot : Robot[] = [];

    let neat: NeuroEvolution = new NeuroEvolution();
    neat.neat.population = loadExternalNetwork(trained_network);
    neat.startEvaluation();

    for(let subrobot of neat.robots) {
        let dummyRobot = new Robot(deepCopy(subrobot.robotLocation), deepCopy(subrobot.packages), "");
        startRobot.push(dummyRobot);
        //subrobot.robotLocation = robot.robotLocation;
        //subrobot.packages = robot.packages;
    }

    while(neat.update(false) != true);
    
    
    let highScore = 100000;
    let bestRobot = -1;

    for(let i = 0; i < neat.robots.length; i++) {
        if(neat.robots[i].moves.length < highScore) {

            highScore = neat.robots[i].moves.length;
            bestRobot = i;
        }
        // console.log(subrobot.moves);
        // console.log(subrobot.moves.length);
    }

    console.log(neat.robots[bestRobot].moves.length)
    startRobot[bestRobot].moves = neat.robots[bestRobot].moves;

    return startRobot[bestRobot];
}

export class NeuroEvolution {
    highestScore = -100000;

    robots: Robot[];
    neat: any;

    constructor() {
        this.neat = new Neat(
            INPUT_SIZE, OUTPUT_SIZE,
            null,
            {
                mutation: Methods.mutation.ALL,
                popsize: PLAYER_AMOUNT,
                mutationRate: MUTATION_RATE,
                elitism: ELITISM,
                network: new Architect.Random(
                    INPUT_SIZE,
                    START_HIDDEN_SIZE,
                    OUTPUT_SIZE
                )
            });
    }

    update(training = true) {
        let allRobotsFinished = true;

        for (let robot of this.robots) {
            if (robot.packages.length == 0) {
                robot.brain.score = -robot.totalMoves;
                if (robot.brain.score > this.highestScore)
                    this.highestScore = robot.brain.score;
                continue;
            }

            if (robot.totalMoves > 250) {
                robot.brain.score = -1000 * robot.packages.length;
                if (robot.brain.score > this.highestScore)
                    this.highestScore = robot.brain.score;
                continue;
            }

            allRobotsFinished = false;

            // Let this be the input for the neural network
            let input: number[] = [];

            // The first 11 elements shall descripe the robotlocation, 
            // where the robotlocation is designated with a 1
            for (let loc in coords) {
                if (loc === robot.robotLocation)
                   input.push(1)
                else
                    input.push(0);
            }

            // The next 11 elements shall describe the distribution of package location and destination among the points
            // each location has a value between 0 and 1, descriping the percantage of the total packages on that point
            let packageLocationAmount: number[] = [];
            let packageDestinationAmount: number[] = [];

            // Fill arrays
            for (let j = 0; j < 11; j++) {
                packageLocationAmount.push(0);
                packageDestinationAmount.push(0);
            }

            // Set total packages
            for (let thisPackage of robot.packages) {
                packageLocationAmount[Object.keys(coords).indexOf(thisPackage.current)]++;
                packageDestinationAmount[Object.keys(coords).indexOf(thisPackage.destination)]++;
            }

            // Normalize
            for (let i in packageLocationAmount) {
                packageLocationAmount[i] = packageLocationAmount[i] / robot.packages.length;
                packageDestinationAmount[i] = packageDestinationAmount[i] / robot.packages.length;
            }

            // Concat to input
            input.push(...packageLocationAmount);
            input.push(...packageDestinationAmount);

            // Generate outputs
            let output: number[] = robot.brain.activate(input);
            output.splice(Object.keys(coords).indexOf(robot.robotLocation), 0, 0);

            // Pick the location with the highest probability:
            let highestProb = Math.max.apply(Math, output);

            // Find it the index in the output, and convert it to a letter
            let chosenLocation = Object.keys(coords)[output.indexOf(highestProb)];

            // If we chose to move to the current position, we should just increment move counter
            if (chosenLocation == robot.robotLocation) {
                robot.totalMoves++;
                console.log("Same");
                continue;
            }

            // Since the chosen is not necesarily one of the neigbours, we use pathfinding to generate the next move
            let best_path = find_path(robot.robotLocation, chosenLocation);
            let nextMove = best_path.reverse()[1];
            robot.move(nextMove);
        }

        if (allRobotsFinished){
            if(training)
            this.endEvaluation();
            return true;
        }
        
        return false;
    }

    /** Start the evaluation of the current generation */
    startEvaluation() {
        this.robots = [];
        this.highestScore = -100000;

        for (var genome in this.neat.population) {
            genome = this.neat.population[genome];
            this.robots.push(new Robot("A", GeneratePackages(PACKAGES_PER_PLAYER), genome))
        }
    }

    /** End the evaluation of the current generation */
    endEvaluation() {
        console.log('Generation:', this.neat.generation, '- average score:', this.neat.getAverage(), ' highest score:', this.highestScore);
        this.neat.sort();
        var newPopulation = [];
        // Elitism
        for (var i = 0; i < this.neat.elitism; i++) {
            newPopulation.push(this.neat.population[i]);
        }
        // Breed the next individuals
        for (var i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
            newPopulation.push(this.neat.getOffspring());
        }
        // Replace the old population with the new population
        this.neat.population = newPopulation;
        this.neat.mutate();
        this.neat.generation++;
        this.startEvaluation();
    }
}