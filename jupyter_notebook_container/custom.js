define(["base/js/namespace", "base/js/events"], function (Jupyter, events) {
  events.on("notebook_saved.Notebook", function () {
    console.log("Notebook - Saved");
    window.parent.postMessage("SAVED", "http://localhost");
  });
});
