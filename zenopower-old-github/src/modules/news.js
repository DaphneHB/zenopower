import { Observe } from "../util/observe";

export class News {
  current = 0;

  constructor(el) {
    this.el = el;

    // this.observe.start();

    this.btns = this.el.querySelectorAll('[data-news="btn"]');
    this.articles = this.el.querySelectorAll('[data-news="article"]');
    this.corners = [...this.el.querySelectorAll('[data-corners="news"]')];

    this.btns[this.current].parentNode.classList.add("current");

    this.btns.forEach((btn, index) => {
      btn.onclick = () => {
        if (this.current === index) return;

        this.articles[this.current].style.display = "none";
        this.btns[this.current].parentNode.classList.remove("current");

        this.current = index;
        this.articles[this.current].style.display = "block";
        this.btns[this.current].parentNode.classList.add("current");
      };
    });
  }

  destroy() {
    this.btns.forEach((btn) => {
      btn.onclick = null;
    });

    this.btns = null;
    this.articles = null;
  }
}
