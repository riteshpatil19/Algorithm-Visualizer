document.addEventListener("DOMContentLoaded", () => {

const svg = document.getElementById("graphArea");
const algorithmSelect = document.getElementById("algorithmSelect");
const nodeRange = document.getElementById("nodeRange");
const nodeValue = document.getElementById("nodeValue");
const speedRange = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");

const startInput = document.getElementById("startNodeInput");
const endInput = document.getElementById("endNodeInput");

const generateBtn = document.getElementById("generateGraphBtn");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const clearBtn = document.getElementById("clearBtn");

const statusLabel = document.getElementById("statusLabel");
const currentAlgoLabel = document.getElementById("currentAlgoLabel");
const backBtn = document.getElementById("backBtn");

if (backBtn) {
  backBtn.addEventListener("click", () => {
    isRunning = false;
    svg.innerHTML = "";
    window.history.back();

    // OR
    // window.location.href = "../index.html";
  });
}


let nodes = [];
let edges = [];
let graph = {};
let isRunning = false;

// ========== UTILITY ==========
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ========== UPDATE LABELS ==========
function updateLabels() {
  nodeValue.textContent = nodeRange.value;
  speedValue.textContent = speedRange.value;
  currentAlgoLabel.textContent =
    algorithmSelect.options[algorithmSelect.selectedIndex].text;
}

// ========== GENERATE GRAPH ==========
function generateGraph() {
  svg.innerHTML = "";
  nodes = [];
  edges = [];
  graph = {};

  const count = parseInt(nodeRange.value);
  const width = svg.clientWidth;
  const height = svg.clientHeight;

  for (let i = 0; i < count; i++) {
    const x = Math.random() * (width - 60) + 30;
    const y = Math.random() * (height - 60) + 30;

    nodes.push({ id: i, x, y });
    graph[i] = [];
  }

  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      if (Math.random() < 0.2) {
        edges.push([i, j]);
        graph[i].push({ node: j, weight: 1 });
        graph[j].push({ node: i, weight: 1 });
      }
    }
  }

  drawGraph();
  statusLabel.textContent = "Graph Generated ✅";
}

// ========== DRAW GRAPH ==========
function drawGraph() {
  svg.innerHTML = "";

  edges.forEach(([a, b]) => {
    const n1 = nodes[a];
    const n2 = nodes[b];

    const line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1", n1.x);
    line.setAttribute("y1", n1.y);
    line.setAttribute("x2", n2.x);
    line.setAttribute("y2", n2.y);
    line.setAttribute("stroke", "#4b5563");
    line.setAttribute("stroke-width", "2");

    svg.appendChild(line);
  });

  nodes.forEach(node => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", 18);
    circle.setAttribute("fill", "#1e293b");
    circle.setAttribute("stroke", "#3b82f6");
    circle.setAttribute("stroke-width", "2");
    circle.classList.add("node");
    circle.dataset.id = node.id;

    svg.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x", node.x);
    text.setAttribute("y", node.y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "12px");
    text.textContent = node.id;

    svg.appendChild(text);
  });
}

// ========== COLOR NODE ==========
function setNodeColor(id, color) {
  document.querySelectorAll(".node").forEach(n => {
    if (parseInt(n.dataset.id) === id) {
      n.setAttribute("fill", color);
    }
  });
}

// ========== RESET ==========
function resetGraph() {
  isRunning = false;
  drawGraph();
  statusLabel.textContent = "Graph Reset 🔄";
}

// ========== CLEAR ==========
function clearGraph() {
  isRunning = false;
  svg.innerHTML = "";
  statusLabel.textContent = "Graph Cleared ❌";
}

// ========== GET START ==========
function getStartNode() {
  let start = parseInt(startInput.value);
  if (isNaN(start) || start >= nodes.length) start = 0;
  return start;
}

function getEndNode() {
  let end = parseInt(endInput.value);
  if (isNaN(end) || end >= nodes.length) end = nodes.length - 1;
  return end;
}

// ========== BFS ==========
async function bfs() {

  let start = getStartNode();
  let visited = {};
  let queue = [start];

  statusLabel.textContent = "BFS Running...";
  isRunning = true;

  while (queue.length && isRunning) {
    const node = queue.shift();
    if (visited[node]) continue;

    visited[node] = true;
    setNodeColor(node, "#f97316");
    await sleep(speedRange.value);

    setNodeColor(node, "#22c55e");

    for (let n of graph[node]) {
      if (!visited[n.node]) queue.push(n.node);
    }
  }

  statusLabel.textContent = "BFS Completed ✅";
  isRunning = false;
}

