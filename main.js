///////////////////////////
//GLOBAL VARIABLES
///////////////////////////
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(255,255,255,1)";

const SIZE = 3;
const GEN = 200 / SIZE;
const SPEED = 10;
const ORIGIN = {
  x: parseInt(380 / SIZE),
  y: parseInt(330 / SIZE)
};

let grid = Array(600 / SIZE)
  .fill()
  .map(a => []);
let edges = [];
let futureFlakes = [];
let gen = 0;
let threshold = 0;
let depth = 1;

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ^ (2 + (y1 - y2)) ^ 2);
}

function createFlake(row, col, n) {
  return {
    row: row,
    col: col,
    n: n
  };
}

function addEdge(row, col, n) {
  // if (Math.random() < .001) return;
  if (!grid[row][col] || !grid[row][col].drawn) {
    const flake = createFlake(row, col, n);
    grid[row][col] = flake;
    edges.push(flake);
  }
}

function grow() {
  if (gen > GEN) return;
  // console.log("gen: " + gen);
  // console.log(edges);

  ctx.fillStyle = "rgba(255,255,255," + ((gen / GEN) + .3) + ")";
  //Set threshold and depth
  if (gen % 1 === 0) {
    thresholdConst = parseInt(document.getElementById("threshold").value);
    depthConst = parseInt(document.getElementById("depth").value);
    // threshold = (Math.random() * thresholdConst) / thresholdConst;

    // threshold = parseInt(document.getElementById("threshold").value)/100;
    // depthConst = 20;
    depth = Math.floor(Math.random() * depthConst) + 3;
    threshold = Math.random() * (thresholdConst/100);
    // depth = 5;
  }
  gen++;
  draw();

  chooseFutureFlakes();
  checkEdges();

  setTimeout(() => grow(), SPEED);
}

function chooseFutureFlakes() {
  futureFlakes = [];
  edges.forEach(edge => {
    //get neighbors at 1 depth
    let neighbors = getNeighborsDeep(edge.row, edge.col, 1);
    neighbors.forEach(neighbor => {
      if (!futureFlakes.some(f => f.r === neighbor.r && f.c === neighbor.c)) {
        neighbor.count = countNeighborsDeep(neighbor.r, neighbor.c, depth);
        futureFlakes.push(neighbor);
      }
    });
  });

  //sort futureFlakes by count
  futureFlakes.sort((a, b) => {
    return a.count - b.count;
  });

  const indexThreshold = Math.floor(futureFlakes.length * threshold);
  const countThreshold = futureFlakes[indexThreshold].count;

  futureFlakes.forEach(flake => {
    if (flake.count <= countThreshold) {
      addEdge(flake.r, flake.c, 1);
    }
  });
}

function checkEdges() {
  let oldEdges = [...edges];
  edges = [];

  oldEdges.forEach(edge => {
    let check = countNeighborsDeep(edge.row, edge.col, 1);
    if (check != 1) {
      edges.push(edge);
    }
  });
}

function countNeighborsDeep(row, col, depth) {
  let neighbors = getNeighborsDeep(row, col, depth);
  let total = 0;
  let neighborCount = 0;
  neighbors.forEach(n => {
    total++;
    if (grid[n.r][n.c] && grid[n.r][n.c].drawn) {
      neighborCount++;
    }
  });

  return neighborCount / total;
}

function getNeighborsDeep(row, col, depth) {
  let neighbors = [];
  for (let r = row - depth; r <= row + depth; r++) {
    let a1 = 0; //odd-row adjustment
    let a2 = Math.abs(r - row); //row size adjustment??
    let lA = Math.ceil(a2 / 2); //left adjustment
    let rA = a2 - lA; //right adjustment
    for (let c = col - depth + lA; c <= col + depth - rA; c++) {
      if (row % 2 === 0 && r % 2 === 1) {
        a1 = 1;
      }
      neighbors.push({ r: r, c: c - a1 });
    }
  }
  return neighbors;
}

function getXY(row, col) {
  let x = 0;
  let y = 0;
  if (row % 2 === 1) {
    x = col * SIZE * 0.866 + SIZE * 0.433;
  } else {
    x = col * SIZE * 0.866;
  }
  y = row * SIZE * 0.75;
  return {
    x: x,
    y: y
  };
}

function draw() {
  edges.forEach(edge => {
    if (!grid[edge.row][edge.col].drawn) {
      let xy = getXY(edge.row, edge.col);
      // console.log(edge);
      // console.log(xy);
      ctx.fillRect(xy.x, xy.y, SIZE * 0.866, SIZE);
      grid[edge.row][edge.col].drawn = true;
    }
  });
}

addEdge(ORIGIN.x, ORIGIN.y, 0);
grow();
