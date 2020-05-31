// The following code includes an excerpt from "Using Touch Events with the HTML5 Canvas" by Ben Centra
// http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html

const classify_btn = document.getElementById("classify");
classify_btn.addEventListener("click", () => {
  // Disable the button and show a loading animation
  classify_btn.disabled = true;
  classify_btn.classList.add("is-loading");
  
  classify();
  // Revert to normal state
  classify_btn.classList.remove("is-loading");
  classify_btn.disabled = false;
});

function drawConfidenceChart() {
  // Currently a placeholder
  let data = google.visualization.arrayToDataTable([
    ["Digit", "Density"],
    ["0", 0.94],
    ["1", 0.49],
    ["2", 0.3],
    ["3", 0.15],
    ["4", 0.45],
    ["5", 0.15],
    ["6", 0.45],
    ["7", 0.25],
    ["8", 0.45],
    ["9", 0.65],
  ]);

  let options = {
    width: 300,
    height: 400,
    backgroundColor: { fill: "transparent" },
    legend: { position: "none" },
    chartArea: { width: "100%", height: "80%" },
  };
  let chart = new google.visualization.ColumnChart(
    document.getElementById("confidence_chart")
  );
  chart.draw(data, options);
}

const rgb = tf.tensor1d([0.2989, 0.587, 0.114]);
function classify() {
  // TODO Classify the digit

  // Render the preview aka what the network receives
  tensor = tf.browser.fromPixels(canvas);
  tensor = tf.image.resizeBilinear(tensor, [28, 28]);
  tensor = tf.sum(tensor.mul(rgb.toFloat().div(255.0)), 2);
  tf.browser.toPixels(tensor, previewCanvas);

  // Populate confidence chart
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawConfidenceChart);
}

const canvas = document.querySelector("#inputCanvas");
const previewCanvas = document.querySelector("#previewCanvas");
const ctx = canvas.getContext("2d");
const previewCtx = previewCanvas.getContext("2d");

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {
  // Clear both canvases
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
});

ctx.lineCap = "round";
ctx.lineWidth = 15;
ctx.strokeStyle = "#FFFFFF";

let drawing = false;
canvas.addEventListener("mousedown", e => {
  drawing = true;
  updatePosition(e);
});
canvas.addEventListener("click", e => {
  // Register and draw single taps/clicks, events for which `mousemove` normally does not fire
  drawing = true;
  updatePosition(e);
  draw(e);
  drawing = false;
});
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => stopDraw());
canvas.addEventListener("mouseout", () => stopDraw());

let position = { x: 0, y: 0 };

function stopDraw() {
  isDrawing = false;
}

function updatePosition(e) {
  position = {
    x: e.clientX - canvas.getBoundingClientRect().left,
    y: e.clientY - canvas.getBoundingClientRect().top,
  };
}

function draw(e) {
  if (!drawing) return;
  // Draw a path from the previous cursor position to the current
  ctx.beginPath();
  ctx.moveTo(position.x, position.y);
  updatePosition(e);
  ctx.lineTo(position.x, position.y);
  ctx.stroke();
}

// Handle touch inputs just like mouse inputs.
// Adpoted from Ben Centra with minor modifications
canvas.addEventListener(
  "touchstart",
  e => {
    mousePos = getTouchPos(canvas, e);
    let touch = e.touches[0];
    let mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
canvas.addEventListener(
  "touchend",
  e => {
    let mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
canvas.addEventListener(
  "touchmove",
  e => {
    let touch = e.touches[0];
    let mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  let rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top,
  };
}
