import { Renderer, Orbit, Vec3 } from "ogl";
import { Cam } from "./camera.js";
import { Scene } from "./_scene.js";
import { lerp } from "../util/math.js";

export const params = {
  clearColor: [0, 0, 0, 0],
};

export class Gl {
  static time = 0;
  static mouse = { x: 0, y: 0, ex: 0, ey: 0 };

  static {
    this.vp = {
      container: document.querySelector('[data-gl="c"]'),
      w: window.innerWidth,
      h: window.innerHeight,
      aspect: () => {
        return this.vp.w / this.vp.h;
      },
      dpr: () => {
        return Math.min(window.devicePixelRatio, 2);
      },
    };

    this.renderer = new Renderer({
      dpr: this.vp.dpr(),
      antialias: true,
      alpha: true,
    });

    this.gl = this.renderer.gl;
    this.gl.clearColor(...params.clearColor);

    this.vp.container.appendChild(this.gl.canvas);

    this.camera = new Cam(this.gl, {});
    this.camera.position.set(0, 0, 5);
    // this.camera.lookAt([0, 0, 0]);

    this.scene = new Scene(this.gl);
    this.time = 0;

    handleResize(this.vp.container, this.resize.bind(this));
    this.initEvents();

    // this.controls = new Orbit(this.camera, {
    //   target: new Vec3(0, 0, 0),
    // });
  }

  static initEvents() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX / this.vp.w;
      this.mouse.y = 1.0 - e.clientY / this.vp.h;
    });
  }

  static render() {
    this.time += 0.005;

    this.mouse.ex = lerp(this.mouse.ex, this.mouse.x, 0.05);
    this.mouse.ey = lerp(this.mouse.ey, this.mouse.y, 0.05);

    this.controls?.update();
    this.scene?.render(this.time);

    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
    });
  }

  static resize({ width, height }) {
    this.vp.w = width;
    this.vp.h = height;

    this.vp.viewSize = this.camera.getViewSize(this.vp.aspect());
    this.vp.viewRatio = this.vp.viewSize.w / this.vp.w;

    this.renderer.setSize(this.vp.w, this.vp.h);

    this.camera.perspective({
      aspect: this.vp.aspect(),
    });

    this.scene.resize(this.vp);
  }

  static get px() {
    console.log("px");
  }

  /** -- Lifecycle */

  static async transitionIn() {}

  static async transitionOut() {}
}

/** Utils */
function handleResize(container, cb) {
  new ResizeObserver((entry) => cb(entry[0].contentRect)).observe(container);
}
