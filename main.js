///////////////////////////
//GLOBAL VARIABLES
///////////////////////////
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(255,255,255,1)";

const SIZE = 2;
const GEN = 100;
const SPEED = 10;
const ORIGIN = {
  x: parseInt(300 / SIZE), 
  y: parseInt(300 / SIZE)
}

// const thresholds = [3,4];
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
let threshold = 0;

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2)^2 + (y1 - y2)^2);
}

function createFlake(row, col, n) {
  return {
    row: row,
    col: col,
    n: n
  };
}

function addEdge(row, col, n) {
  const flake = createFlake(row, col, n);
  grid[row][col] = flake;
  edges.push(flake);
}

function grow() {
  if (gen > GEN) return;
  // console.log("gen: " + gen);
  // console.log(edges);
  
  if (gen % 1 === 0) {
    threshold = Math.random() / (gen / 10) + .05;
    // threshold = 4;

  }
  gen++;
  draw();
  let oldEdges = [...edges];
  edges = [];
  oldEdges.forEach((edge, i) => {
    let noNeighbors = true;
    if (edge.row % 2 === 1) {
      noNeighbors = visitNeighbors(edge, oddNeighbors);
    } else {
      noNeighbors = visitNeighbors(edge, evenNeighbors);
    }
    if (!noNeighbors) {
      edges.push(edge);
    }
  });
  setTimeout(() => grow(), SPEED);
}

function visitNeighbors(edge, neighbors) {
  let noNeighbors = true;
  neighbors.forEach(n => {
    let row = edge.row + n.r;
    let col = edge.col + n.c;
    if (!grid[row][col]) {
      let depth = Math.floor(gen/20) + 1
      let neighborCount = countNeighborsDeep(row, col, depth);
      if (threshold >= neighborCount) {
        addEdge(row, col, 1);
      } else {
        noNeighbors = false;
      }
    }
  });
  return noNeighbors;
}

function countNeighborsDeep(row, col, depth) {
  // console.log("--------" + row + ", " + col);
  let neighborCount = 0;
  let total = 0;
  for (let r = row - depth; r <= row + depth; r++) {
    let a1 = 0; //odd-row adjustment
    // console.log("\n");
    let a2 = Math.abs(r - row); //row size adjustment??
    let lA = Math.ceil(a2/2); //left adjustment
    let rA = a2 - lA; //right adjustment
    for (let c = col - depth + lA; c <= col + depth - rA; c++) {
      total++;
      if (row % 2 === 0 && r % 2 === 1) {
        a1 = 1;
      }
      // console.log((c - a1) + " ");
      if (grid[r][c - a1] && grid[r][c - a1].drawn) {
        neighborCount++;
      }
    }
  }
  return neighborCount/total;
}

function countNeighbors(row, col) {
    const neighbors = row % 2 === 1 ? oddNeighbors : evenNeighbors;
    let nCount = 0;
    neighbors.forEach(n => {
      let r = row + n.r;
      let c = col + n.c;
      if (grid[r][c] && grid[r][c].drawn) {
        nCount++;
      }
    });
    return nCount;
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
