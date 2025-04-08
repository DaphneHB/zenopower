import { Observe } from "../util/observe";
import Hey from "../hey";

export class Dark {
  wrapper = document.body;
  constructor() {
    Hey.on("PAGE", () => this.handlePage());

    // console.log("wrapper", this.wrapper);
    this.handlePage();
  }

  handlePage() {
    if (this.observer) {
      this.observer.stop();
      this.observer = null;
      this.wrapper.classList.remove("darksection");
    }

    const section = document.querySelector(`[data-color="dark"]`);

    if (section) {
      this.observer = new Observe(section, {
        config: {
          threshold: 0,
          autoStart: true,
        },
        cb: {
          in: () => {
            // console.log("in");
            this.wrapper.classList.add("darksection");
          },
          out: () => {
            // console.log("out");
            this.wrapper.classList.remove("darksection");
          },
        },
      });
    }
  }
}
