import { Plane, Geometry, Mesh, Program as P } from "ogl";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";
import { Gl } from "../gl";

import Hey from "../../hey";

import { App } from "../../app";

export class Sparkle extends Mesh {
  constructor(gl, num = 70, { attribs } = {}) {
    if (!attribs) attribs = new Plane(gl).attributes;

    super(gl, {
      geometry: new Geometry(gl, {
        ...attribs,
        ...calcAttributes(num),
      }),
      program: new Program(gl),
    });

    const scale = 0.1;
    this.scale.set(scale, scale, scale);

    Hey.on("PAGE", (page) => this.pageChange(page));
    this.pageChange(Hey.PAGE);
  }

  pageChange(page) {
    if (page === "home") {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  resize() {}

  render(t) {
    this.program.time = t;
  }
}

class Program extends P {
  constructor(gl, options = {}) {
    super(gl, {
      vertex: vertex,
      fragment: fragment,
      transparent: true,
      cullFace: null,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        u_time: { value: 0 },
        u_a_scroll: { value: 0 },
      },
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;

    let val = Gl.scene.bg.track ? Gl.scene.bg.track.value : 0;
    this.uniforms.u_a_scroll.value = val;
  }
}

/*
Utils
*/

function calcAttributes(num) {
  let idA = new Float32Array(num * 4);
  let posmodA = new Float32Array(num * 3);
  let randomA = new Float32Array(num * 1);

  for (let i = 0; i < num; i += 1) {
    let id = i + 1;
    idA.set(
      [
        ((id >> 0) & 0xff) / 0xff,
        ((id >> 8) & 0xff) / 0xff,
        ((id >> 16) & 0xff) / 0xff,
        ((id >> 24) & 0xff) / 0xff,
      ],
      i * 4
    );

    posmodA.set(
      [
        Math.random() * 5 - 2.5,
        Math.random() * 5 - 2.5,
        Math.random() * 5 - 2.5,
      ],
      i * 3
    );

    randomA.set([Math.random() * 4], i);
  }

  return {
    a_id: { instanced: 1, size: 4, data: idA },
    a_random: { instanced: 1, size: 1, data: randomA },
    a_posmod: { instanced: 1, size: 3, data: posmodA },
  };
}
