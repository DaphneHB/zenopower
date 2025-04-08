import EmblaCarousel from "embla-carousel";

export class Slider {
  options = { loop: true };
  btns = [...document.querySelector("[data-embla='btns']").children];
  constructor(el) {
    this.el = el;

    this.api = EmblaCarousel(this.el, this.options);
    this.checkEnabled();

    this.btns.forEach((btn, i) => {
      btn.onclick = () => {
        i === 0 ? this.api.scrollPrev() : this.api.scrollNext();
        // this.checkEnabled();
      };
    });
  }

  checkEnabled() {
    // console.log(this.api.canScrollNext(), this.api.canScrollPrev());

    if (this.api.canScrollNext()) {
      this.btns[1].classList.remove("disabled");
    } else {
      this.btns[1].classList.add("disabled");
    }

    if (this.api.canScrollPrev()) {
      this.btns[0].classList.remove("disabled");
    } else {
      this.btns[0].classList.add("disabled");
    }
  }

  destroy() {
    this.btns.forEach((btn) => (btn.onclick = null));
    this.api.destroy();
  }
}
