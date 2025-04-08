export class Partners {
  constructor(el) {
    this.el = el;

    this.hovers = [...this.el.querySelectorAll("[data-partners='hover']")];
    this.imgs = [...this.el.querySelectorAll("[data-partners='img']")];

    this.imgs.forEach((img, i) => {
      img.style.zIndex = -0;

      // if (i === 0) {
      //   img.style.zIndex = 10;
      // }
    });

    this.hovers.forEach((hover, i) => {
      hover.onmouseenter = () => {
        this.imgs.forEach((img) => {
          img.style.zIndex = 0;
        });

        this.imgs[i].style.zIndex = 10;
      };

      hover.onmouseleave = () => {
        this.imgs.forEach((img, i) => {
          img.style.zIndex = 0;
        });
      };
    });
  }

  destroy() {
    this.hovers.forEach((hover) => {
      hover.onmouseenter = null;
    });
  }
}