// ========== DFS ==========
async function dfs(node, visited = {}) {
  if (!isRunning || visited[node]) return;

  visited[node] = true;
  setNodeColor(node, "#f97316");
  await sleep(speedRange.value);
  setNodeColor(node, "#22c55e");

  for (let n of graph[node]) {
    await dfs(n.node, visited);
  }
}

// ========== DIJKSTRA ==========
async function dijkstra() {
  const start = getStartNode();
  const end = getEndNode();

  let dist = {};
  let prev = {};
  let unvisited = new Set(nodes.map(n => n.id));

  nodes.forEach(n => dist[n.id] = Infinity);
  dist[start] = 0;

  isRunning = true;
  statusLabel.textContent = "Dijkstra Running...";

  while (unvisited.size && isRunning) {
    let current = [...unvisited].reduce((a,b)=> dist[a] < dist[b] ? a : b);

    if (current == end) break;

    unvisited.delete(current);

    setNodeColor(current, "#f97316");
    await sleep(speedRange.value);

    for (let n of graph[current]) {
      let alt = dist[current] + n.weight;
      if (alt < dist[n.node]) {
        dist[n.node] = alt;
        prev[n.node] = current;
      }
    }

    setNodeColor(current, "#22c55e");
  }

  // shortest path
  let cur = end;
  while (cur !== undefined) {
    setNodeColor(cur, "#22c55e");
    cur = prev[cur];
  }

  statusLabel.textContent = "Dijkstra Path Found ✅";
  isRunning = false;
}

// ========== A* ==========
function heuristic(a, b) {
  const nodeA = nodes[a];
  const nodeB = nodes[b];
  return Math.sqrt((nodeA.x - nodeB.x)**2 + (nodeA.y - nodeB.y)**2);
}

async function aStar() {

  const start = getStartNode();
  const end = getEndNode();

  let open = [start];
  let cameFrom = {};
  let g = {};
  let f = {};

  nodes.forEach(n => { g[n.id] = Infinity; f[n.id] = Infinity; });

  g[start] = 0;
  f[start] = heuristic(start, end);

  isRunning = true;
  statusLabel.textContent = "A* Running...";

  while (open.length && isRunning) {

    let current = open.reduce((a,b) => f[a] < f[b] ? a : b);

    if (current === end) break;

    open = open.filter(n => n !== current);

    setNodeColor(current, "#f97316");
    await sleep(speedRange.value);

    for (let n of graph[current]) {
      let tempG = g[current] + 1;

      if (tempG < g[n.node]) {
        cameFrom[n.node] = current;
        g[n.node] = tempG;
        f[n.node] = g[n.node] + heuristic(n.node, end);

        if (!open.includes(n.node)) open.push(n.node);
      }
    }

    setNodeColor(current, "#22c55e");
  }

  // path
  let cur = end;
  while (cur !== undefined) {
    setNodeColor(cur, "#22c55e");
    cur = cameFrom[cur];
  }

  statusLabel.textContent = "A* Path Found ✅";
  isRunning = false;
}

// ========== START ==========
async function startAlgorithm() {
  if (isRunning) return;

  resetGraph();
  isRunning = true;

  if (algorithmSelect.value === "bfs") {
    await bfs();
  }

  else if (algorithmSelect.value === "dfs") {
    statusLabel.textContent = "DFS Running...";
    await dfs(getStartNode(), {});
    statusLabel.textContent = "DFS Completed ✅";
    isRunning = false;
  }

  else if (algorithmSelect.value === "dijkstra") {
    await dijkstra();
  }

  else if (algorithmSelect.value === "astar") {
    await aStar();
  }
}

// ========== EVENTS ==========
nodeRange.addEventListener("input", updateLabels);
speedRange.addEventListener("input", updateLabels);
algorithmSelect.addEventListener("change", updateLabels);

generateBtn.addEventListener("click", generateGraph);
resetBtn.addEventListener("click", resetGraph);
clearBtn.addEventListener("click", clearGraph);
startBtn.addEventListener("click", startAlgorithm);

updateLabels();
generateGraph();

});
