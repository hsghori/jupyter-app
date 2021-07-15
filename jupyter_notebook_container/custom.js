events.on("notebook_saved.Notebook", function () {
  console.log("Notebook - Saved");
  window.parent.postMessage("SAVED", "http://locahost");
  window.parent.postMessage("SAVED", "http://locahost:3000");
});
