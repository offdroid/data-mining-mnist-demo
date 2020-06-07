const canvas = document.querySelector("#inputCanvas");
const previewCanvas = document.querySelector("#previewCanvas");
const ctx = canvas.getContext("2d");
const previewCtx = previewCanvas.getContext("2d");

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {
  // Clear both canvases
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  changeOutputVisibility(false);
  stopDraw();
});

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineCap = "round";
ctx.lineWidth = 15;
ctx.strokeStyle = "white";

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
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseout", stopDraw);
setupTouchInput(canvas);

let position = { x: 0, y: 0 };

function stopDraw() {
  drawing = false;
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
