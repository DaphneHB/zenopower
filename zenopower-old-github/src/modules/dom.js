import Hey from "../hey";
import gsap, { ANIMATION } from "../gsap";

// import { Text } from "./animation/text";
import { Nav } from "./nav";
import { Slider } from "./slider";
import { Dropdowns } from "./dropdowns";

import { Partners } from "./partners";
import { Openings } from "./openings";
import { Submit } from "./submit";
import { Dark } from "./dark";
import { Anchor } from "./anchor";

const lib = [
  {
    selector: '[data-a="char"],[data-a="word"],[data-a="line"]',
    class: Text,
  },
  {
    selector: '[data-embla="wrapper"]',
    class: Slider,
  },
  {
    selector: '[data-tabs="w"]',
    class: Dropdowns,
  },
  {
    selector: '[data-partners="w"]',
    class: Partners,
  },
  {
    selector: '[data-openings="w"]',
    class: Openings,
  },
  {
    selector: '[data-submit="w"]',
    class: Submit,
  },
  {
    selector: "[data-anchor]",
    class: Anchor,
  },
];

export class Dom {
  wrapper = document.querySelector("[data-taxi]");
  dark = new Dark();
  nav = new Nav();
  constructor() {
    this.create();

    Hey.on("LOAD", (state) => {
      switch (state) {
        case "full":
          this.onLoad();
          break;
        case "screen":
          this.onFirstLoad();
          break;
        default:
          break;
      }
    });
  }

  resize() {}

  render(t) {
    this.children.forEach((child) => {
      if (child.render) child.render();
    });
  }

  get _children() {
    const arr = lib.map((item) => {
      const { selector, class: Class } = item;
      const elements = [...document.querySelectorAll(selector)];

      if (elements.length === 0) return null;
      return elements.map((element) => new Class(element));
    });

    return arr;
  }

  create() {
    this.children = this._children.flat().filter((child) => child !== null);
    this.start();
  }

  start() {
    this.children.forEach((child) => {
      if (child.start) child.start();
    });
  }

  destroy() {
    this.children.forEach((child) => {
      if (child.destroy) child.destroy();
    });
  }

  /* -- Lifecycle */
  onFirstLoad() {
    gsap.to(this.wrapper, {
      autoAlpha: 1,
      duration: ANIMATION.load.duration,
      ease: ANIMATION.load.ease,
      delay: ANIMATION.load.delay,
    });
  }

  onLoad() {}

  /* --  Pages */
  async transitionOut(page) {
    this.destroy();
    await gsap.to(this.wrapper, { autoAlpha: 0, duration: 0.5 });
    // console.log("DOM::transitionOut", page);
  }

  async transitionIn(page) {
    this.create();
    await gsap.to(this.wrapper, { autoAlpha: 1, duration: 0.5, delay: 0.2 });
    // console.log("DOM::transitionIn", page);
  }
}
