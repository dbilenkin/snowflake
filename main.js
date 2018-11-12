///////////////////////////
//GLOBAL VARIABLES
///////////////////////////
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(255,255,255,.3)";

const SIZE = 1;
const oddNeighbors = [
  {
    r: -1,
    c: 1
  },
  {
    r: 0,
    c: 1
  },
  {
    r: 1,
    c: 1
  },
  {
    r: 1,
    c: 0
  },
  {
    r: 0,
    c: -1
  },
  {
    r: -1,
    c: 0
  }
];
const evenNeighbors = [
  {
    r: -1,
    c: 0
  },
  {
    r: 0,
    c: 1
  },
  {
    r: 1,
    c: 0
  },
  {
    r: 1,
    c: -1
  },
  {
    r: 0,
    c: -1
  },
  {
    r: -1,
    c: -1
  }
];

let grid = Array(600 / SIZE)
  .fill()
  .map(a => []);
let edges = [];
let gen = 0;

function createFlake(row, col) {
  return {
    row: row,
    col: col,
    n: 0
  };
}

function addEdge(row, col) {
  const flake = createFlake(row, col);
  grid[row][col] = flake;
  edges.push(flake);
}

function grow() {
  if (gen > 300) return;
  // console.log("gen: " + gen);
  // console.log(edges);
  gen++;
  draw();
  let oldEdges = [...edges];
  oldEdges.forEach((edge, i) => {
    if (edge.row % 1 === 1) {
      oddNeighbors.forEach(n => {
        let row = edge.row + n.r;
        let col = edge.col + n.c;
        if (!grid[row][col]) {
          addEdge(row, col);
        }
      });
    } else {
      evenNeighbors.forEach(n => {
        let row = edge.row + n.r;
        let col = edge.col + n.c;
        if (!grid[row][col]) {
          addEdge(row, col);
        }
      });
    }
    edges.splice(i, 1);
  });
  setTimeout(() => grow(), 10);
}

function getXY(row, col) {
  let x = 0;
  let y = 0;
  if (row % 2 === 1) {
    x = col * SIZE + SIZE * 0.433;
  } else {
    x = col * SIZE;
  }
  y = row * SIZE + SIZE * 0.75;
  return {
    x: x,
    y: y
  };
}

function draw() {
  ctx.beginPath();
  edges.forEach(edge => {
    let xy = getXY(edge.row, edge.col);
    // console.log(edge);
    // console.log(xy);
    ctx.fillRect(xy.x, xy.y, SIZE, SIZE);
  });
  ctx.stroke();
}

addEdge(300 / SIZE, 300 / SIZE);
grow();
