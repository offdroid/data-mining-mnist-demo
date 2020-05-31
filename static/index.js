// The following code includes an excerpt from "Using Touch Events with the HTML5 Canvas" by Ben Centra
// http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
//
const predictButton = document.getElementById("predict");
predictButton.addEventListener("click", () => {
  predictButton.disabled = true;
  predictButton.classList.add("is-loading");
  predict();
  predictButton.classList.remove("is-loading");
  predictButton.disabled = false;
});

function drawConfidenceChart() {
  var data = google.visualization.arrayToDataTable([
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

  var options = {
    width: 300,
    height: 400,
    backgroundColor: { fill: "transparent" },
    legend: { position: "none" },
    chartArea: { width: "100%", height: "80%" },
  };
  var chart = new google.visualization.ColumnChart(
    document.getElementById("confidence_chart")
  );
  chart.draw(data, options);
}

function predict() {
  // TODO Predict

  // Render the preview aka what the network receives
  tensor = tf.browser.fromPixels(canvas);
  tensor = tf.image.resizeNearestNeighbor(tensor, [28, 28]);
  // TODO Proper grayscale
  tensor = tensor.mean(2).toFloat().div(255.0);
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
});

ctx.lineCap = "round";
ctx.lineWidth = 15;
ctx.strokeStyle = "#FFFFFF";

let drawing = false;
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  updatePosition(e);
});
canvas.addEventListener("click", (e) => {
  // Register and draw single taps/clicks, events for which `mousemove` normally does not fire
  drawing = true;
  updatePosition(e);
  draw(e);
  drawing = false;
});
canvas.addEventListener("mousemove", (e) => draw(e));
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
// Code by Ben Centra
canvas.addEventListener(
  "touchstart",
  function (e) {
    mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
canvas.addEventListener(
  "touchend",
  function (e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
canvas.addEventListener(
  "touchmove",
  function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top,
  };
}
