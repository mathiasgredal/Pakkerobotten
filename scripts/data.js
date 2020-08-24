// Key:  {Name, x, y}
var coords = {
    "A": { "Name": "Anjas hus", x: 900, y: 150 },
    "B": { "Name": "Bobs hus", x: 1000, y: 400 },
    "C": { "Name": "Anjas sommerhus", x: 1100, y: 100 },
    "D": { "Name": "Daniels hus", x: 450, y: 600 },
    "E": { "Name": "Emmas hus", x: 250, y: 590 },
    "F": { "Name": "Gretes gård", x: 120, y: 160 },
    "G": { "Name": "Gretes hus", x: 120, y: 360 },
    "H": { "Name": "Gretes butik", x: 350, y: 400 },
    "P": { "Name": "Postcenter", x: 600, y: 100 },
    "S": { "Name": "Shoppingcenter", x: 500, y: 150 },
    "Z": { "Name": "ZBC HTX", x: 600, y: 350 }
};
// Each element is an array of length 2 that defines starting point and ending point of a road
var roads = [
    ["A", "B"],
    ["A", "C"],
    ["A", "P"],
    ["B", "Z"],
    ["D", "E"],
    ["D", "Z"],
    ["E", "G"],
    ["G", "F"],
    ["G", "H"],
    ["G", "S"],
    ["S", "P"],
    ["S", "H"],
    ["S", "Z"],
    ["H", "Z"],
    ["F", "S"]
];
