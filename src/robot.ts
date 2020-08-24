function runRobot() {
    let next_move = randomRobot(state);

    state.move(next_move);
}


function randomRobot(some_state : State) : string {
    let next_move = "";

    // Get neighbours
    let connections = build_connections();
    let neighbours = connections[some_state.robot_loc];

    // Pick move
    next_move = neighbours[randomIntFromInterval(0, neighbours.length-1)];

    return next_move;
}