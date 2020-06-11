import u from '../base/util.es6';

class Pagination {
  /**
   * @param {(string|object)} selector - page wrapper
   * @param {object=} options - user settings
   */
  constructor(selector, options) {
    const defaultSettings = {
      total: 0,
      page: 1,
      size: 5,
      pages: 5,
      prevIcon: 'iconfont icon-arrow-left',
      nextIcon: 'iconfont icon-arrow-right',
      pageClass: 'ui-pagination',
      pageInput: false,
      onChangePage: null
    };

    this.settings = Object.assign({}, defaultSettings, options);
    this.initPage(selector);
  }

  /**
   * @param {number} start - start page number
   * @param {number} length - page button number
   * @returns {number[]} - array of page number
   */
  static createPageNumberArray(start, length) {
    return Array.from({ length }).map((item, index) => index + start);
  }

  /**
   * @param  {(string|object)} selector -
   */
  initPage(selector) {
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!element) return;

    const { page, total, size, pages } = this.settings;

    this.pageWrapper = element;
    this.total = total;
    this.size = size;
    this.pages = pages;
    this.pageWrapper.innerHTML = this.createPageDom(page);
    this.events();
  }

  /**
   * @param {number} page - current page number
   * @returns {string} - pagination html
   */
  createPageDom(page) {
    const { total, size } = this;
    const { pageClass } = this.settings;
    this.page = page;

    if (total <= size) {
      return '';
    }

    const pageArr = this.createPageArray();
    const pageHtml = pageArr.reduce(this.createPageButton.bind(this), '');
    const prevButton = this.createPageNav('prev');
    const nextButton = this.createPageNav('next');
    const input = this.createInput();

    return `<div class="${pageClass}">` + prevButton + pageHtml + nextButton + input + '</div>';
  }

  createPageArray() {
    const { total, pages, size } = this;
    const pageTotal = Math.ceil(total / size);
    const middle = Math.ceil(pages / 2);
    const half = Math.floor(pages / 2);
    const { createPageNumberArray } = Pagination;

    if (this.page > pageTotal) {
      this.page = pageTotal;
    } else if (this.page < 1) {
      this.page = 1;
    }
    
    this.max = pageTotal;
    const { page } = this;

    if (pageTotal <= pages || page <= middle) {
      return createPageNumberArray(1, Math.min(pageTotal, pages));
    }

    if (page >= pageTotal - half) {
      return createPageNumberArray((pageTotal - pages) + 1, pages);
    }

    return createPageNumberArray(page - half, pages);
  }

  /**
   * @param {string} type - 
   * @returns {string} - prev or next button html
   */
  createPageNav(type) {
    const { page, max, settings } = this;
    const icon = settings[`${type}Icon`];
    const pageNumber = (type === 'prev') ? page - 1 : page + 1;
    let className = '';

    if (pageNumber <= 0 || pageNumber > max) {
      className = 'disabled';
    }

    return `<a href="javascript:;" class="page ${className}" data-page="${pageNumber}">
        <i class="${icon}"></i>
      </a>`;
  }

  /**
   * @param {string} str - 
   * @param {number} cur -
   * @returns {string} - page item
   */
  createPageButton(str, cur) {
    if (cur === this.page) {
      return str + `<span class="page active" data-page="${cur}">${cur}</span>`;
    }

    return str + `<a href="javascript:;" class="page" data-page="${cur}">${cur}</a>`;
  }

  /**
   * @returns {string} - input html
   */
  createInput() {
    if (this.settings.pageInput) {
      return `<span class="text">跳至</span>
                <input class="ui-form-control js-jump-page" type="number" name="page" autocomplete="off">
              <span class="text">页</span>`;
    }
    
    return '';
  }

  changePageDom(page) {
    this.pageWrapper.innerHTML = this.createPageDom(page);
  }

  /**
   * @param {HTMLElement} element - 
   */
  handleChangePage(element) {
    const { onChangePage } = this.settings;

    if (u.hasClass(element, 'disabled') || u.hasClass(element, 'active')) return;

    const page = element.getAttribute('data-page');
    const _page = Number(page);
    
    if (onChangePage && typeof onChangePage === 'function') {
      onChangePage(page, (next) => {
        if (next) {
          this.changePageDom(_page);
        }
      });
    } else {
      this.changePageDom(_page);
    }
  }

  events() {
    const self = this;
    const { pageWrapper } = self;

    u.on(pageWrapper, 'click', '.page', function () {
      self.handleChangePage(this);
    });
  }
}

export default Pagination;
