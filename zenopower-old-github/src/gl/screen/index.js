import { Triangle, Mesh, Program as P, RenderTarget, Texture } from "ogl";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";
import { clamp } from "../../util/math";

import gsap, { ANIMATION } from "../../gsap";
import Hey from "../../hey";
import { Gl } from "../gl";

import { Sparkle } from "../sparkle";
import { Track } from "../../util/track";

import { visible } from "../../util/gui";

const GRADIENT = {
  dark1: 0x0d151b,
  dark2: 0x71a3b0,
  light1: 0xf7fafc,
  light2: 0xc4dce5,
};

function getSize() {
  return {
    width: Gl.vp.w * Gl.vp.dpr(),
    height: Gl.vp.h * Gl.vp.dpr(),
  };
}

export class Screen extends Mesh {
  target = new RenderTarget(Gl.gl, getSize());
  a = {
    dark: Hey.PAGE === "home" ? 1 : 0,
  };

  constructor(gl) {
    super(gl, { geometry: new Triangle(gl), program: new Program(gl) });

    this.sparkle = new Sparkle(gl, 10);

    Hey.on("PAGE", (page) => this.pageChange(page));
    this.pageChange(Hey.PAGE);
  }

  resize() {
    this.track?.resize();
    this.target = new RenderTarget(Gl.gl, getSize());
  }

  render(t) {
    this.program.time = t * 0.2;
    this.program.uniforms.u_a_dark.value = clamp(
      0,
      1,
      this.a.dark - this.track?.value || 0
    );

    this.sparkle?.render(t);

    // render to target
    if (this.sparkle) {
      Gl.renderer.render({
        scene: this.sparkle,
        camera: Gl.camera,
        target: this.target,
      });

      this.program.uniforms.u_sparkle.value = this.target.texture;
    }

    if (window.gui && visible) {
      this.program.uniforms.u_color_light1.value = hexToVec3String(
        window.gui.params.lightColor1
      );
      this.program.uniforms.u_color_light2.value = hexToVec3String(
        window.gui.params.lightColor2
      );

      this.program.uniforms.u_BG_POWER.value = window.gui.params.bgPower;
    }
  }

  /* lifecycle */
  pageChange(page) {
    if (page === "news" || page === "career") {
      this.a.dark = 0;
    }

    gsap.to(this.a, {
      dark: page === "home" ? 1 : 0,
      duration: ANIMATION.page.duration,
      ease: ANIMATION.page.ease,
    });

    // handle homepage track
    const track = document.querySelector("[data-track='gradient']");

    if (track) {
      this.track = new Track({
        element: track,
        config: {
          bottom: "bottom",
        },
      });
    } else {
      if (this.track) {
        this.track.destroy();
      }
    }
  }
}

class Program extends P {
  constructor(gl) {
    super(gl, {
      vertex: vertex,
      fragment: fragment,
      transparent: false,
      cullFace: null,
      uniforms: {
        u_time: { value: 0 },
        u_color_dark1: { value: hexToVec3(GRADIENT.dark1) },
        u_color_dark2: { value: hexToVec3(GRADIENT.dark2) },
        u_color_light1: { value: hexToVec3(GRADIENT.light1) },
        u_color_light2: { value: hexToVec3(GRADIENT.light2) },
        u_BG_POWER: { value: 0.9 },
        u_a_dark: { value: 0.5 },
        u_a_mouse: { value: [0, 0] },
        u_sparkle: { value: new Texture(gl) },
      },
      depthTest: false,
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;
    this.uniforms.u_a_mouse.value = [Gl.mouse.ex, Gl.mouse.ey];
  }
}

// -- utils
function hexToVec3(hex) {
  return [
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
  ];
}

// hex to vec for strings with # in front
function hexToVec3String(hex) {
  return [
    parseInt(hex.substring(1, 3), 16) / 255,
    parseInt(hex.substring(3, 5), 16) / 255,
    parseInt(hex.substring(5, 7), 16) / 255,
  ];
}
