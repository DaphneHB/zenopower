import { Dom } from "./modules/dom";
import { Viewport } from "./modules/viewport";
import { Scroll } from "./modules/scroll";
import { Pages } from "./modules/pages";
import { Gl } from "./gl/gl";
import { isTablet } from "./util/queries";
import gsap from "./gsap";
import Hey from "./hey";
import "./util/gui";

export class App {
  static body = document.querySelector("body");
  static viewport = new Viewport();
  static time = 0;
  static scroll = new Scroll();
  static pages = new Pages();
  static dom = new Dom();
  static gl = new Gl();
  static isMobile = isTablet();

  static {
    this.initEvents();
    gsap.ticker.add((t) => this.render(t));
  }

  static initEvents() {
    // prettier-ignore
    new ResizeObserver((entry) => this.resize(entry[0])).observe(this.body);
  }

  static resize({ contentRect }) {
    this.isMobile = isTablet();
    Hey.MOBILE = this.isMobile;

    this.viewport?.resize();
    this.dom?.resize();
    Resizer?.resize();
  }

  static render(t) {
    this.scroll?.render(t * 1000);
    this.dom?.render();
    Gl?.render(this.scroll.y);
  }

  /* Events */
}

/** -- Utils */
export class Resizer {
  static body = document.querySelector("body");
  static sub = [];

  static add(fn, id = Symbol()) {
    this.sub.push({
      id,
      fn,
    });

    return this.remove(id);
  }

  static remove(id) {
    this.sub = this.sub.filter((s) => s.id !== id);
  }

  static resize() {
    this.sub.forEach((s) => s.fn());
  }
}

export class Raf {
  static sub = [];

  static add(fn, id = Symbol()) {
    this.sub.push({
      id,
      fn,
    });

    return this.remove(id);
  }

  static remove(id) {
    this.sub = this.sub.filter((s) => s.id !== id);
  }

  static render(t) {
    this.sub.forEach((s) => s.fn(t));
  }
}
