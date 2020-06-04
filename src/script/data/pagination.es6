class Pagination {
  constructor(selector, options) {
    const defaultSettings = {
      total: 0,
      page: 1,
      size: 5, // data length per page
      pages: 5 // page number
    };

    this.settings = Object.assign({}, defaultSettings, options);
    this.init(selector);
  }

  static createInput() {
    return '<span class="text">跳至</span><input class="ui-form-control js-jump-page" type="number" name="page" autocomplete="off"><span class="text">页</span>';
  }

  // static createPageArray({ total, page, pages, size }) {
  //   const pageTotal = Math.ceil(total / size);
  //   const middle = Math.ceil(pages / 2);
  //   const half = Math.floor(pages / 2);

  //   let pageArr = [];

  //   if (pageTotal <= pages) {
  //     for (let i = 0; i < pageTotal; i += 1) {
  //       pageArr.push(i + 1);
  //     }
  //   } else if (page <= middle) {
  //     for (let i = 0; i < pages; i += 1) {
  //       pageArr.push(i + 1);
  //     }
  //   } else if (page >= pageTotal - half) {
  //     for (let i = 0; i < pages; i += 1) {
  //       pageArr.push((pageTotal - pages) + 1 + i);
  //     }
  //   } else {
  //     for (let i = 0; i < pages; i += 1) {
  //       pageArr.push((page - half) + i);
  //     }
  //   }

  //   return pageArr;
  // }

  static createArray(start, length) {
    return Array.from({ length }).map((item, index) => index + start);
  }

  static createPageArray({ total, page, pages, size }) {
    const pageTotal = Math.ceil(total / size);
    const middle = Math.ceil(pages / 2);
    const half = Math.floor(pages / 2);
    const { createArray } = Pagination;

    if (pageTotal <= pages) {
      return createArray(1, pageTotal);
    }

    if (page <= middle) {
      return createArray(1, pages);
    }

    if (page >= pageTotal - half) {
      return createArray(pageTotal - pages + 1, pages);
    }

    return createArray(page - half, pages);
  }

  init(selector) {
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!element) return;

    this.wrapper = element;

    this.wrapper.innerHTML = this.createPageDom(this.settings.page);
  }

  createPageNav(type, limit) {
    const { page } = this;
    const pageNumber = type === 'left' ? page - 1 : page + 1;
    let className = '';

    if (
      (type === 'left' && page <= limit) ||
      (type === 'right' && page >= limit)
    ) {
      className = 'disabled';
    }

    return `<a href="javascript:;" class="page ${className}" data-page="${pageNumber}">
              <i class="iconfont icon-arrow-${type}"></i>
            </a>`;
  }

  createPageButton(str, cur) {
    if (cur === this.page) {
      return str + `<span class="page active" data-page="${cur}">${cur}</span>`;
    }
    return (
      str + `<a href="javascript:;" class="page" data-page="${cur}">${cur}</a>`
    );
  }

  createPageDom(page) {
    const { total, size, pages } = this.settings;
    this.page = page;

    if (total <= size) {
      return '';
    }

    const pageArr = Pagination.createPageArray({ total, pages, page, size });
    const pageHtml = pageArr.reduce(this.createPageButton.bind(this), '');
    const prevButton = this.createPageNav('left', 0);
    const nextButton = this.createPageNav('right', pageArr.length);

    return prevButton + pageHtml + nextButton + Pagination.createInput();
  }
}

export default Pagination;
