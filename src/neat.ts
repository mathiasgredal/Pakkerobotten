//@ts-ignore
import neataptic from "neataptic"
import { coords } from "./data";
import { GeneratePackages } from "./packages";

import { randomRobot, Robot } from "./robot"
import { find_path } from "./utility";

var Neat = neataptic.Neat;
var Methods = neataptic.methods;
var Config = neataptic.Config;
var Architect = neataptic.architect;

// Network settings
const INPUT_SIZE = 33;
const START_HIDDEN_SIZE = 50;
const OUTPUT_SIZE = 11;

// GA settings
var PACKAGES_PER_PLAYER = 2;
var PLAYER_AMOUNT = 50;
var ITERATIONS = 250;
var MUTATION_RATE = 0.3;
var ELITISM = Math.round(0.3 * PLAYER_AMOUNT);

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

    update() {
        let allRobotsFinished = true;

        for (let robot of this.robots) {
            // If the robot has delivered all of its packages, then we can just move to the next robot
            if (robot.packages.length == 0) {
                robot.brain.score = -robot.totalMoves;
                if (robot.brain.score > this.highestScore)
                    this.highestScore = robot.brain.score;
                continue;
            }

            // If the robot has made too many moves, then we can just declare it finished and give it a bad score
            if (robot.totalMoves > 100) {
                robot.brain.score = -1000 - robot.packages.length;
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

        if (allRobotsFinished)
            this.endEvaluation();



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