import {coords} from "./data"
import {randomIntFromInterval} from "./utility"

export interface IPackage {
    current: string;
    destination: string;
}



export function GeneratePackages(n: number) : IPackage[] {
    let random_packages : IPackage[] = [];

    let locations = Object.keys(coords);

    for(let i = 0; i < n; i++) {
        let some_package: IPackage = {current: "", destination: ""};

        some_package.current = locations[randomIntFromInterval(0, locations.length-1)]
        
        let destination = some_package.current;

        while(destination === some_package.current)
            destination = locations[randomIntFromInterval(0, locations.length-1)];
        
        some_package.destination = destination;

        random_packages.push(some_package);
    }
    return random_packages;
}
