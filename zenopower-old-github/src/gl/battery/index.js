import Hey from "../../hey";
import { Mesh, Program as P, Transform } from "ogl";
import { Gl } from "../gl";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";
import gsap from "../../gsap";

import { Track } from "../../util/track";
import { App } from "../../app";

export class Battery extends Transform {
  a = {
    baseY: 0,
    markY: 0,
    scale: [1, 1],
  };

  constructor(gl, mark = null) {
    super();
    this.gl = gl;
    this.mark = mark;

    this.create();

    Hey.on("PAGE", (page) => this.pageChange(page));
    Hey.on("PAGE_OUT", (page) => this.pageOut(page));

    this.pageChange();

    setTimeout(() => {
      if (this.mark) this.getTracking();
      this.resize();
    }, 100);

    // App.scroll.subscribe(() => this.handleScroll());
  }

  async create() {
    this.battery = new BatteryModel(this.gl);
    this.resize();
    this.battery.setParent(this);
  }

  // handleScroll() {}

  render(t) {
    this.battery?.render(t);

    this.rotation.x = Gl.mouse.ey * 0.3;
    this.rotation.y = Gl.mouse.ex * 0.3;
    this.rotation.z = (-Math.PI / 4) * 0.5;

    if (this.mark) {
      this.position.y = App.scroll.y * Gl.vp.viewRatio + this.a.markY;
    } else {
      const Yadjust = App.isMobile ? 0 : -0.15;
      this.position.y = App.scroll.y * Gl.vp.viewRatio + this.a.baseY + Yadjust;
    }

    if (Gl.scene.bg.track) {
      this.battery.program.uniforms.u_a_illuminate.value =
        Gl.scene.bg.track.value;
    }
  }

  getTracking() {
    if (!this.markItem) return;
    queueMicrotask(() => {
      let { top, height } = this.markItem.getBoundingClientRect();
      top += height / 2 - window.innerHeight / 2;

      this.a.markY = (-top - App.scroll.y) * Gl.vp.viewRatio;
    });
  }

  resize() {
    setTimeout(() => {
      if (this.mark && this.markItem) this.getTracking();

      if (!App.isMobile) {
        const hsize = Gl.vp.viewSize.w / 3.5;
        this.position.x = Gl.vp.viewSize.w / 5;
        this.scale.set(hsize, hsize, hsize);
      } else {
        const hsize = Gl.vp.viewSize.w / 2.5;
        const mobileScale = 1.5;
        this.position.x = 0;

        this.scale.set(
          hsize * mobileScale,
          hsize * mobileScale,
          hsize * mobileScale
        );
        this.a.baseY = -Gl.vp.viewSize.h / 4;
      }

      queueMicrotask(() => {
        this.battery?.resize();
        this.track?.resize();
      });
    }, 10);
  }

  pageChange(page) {
    const track = document.querySelector("[data-track='gradient']");
    if (this.mark) {
      this.markItem = document.querySelector(this.mark);

      if (this.markItem) {
        this.getTracking();
      }
    }

    setTimeout(() => {
      if (track) {
        this.track = new Track({
          element: track,
          config: {
            top: "top",
            bottom: "top",
          },
        });

        setTimeout(() => {
          this.track.resize();
        }, 10);
      }
    });
  }

  pageOut() {
    if (this.track) {
      this.track.destroy();
      this.track = null;
    }
  }
}

class BatteryModel extends Mesh {
  constructor(gl) {
    super(gl, {
      geometry: Gl.scene.assets.model.scenes[0][0].children[0].geometry,
      program: new Program(gl),
      frustumCulled: false,
    });

    this.scale.set(0, 0, 0);
    // this.position.y = -Gl.vp.viewSize.h;

    Hey.on("LOAD", (state) => this.pageChange(Hey.PAGE));
    Hey.on("PAGE", (page) => this.pageChange(page));
    Hey.on("PAGE_OUT", (page) => this.animateOut(page));
  }

  animateIn() {
    gsap.to(this.scale, {
      x: 1,
      y: 1,
      z: 1,
      delay: 0.2,
    });

    gsap.to(this.position, {
      y: 0,
      delay: 0.2,
    });
  }

  async animateOut() {
    await gsap.to(this.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.4,
    });

    gsap.set(this.position, {
      y: -Gl.vp.viewSize.h,
    });
  }

  pageChange(page) {
    if (page === "home") {
      this.animateIn();
    }
  }

  resize() {}

  render(t) {
    this.program.time = t;
  }
}

class Program extends P {
  constructor(gl) {
    super(gl, {
      vertex: vertex,
      fragment: fragment,
      transparent: true,
      cullFace: null,
      uniforms: {
        u_time: { value: 0 },
        u_mtc: { value: Gl.scene.assets.matcap },
        u_mtc2: { value: Gl.scene.assets.matcap2 },
        u_light: { value: Gl.scene.assets.light },
        u_light2: { value: Gl.scene.assets.light2 },
        // dirty_mask: { value: Gl.scene.assets.dirty_mask },
        u_a_illuminate: { value: 0 },
      },
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;
  }
}
