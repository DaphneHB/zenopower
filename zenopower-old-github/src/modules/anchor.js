import { App } from "../app";

export class Anchor {
  constructor(el) {
    this.el = el;
    this.target = el.getAttribute("data-anchor");

    this.el.onclick = () => {
      App.scroll.to(document.getElementById(this.target));
    };
  }

  destroy() {
    console.log("destroy");
  }
}
