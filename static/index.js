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
  tensor = tf.browser.fromPixels(document.querySelector("#inputCanvas"));
  tensor = tf.image.resizeBilinear(tensor, [28, 28]);
  tensor = tf.sum(tensor.mul(rgb.toFloat().div(255.0)), 2);
  tf.browser.toPixels(tensor, document.querySelector("#previewCanvas"));

  // Populate confidence chart
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawConfidenceChart);
}
