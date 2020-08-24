function runRobot() {
    var next_move = randomRobot(state);
    state.move(next_move);
}
function randomRobot(some_state) {
    var next_move = "";
    // Get neighbours
    var connections = build_connections();
    var neighbours = connections[some_state.robot_loc];
    // Pick move
    next_move = neighbours[randomIntFromInterval(0, neighbours.length - 1)];
    return next_move;
}
