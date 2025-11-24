document.addEventListener("DOMContentLoaded", () => {

const algorithmSelect = document.getElementById("algorithmSelect");
const sizeRange = document.getElementById("sizeRange");
const speedRange = document.getElementById("speedRange");
const sizeValue = document.getElementById("sizeValue");
const speedValue = document.getElementById("speedValue");

const generateBtn = document.getElementById("generateBtn");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const barsContainer = document.getElementById("bars");
const statusLabel = document.getElementById("statusLabel");
const currentAlgoLabel = document.getElementById("currentAlgoLabel");
const backBtn = document.getElementById("backBtn");

let isSorting = false;
let arr = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/************ LABELS *************/
function updateLabels() {
  sizeValue.textContent = sizeRange.value;
  speedValue.textContent = speedRange.value;
  currentAlgoLabel.textContent =
    algorithmSelect.options[algorithmSelect.selectedIndex].text;
}

/************ GENERATE *************/
function generateArray() {
  if (isSorting) return;

  arr = [];
  barsContainer.innerHTML = "";

  for (let i = 0; i < sizeRange.value; i++) {
    let value = Math.floor(Math.random() * 90) + 10;
    arr.push(value);

    let box = document.createElement("div");
    box.classList.add("bar");
    box.dataset.value = value;
    box.textContent = value;

    barsContainer.appendChild(box);
  }

  statusLabel.textContent = "New array generated ✅";
}

/************ RESET *************/
function resetArray() {
  if (isSorting) return;

  document.querySelectorAll(".bar").forEach(b=>{
    b.classList.remove("active","sorted");
  });

  statusLabel.textContent = "Reset done";
}

/************ SWAP *************/
function swap(a, b) {
  let temp = a.dataset.value;
  let tempText = a.textContent;

  a.dataset.value = b.dataset.value;
  a.textContent = b.textContent;

  b.dataset.value = temp;
  b.textContent = tempText;
}

/************ BUBBLE SORT *************/
async function bubbleSort() {
  const boxes = document.querySelectorAll(".bar");
  let values = [...boxes].map(b => Number(b.dataset.value));

  isSorting = true;
  statusLabel.textContent = "Bubble Sort running...";

  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values.length - i - 1; j++) {

      if (!isSorting) return;

      boxes[j].classList.add("active");
      boxes[j+1].classList.add("active");
      await sleep(speedRange.value);

      if (values[j] > values[j + 1]) {
        [values[j], values[j + 1]] = [values[j + 1], values[j]];
        swap(boxes[j], boxes[j+1]);
      }

      boxes[j].classList.remove("active");
      boxes[j+1].classList.remove("active");
    }

    boxes[values.length - i - 1].classList.add("sorted");
  }

  isSorting = false;
  statusLabel.textContent = "Done ✅";
}

/************ SELECTION SORT *************/
async function selectionSort() {
  const boxes = document.querySelectorAll(".bar");
  let values = [...boxes].map(b => Number(b.dataset.value));

  isSorting = true;
  statusLabel.textContent = "Selection Sort running...";

  for (let i = 0; i < values.length; i++) {
    let min = i;

    boxes[min].classList.add("active");
    
    for (let j = i + 1; j < values.length; j++) {
      boxes[j].classList.add("active");
      await sleep(speedRange.value);

      if (values[j] < values[min]) {
        boxes[min].classList.remove("active");
        min = j;
        boxes[min].classList.add("active");
      } else {
        boxes[j].classList.remove("active");
      }
    }

    if (min !== i) {
      [values[i], values[min]] = [values[min], values[i]];
      swap(boxes[i], boxes[min]);
    }

    boxes[i].classList.remove("active");
    boxes[i].classList.add("sorted");
  }

  isSorting = false;
  statusLabel.textContent = "Done ✅";
}

