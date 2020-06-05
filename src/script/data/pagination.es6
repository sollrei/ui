import u from '../base/util.es6';

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
    return '';
    // return '<span class="text">跳至</span><input class="ui-form-control js-jump-page" type="number" name="page" autocomplete="off"><span class="text">页</span>';
  }

  // createPageArray() {
  //   const { total, page, pages, size } = this;
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

  init(selector) {
    const { page, total, size, pages } = this.settings;
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!element) return;

    this.wrapper = element;

    this.total = total;
    this.size = size;
    this.pages = pages;

    this.wrapper.innerHTML = this.createPageDom(page);

    this.events();
  }

  createPageArray() {
    const { total, page, pages, size } = this;
    const pageTotal = Math.ceil(total / size);
    const middle = Math.ceil(pages / 2);
    const half = Math.floor(pages / 2);
    const { createArray } = Pagination;

    this.max = pageTotal;

    if (pageTotal <= pages || page <= middle) {
      return createArray(1, Math.min(pageTotal, pages));
    }

    if (page >= pageTotal - half) {
      return createArray(pageTotal - pages + 1, pages);
    }

    return createArray(page - half, pages);
  }

  static createPageNav(page, type, limit) {
    const pageNumber = type === 'left' ? page - 1 : page + 1;
    let className = '';

    if (
      (type === 'left' && pageNumber <= limit) ||
      (type === 'right' && pageNumber > limit)
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
    const { total, size } = this;
    this.page = page;

    if (total <= size) {
      return '';
    }

    const pageArr = this.createPageArray();
    const pageHtml = pageArr.reduce(this.createPageButton.bind(this), '');
    const prevButton = Pagination.createPageNav(page, 'left', 0);
    const nextButton = Pagination.createPageNav(page, 'right', this.max);

    return prevButton + pageHtml + nextButton + Pagination.createInput();
  }

  handleChangePage(element) {
    if (u.hasClass(element, 'disabled') || u.hasClass(element, 'active')) return;

    const page = element.getAttribute('data-page');
    this.wrapper.innerHTML = this.createPageDom(Number(page));
  }

  events() {
    const self = this;
    const { wrapper } = self;

    u.on(wrapper, 'click', '.page', function () {
      self.handleChangePage(this);
    });
  }
}

export default Pagination;
