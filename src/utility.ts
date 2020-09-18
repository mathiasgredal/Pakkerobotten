import { coords, roads } from "./data"

// Build connection object, each key (location) should contain an array of all connected locations
export function build_connections() {
    var connections: { [id: string]: string[] } = {};
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

export function randomIntFromInterval(min: number, max: number): number { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function nodeToIndex(node: string): number {
    return Object.keys(coords).indexOf(node);
}

function indexToNode(index: number): string {
    return Object.keys(coords)[index];
}

export function find_path(from: string, to: string): string[] {
    let src: number = Object.keys(coords).indexOf(from);
    let dest: number = Object.keys(coords).indexOf(to);
    //console.log("SRC: " + from);
    //console.log("DEST: " + to);


    let numNodes = 11;
    let graph = {};

    for (let k in coords) {
        graph[nodeToIndex(k)] = [] as string[];

        for (let r in roads) {
            if (roads[r][0] == k)
                graph[nodeToIndex(k)].push(nodeToIndex(roads[r][1]));
            else if (roads[r][1] == k)
                graph[nodeToIndex(k)].push(nodeToIndex(roads[r][0]));
        }
    }

    let pred: number[] = [];
    let dist: number[] = [];

    if (BFS(graph, numNodes, src, dest, pred, dist) == false) {
        //console.log("No available path");
        return;
    }

    // vector path stores the shortest path
    let path: string[] = [];
    let crawl = dest;
    path.push(indexToNode(crawl));
    while (pred[crawl] != -1) {
        path.push(indexToNode(pred[crawl]));
        crawl = pred[crawl];
    }

    // distance from source is in distance array
    //console.log("Shortest path length is : " + dist[dest])

    // printing path from source to destination
    //console.log("Path is: " + path);

    return path;
}

function BFS(graph: any, numNodes: number, src: number, dest: number, pred: number[], dist: number[]): boolean {
    var queue: number[] = [];
    var visited: boolean[] = [];

    for (let i = 0; i < numNodes; i++) {
        visited.push(false);
        dist.push(Number.MAX_SAFE_INTEGER);
        pred.push(-1);
    }

    visited[src] = true;
    dist[src] = 0;
    queue.push(src);


    // standard BFS algorithm
    while (queue.length != 0) {
        let u = queue[0];
        queue.shift();
        for (let i = 0; i < graph[u].length; i++) {
            if (visited[graph[u][i]] == false) {
                visited[graph[u][i]] = true;
                dist[graph[u][i]] = dist[u] + 1;
                pred[graph[u][i]] = u;
                queue.push(graph[u][i]);

                // We stop BFS when we find
                // destination.
                //console.log(Object.keys(coords)[graph[u][i]]);
                if (Math.abs(graph[u][i] - dest) < 0.01)
                    return true;
            }
        }
    }
    return false;
}