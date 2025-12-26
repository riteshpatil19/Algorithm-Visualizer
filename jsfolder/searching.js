document.addEventListener("DOMContentLoaded", () => {

  const algorithmSelect = document.getElementById("algorithmSelect");
  const sizeRange = document.getElementById("sizeRange");
  const speedRange = document.getElementById("speedRange");
  const searchInput = document.getElementById("searchInput");

  const sizeValue = document.getElementById("sizeValue");
  const speedValue = document.getElementById("speedValue");

  const generateBtn = document.getElementById("generateBtn");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const backBtn = document.getElementById("backBtn");

  const barsContainer = document.getElementById("bars");
  const statusLabel = document.getElementById("statusLabel");
  const currentAlgoLabel = document.getElementById("currentAlgoLabel");

  let isSearching = false;
  console.log("✅ searching.js is connected");

  /* ========== SLEEP ========== */
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  /* ========== UPDATE LABELS ========== */
  function updateLabels() {
    sizeValue.textContent = sizeRange.value;
    speedValue.textContent = speedRange.value;
    currentAlgoLabel.textContent =
      algorithmSelect.options[algorithmSelect.selectedIndex].text;
  }

  /* ========== GENERATE ARRAY ========== */
  function generateArray() {
    if (isSearching) return;

    barsContainer.innerHTML = "";
    let values = [];

    for (let i = 0; i < sizeRange.value; i++) {
      values.push(Math.floor(Math.random() * 90) + 10);
    }

    // ✅ Sort if Binary Search is selected
    if (algorithmSelect.value === "binary") {
      values.sort((a, b) => a - b);
    }

    values.forEach(v => {
      const box = document.createElement("div");
      box.classList.add("bar");
      box.dataset.value = v;
      box.textContent = v;
      barsContainer.appendChild(box);
    });

    statusLabel.textContent = "✅ Array Generated";
  }

  /* ========== RESET ========== */
  function resetArray() {
    if (isSearching) return;

    document.querySelectorAll(".bar").forEach(box => {
      box.classList.remove("active", "found", "notfound");
    });

    statusLabel.textContent = "✅ Reset done";
  }

  /* ========== LINEAR SEARCH ========== */
  async function linearSearch() {

    const boxes = document.querySelectorAll(".bar");
    const target = parseInt(searchInput.value);

    if (isNaN(target)) {
      alert("Enter a value to search");
      return;
    }

    isSearching = true;
    statusLabel.textContent = "🔍 Linear Search running...";

    for (let i = 0; i < boxes.length; i++) {

      if (!isSearching) return;
      boxes[i].classList.add("active");
      await sleep(speedRange.value);

      if (parseInt(boxes[i].dataset.value) === target) {
        boxes[i].classList.remove("active");
        boxes[i].classList.add("found");
        statusLabel.textContent = `✅ Found at index ${i}`;
        isSearching = false;
        return;
      }

      boxes[i].classList.remove("active");
    }

    statusLabel.textContent = `❌ ${target} Not Found`;
    isSearching = false;
  }

  /* ========== BINARY SEARCH ========== */
  async function binarySearch() {

    let boxes = document.querySelectorAll(".bar");
    const target = parseInt(searchInput.value);

    if (isNaN(target)) {
      alert("Enter a value to search");
      return;
    }

    // ✅ Sort values again to be 100% correct
    let values = Array.from(boxes).map(b => parseInt(b.dataset.value));
    values.sort((a, b) => a - b);

    // ✅ Rebuild boxes with sorted values
    barsContainer.innerHTML = "";
    values.forEach(v => {
      const box = document.createElement("div");
      box.classList.add("bar");
      box.dataset.value = v;
      box.textContent = v;
      barsContainer.appendChild(box);
    });

    boxes = document.querySelectorAll(".bar");

    let low = 0;
    let high = boxes.length - 1;

    isSearching = true;
    statusLabel.textContent = "🔍 Binary Search running...";

    while (low <= high && isSearching) {

      let mid = Math.floor((low + high) / 2);

      boxes.forEach(box => box.classList.remove("active"));

      boxes[mid].classList.add("active");
      await sleep(speedRange.value);

      const value = parseInt(boxes[mid].dataset.value);

      if (value === target) {
        boxes[mid].classList.remove("active");
        boxes[mid].classList.add("found");
        statusLabel.textContent = `✅ Found at index ${mid}`;
        isSearching = false;
        return;
      }

      else if (value < target) {
        low = mid + 1;
      }
      else {
        high = mid - 1;
      }

      boxes[mid].classList.remove("active");
    }

    statusLabel.textContent = `❌ ${target} Not Found`;
    isSearching = false;
  }

  /* ========== START SEARCH ========== */
  function startVisualization() {
    if (isSearching) return;

    if (algorithmSelect.value === "linear") {
      linearSearch();
    }
    else if (algorithmSelect.value === "binary") {
      binarySearch();
    }
  }

  /* ========== BACK BUTTON ========== */
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      isSearching = false;

      document.querySelectorAll(".bar").forEach(box => {
        box.classList.remove("active", "found", "notfound");
      });

      window.history.back();
      // Or use: window.location.href = "../index.html";
    });
  }

  /* ========== EVENTS ========== */
  sizeRange.addEventListener("input", updateLabels);
  speedRange.addEventListener("input", updateLabels);

  algorithmSelect.addEventListener("change", () => {
    updateLabels();
    if (algorithmSelect.value === "binary") {
      generateArray();   // auto sorted
    }
  });

  generateBtn.addEventListener("click", generateArray);
  resetBtn.addEventListener("click", resetArray);
  startBtn.addEventListener("click", startVisualization);

  /* ========== AUTO START ========== */
  updateLabels();
  generateArray();

});
