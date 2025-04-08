import GUI from "lil-gui";

window.gui = new GUI();

gui.params = {
  // progress: 0,
  bgPower: 0.9,
  // lightColor1: "#D9E5EF",
  lightColor1: "#bccedd",
  lightColor2: "#c4dce5",
};

let visible = false;
gui.hide();

if (visible) {
  gui.show();
}

document.addEventListener("keydown", (e) => {
  // check shift g
  if (e.key === "G" && e.shiftKey) {
    if (visible) {
      gui.hide();
      visible = false;
    } else {
      gui.show();
      visible = true;
    }
  }
});

gui.add(gui.params, "bgPower", 0, 1, 0.01);
gui.add(gui.params, "lightColor1");
gui.add(gui.params, "lightColor2");

export { visible };
