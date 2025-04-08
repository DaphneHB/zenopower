// [data-svg-loc="seattle"]
// [data-svg-loc="washington"]
// [data-svg-loc-def]

export class Openings {
  constructor(el) {
    // console.log("openings", el);

    this.el = el;

    // manage url creation
    const urls = document.querySelectorAll("[data-url]");
    urls.forEach((item, i) => {
      item.href = item.href + item.dataset.url;
    });
    // manage url creation

    this.filters = [
      ...this.el.querySelectorAll(
        '[data-filter="locations"] , [data-filter="department"]'
      ),
    ];

    this.filterData = {
      locations: [],
      departments: [],
    };

    this.items = [...this.el.querySelectorAll("[data-filter='item']")].map(
      (it, i) => {
        const location = it.querySelector("[data-filter-location]").textContent;
        const dept = it.dataset.dept;

        if (!this.filterData.locations.includes(location)) {
          this.filterData.locations.push(location);
        }

        if (!this.filterData.departments.includes(dept)) {
          if (dept.length > 0) {
            this.filterData.departments.push(dept);
          }
        }

        return {
          item: it,
          location,
          index: i,
        };
      }
    );

    // set filters (1/2)
    this.filterData.locations.forEach((loc) => {
      // console.log(loc);
      const el = this.filters[0].children[1].children[0].cloneNode(true);
      el.textContent = loc;
      this.filters[0].children[1].appendChild(el);
      el.onclick = () => this.filterItems("locations", loc);
    });

    // set filters (2/2)
    this.filterData.departments.forEach((dept) => {
      // console.log(dept);
      const el = this.filters[1].children[1].children[0].cloneNode(true);
      el.textContent = dept;
      this.filters[1].children[1].appendChild(el);
      el.onclick = () => this.filterItems("departments", dept);
    });

    // reset base
    this.filters[0].children[1].children[0].onclick = () =>
      this.filterItems("locations", "all");

    this.filters[1].children[1].children[0].onclick = () =>
      this.filterItems("departments", "all");

    // create dropdowns
    this.filters.forEach((filter) => {
      filter.onclick = (e) => {
        e.stopPropagation();
        // console.log("click", filter);
        filter.classList.toggle("active");

        this.handleClickOut();
      };
    });
  }

  handleClickOut = () => {
    document.body.onclick = () => {
      this.filters.forEach((filter) => {
        filter.classList.remove("active");
        document.body.onclick = null;
      });
    };
  };

  filterItems(filter, data) {
    // console.log(filter, data);

    if (filter === "locations") {
      this.filters[1].children[0].children[0].textContent = "ALL DEPARTMENTS";
      this.items.forEach((it) => {
        if (data === "all") {
          it.item.style.display = "flex";
          this.filters[0].children[0].children[0].textContent = "ALL LOCATIONS";
        } else {
          it.item.style.display = it.location === data ? "flex" : "none";
          this.filters[0].children[0].children[0].textContent = data;
        }
      });
    } else {
      this.filters[0].children[0].children[0].textContent = "ALL LOCATIONS";
      this.items.forEach((it) => {
        if (data === "all") {
          it.item.style.display = "flex";
          this.filters[1].children[0].children[0].textContent =
            "ALL DEPARTMENTS";
        } else {
          it.item.style.display =
            it.item.dataset.dept === data ? "flex" : "none";
          this.filters[1].children[0].children[0].textContent = data;
        }
      });
    }
  }

  destroy() {
    // console.log("destroy openings");

    this.filterData.forEach((filter) => {
      filter.onclick = null;
    });

    this.filters.forEach((filter) => {
      filter.onclick = null;
    });
  }
}
