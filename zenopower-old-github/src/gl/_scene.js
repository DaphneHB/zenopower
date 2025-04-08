import { Transform } from "ogl";
import { Screen } from "./screen/";
import { Battery } from "./battery/index.js";
import { loadAssets } from "./util/loader.js";

import Hey from "../hey.js";

export class Scene extends Transform {
  isOn = true;

  constructor(gl, data = {}) {
    super();
    this.gl = gl;
    queueMicrotask(() => this.create(data));
  }

  async load() {
    this.assets = await loadAssets(this.gl);
    // console.log(":::", this.assets);
  }

  async create() {
    // 1. create BG
    this.bg = new Screen(this.gl);
    this.bg.setParent(this);
    Hey.LOAD = "screen";

    // 2. load assets
    console.time("::load");
    await this.load();

    // 3. create model
    this.battery = new Battery(this.gl);
    this.battery.setParent(this);

    this.trackBattery = new Battery(this.gl, "[data-mark='battery']");
    this.trackBattery.setParent(this);

    console.timeEnd("::load");
    Hey.LOAD = "full";

    if (Hey.MOBILE) {
      this.trackBattery.visible = false;
    }

    Hey.on("MOBILE", (mobile) => {
      if (mobile) {
        this.trackBattery.visible = false;
      } else {
        this.trackBattery.visible = true;
      }
    });
  }

  render(t) {
    if (!this.isOn) return;
    this.bg?.render(t);
    this.battery?.render(t);
    this.trackBattery?.render(t);
  }

  resize(vp) {
    this.bg?.resize(vp);
    this.battery?.resize(vp);
    this.trackBattery?.resize(vp);
  }
}
