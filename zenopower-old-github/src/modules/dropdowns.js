export class Dropdowns {
  current = 0;

  constructor(el) {
    this.el = el;
    this.items = [...this.el.children];

    this.items.forEach((item, i) => {
      item.querySelector("input").onchange = this.onChange.bind(this, i);
    });

    this.items[0].querySelector("input").checked = true;
  }

  onChange(i, e) {
    if (this.current !== null) {
      this.items[this.current].querySelector("input").checked = false;
    }

    this.current = i;
  }

  destroy() {
    this.items.forEach((item) => {
      item.querySelector("input").onchange = null;
    });
  }
}
