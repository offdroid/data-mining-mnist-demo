// Handle touch inputs just like mouse inputs.
//
// Disclaimer: The following code is an ADAPTATION of "Using Touch Events with the HTML5 Canvas" by BEN CENTRA
// http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
function setupTouchInput(canvas) {
  canvas.addEventListener(
    "touchstart",
    (e) => {
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
    (e) => {
      let mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    },
    false
  );
  canvas.addEventListener(
    "touchmove",
    (e) => {
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
}
