function warn_iOSSafari() {
  let ua = window.navigator.userAgent;
  let iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  let webkit = !!ua.match(/WebKit/i);
  let iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

  if (iOS) {
    alert("Drawing may not work well on iOS and iPadOS");
  }
}
warn_iOSSafari();

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

function changeOutputVisibility(visible) {
  let state = visible ? "initial" : "none";
  document.querySelector("#preproccessed_input_column").style.display = state;
  document.querySelector("#classification_column").style.display = state;
  document.querySelector("#confidence_column").style.display = state;
}

let predictions;
async function classify() {
  const model = await tf.loadLayersModel("./model.json");

  changeOutputVisibility(true);
  // Render the preview aka what the network receives
  tensor = tf.browser.fromPixels(document.querySelector("#inputCanvas"));
  tensor = tf.image.resizeBilinear(tensor, [28, 28]);
  tensor = tensor.mean(2).div(255).toFloat().expandDims(-1);
  tf.browser.toPixels(tensor, document.querySelector("#previewCanvas"));

  // For some reason the converted model, wants an extra dimension.
  // no idea why but .expandDims(0) is a workaround
  predictions = model.predict(tensor.expandDims(0)).dataSync();
  // Find the most likely prediction
  const max_confidence = predictions.reduce(function (a, b) {
    return Math.max(a, b);
  });
  function equals_max_confidence(confidence) {
    return max_confidence == confidence;
  }

  const result = predictions.findIndex(equals_max_confidence);
  document.getElementById("classification").innerHTML = result;
  // Populate confidence chart
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawConfidenceChart);
}

function drawConfidenceChart() {
  // Prepare the data for visualization
  // Convert from a typed array to a regular one then add the index to each element
  const v = Array.prototype.slice
    .call(predictions)
    .map((x, i) => [i.toString(), x]);
  v.unshift(new Array("Digit", "Confidence"));
  let data = google.visualization.arrayToDataTable(v);

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
