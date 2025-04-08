import Hey from "../hey";

export class Submit {
  field = document.querySelector('[data-newsletter="field"]');
  constructor(el) {
    this.el = el;
    this.receiver = [...this.el.querySelectorAll("input")];

    Hey.on("PAGE", () => this.init());
    this.init();
  }

  init = () => {
    if (this.field) {
      this.field.onchange = null;
    }

    const fld = document.querySelector('[data-newsletter="field"]');
    const sub = document.querySelector('[data-newsletter="subscribe"]');
    const error = document.querySelector('[data-error="msg"]');
    // console.log(error);

    if (fld) {
      fld.oninput = () => {
        this.receiver[0].value = fld.value;
      };
    }

    if (sub) {
      sub.onclick = (e) => {
        e.preventDefault();

        if (this.checkValidEmail()) {
          this.receiver[1].click();
          this.handleSuccess(sub);
        } else {
          error.style.display = "block";
          setTimeout(() => {
            error.style.display = "none";
          }, 3000);
        }
      };

      this.el.onsubmit = (e) => {
        e.preventDefault();

        if (this.checkValidEmail()) {
          this.receiver[1].click();
          this.handleSuccess(sub);
        } else {
          error.style.display = "block";
          setTimeout(() => {
            error.style.display = "none";
          }, 3000);
        }
      };
    }
  };

  checkValidEmail = () => {
    const email = this.receiver[0].value;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  handleSuccess(sub) {
    // console.log("success", sub);
    const parent = sub.parentElement.parentElement;
    parent.style.display = "none";
    parent.nextElementSibling.style.display = "block";
  }

  // onChange() {
  //   console.log("submit change");
  // }
}