/************ INSERTION SORT *************/
async function insertionSort() {
  const boxes = document.querySelectorAll(".bar");
  let values = [...boxes].map(b => Number(b.dataset.value));

  isSorting = true;
  statusLabel.textContent = "Insertion Sort running...";

  for (let i = 1; i < values.length; i++) {
    let key = values[i];
    let j = i - 1;

    boxes[i].classList.add("active");
    await sleep(speedRange.value);

    while (j >= 0 && values[j] > key) {
      if (!isSorting) return;

      values[j + 1] = values[j];
      swap(boxes[j], boxes[j + 1]);
      j--;

      await sleep(speedRange.value);
    }

    values[j + 1] = key;
    boxes[i].classList.remove("active");
  }

  boxes.forEach(b=>b.classList.add("sorted"));
  isSorting = false;
  statusLabel.textContent = "Done ✅";
}

/************ QUICK SORT *************/
async function quickSort(start, end, boxes, values) {
  if (start >= end) return;

  let index = await partition(start, end, boxes, values);
  await quickSort(start, index - 1, boxes, values);
  await quickSort(index + 1, end, boxes, values);
}

async function partition(start, end, boxes, values) {
  let pivot = values[end];
  let i = start;

  for (let j = start; j < end; j++) {

    boxes[j].classList.add("active");
    await sleep(speedRange.value);

    if (values[j] < pivot) {
      [values[i], values[j]] = [values[j], values[i]];
      swap(boxes[i], boxes[j]);
      i++;
    }

    boxes[j].classList.remove("active");
  }

  [values[i], values[end]] = [values[end], values[i]];
  swap(boxes[i], boxes[end]);

  return i;
}

/************ START QUICK *************/
async function runQuick() {
  let boxes = document.querySelectorAll(".bar");
  let values = [...boxes].map(b=>Number(b.dataset.value));

  isSorting = true;
  statusLabel.textContent = "Quick Sort running...";

  await quickSort(0, values.length-1, boxes, values);

  boxes.forEach(b=>b.classList.add("sorted"));
  isSorting = false;
  statusLabel.textContent = "Done ✅";
}

/************ MERGE SORT *************/
async function mergeSort(arr, l, r, boxes) {
  if (l >= r) return;

  const mid = Math.floor((l + r) / 2);

  await mergeSort(arr, l, mid, boxes);
  await mergeSort(arr, mid + 1, r, boxes);
  await merge(arr, l, mid, r, boxes);
}

async function merge(arr, l, m, r, boxes) {
  let left = arr.slice(l, m+1);
  let right = arr.slice(m+1, r+1);

  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    if (!isSorting) return;

    boxes[k].classList.add("active");
    await sleep(speedRange.value);

    if (left[i] < right[j]) {
      arr[k] = left[i++];
    } else {
      arr[k] = right[j++];
    }

    boxes[k].textContent = arr[k];
    boxes[k].dataset.value = arr[k];
    boxes[k].classList.remove("active");
    k++;
  }

  while (i < left.length) {
    arr[k] = left[i++];
    boxes[k].textContent = arr[k];
    boxes[k].dataset.value = arr[k];
    k++;
  }

  while (j < right.length) {
    arr[k] = right[j++];
    boxes[k].textContent = arr[k];
    boxes[k].dataset.value = arr[k];
    k++;
  }
}

/************ START MERGE *************/
async function runMerge() {
  let boxes = document.querySelectorAll(".bar");
  let values = [...boxes].map(b=>Number(b.dataset.value));

  isSorting = true;
  statusLabel.textContent = "Merge Sort running...";

  await mergeSort(values, 0, values.length-1, boxes);

  boxes.forEach(b=>b.classList.add("sorted"));
  isSorting = false;
  statusLabel.textContent = "Done ✅";
}

/************ START *************/
async function startVisualization() {
  if (isSorting) return;

  let algo = algorithmSelect.value;

  if (algo === "bubble") await bubbleSort();
  if (algo === "selection") await selectionSort();
  if (algo === "insertion") await insertionSort();
  if (algo === "quick") await runQuick();
  if (algo === "merge") await runMerge();
}

/************ EVENTS *************/
generateBtn.addEventListener("click", generateArray);
resetBtn.addEventListener("click", resetArray);
startBtn.addEventListener("click", startVisualization);

sizeRange.addEventListener("input", updateLabels);
speedRange.addEventListener("input", updateLabels);

/************ BACK *************/
backBtn.addEventListener("click", () => {
  isSorting = false;
  window.history.back();
});

/************ AUTO *************/
updateLabels();
generateArray();

});
