import u from '../base/util.js';
import Select from '../select/Select.js';


class Pagination {
  /**
   * @param {(string|object)} selector - page wrapper
   * @param {object=} options - user settings
   */
  constructor(selector, options) {
    const defaultSettings = {
      total: 0, // data length
      page: 1, // current page
      size: 5, // page size
      pages: 5, // page button

      limits: [10, 20, 30],

      prevIcon: 'iconfont icon-arrow-left',
      nextIcon: 'iconfont icon-arrow-right',
      pageClass: 'ui-pagination',

      pageTotal: true,
      pageInput: true,
      pageSelect: true,

      onChangeLimit: null,
      onChangePage: null // callback
    };

    this.createPageButton = this.createPageButton.bind(this);
    this.settings = Object.assign({}, defaultSettings, options);
    this.initPage(selector);
  }

  /**
   * @param {number} min 
   * @param {number} max 
   * @param {number} value 
   * @returns {number} page number
   */
  static limitRange(min, max, value) {
    if (value < min) {
      return min;
    }

    if (value > max) {
      return max;
    }

    return value;
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
   * @param  {string|object} selector
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

    this.changePageDom(page);
    this.events();
  }

  changePage({ page, total, size, pages }) {
    const { total: _total, size: _size, pages: _pages } = this.settings;
    
    this.total = typeof total === 'undefined' ? _total : total;
    this.size = typeof size === 'undefined' ? _size : size;
    this.pages = typeof pages === 'undefined' ? _pages : pages;
    this.changePageBtn(page);
  }

  /**
   * @param {number} page - current page number
   * @param {boolean=} onlyBtn
   * @returns {string} - pagination html
   */
  createPageDom(page, onlyBtn = false) {
    const { total } = this;
    const { pageClass, pageTotal } = this.settings;
    this.page = page;

    const pageArr = this.createPageArray();
    const pageHtml = pageArr.reduce(this.createPageButton, '');
    const prevButton = this.createPageNavDom('prev');
    const nextButton = this.createPageNavDom('next');
    const input = this.createInputDom();
    const select = this.createSelectDom();
    const totalDom = pageTotal ? `<span class="ft-gray mr-24">共${total}条</span>` : '';

    if (onlyBtn) {
      return totalDom + prevButton + pageHtml + nextButton;
    }

    return `<div class="${pageClass}"><div class="ui-row middle pagination-box">`
      + totalDom 
      + prevButton + pageHtml + nextButton + '</div>'
      + select + input + '</div>';
  }

  createPageArray() {
    const { total, pages, size } = this;
    const pageTotal = Math.ceil(total / size);
    const middle = Math.ceil(pages / 2);
    const half = Math.floor(pages / 2);
    const { createPageNumberArray } = Pagination;
    const page = Pagination.limitRange(1, pageTotal, this.page);
    
    this.max = pageTotal;
    this.page = page;

    if (pageTotal <= pages || page <= middle) {
      return createPageNumberArray(1, Math.min(pageTotal, pages));
    }

    if (page >= pageTotal - half) {
      return createPageNumberArray((pageTotal - pages) + 1, pages);
    }

    return createPageNumberArray(page - half, pages);
  }

  /**
   * @param {string} type
   * @returns {string} - prev or next button html
   */
  createPageNavDom(type) {
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
   * @param {string} str
   * @param {number} cur
   * @returns {string} - page item
   */
  createPageButton(str, cur) {
    if (cur === this.page) {
      return str + `<span class="page active" data-page="${cur}">${cur}</span>`;
    }

    return str + `<a href="javascript:;" class="page" data-page="${cur}">${cur}</a>`;
  }

  /**
   * @returns {string} - select html
   */
  createSelectDom() {
    const { pageSelect, limits } = this.settings;
    if (!pageSelect) return '';
    
    const option = limits.reduce((pre, cur) => { 
      return pre + `<option value="${cur}" ${cur === this.size ? 'selected' : ''}>${cur}条/页</option>`;
    }, '');

    return `<div class="ui-control-wrap">
      <select class="ui-select ui-form-control page-select w94">
        ${option}
      </select>
    </div>`;
  }

  /**
   * @returns {string} - input html
   */
  createInputDom() {
    if (this.settings.pageInput) {
      return `<span class="text">跳至</span>
        <input class="ui-form-control page-input" type="number" name="page" autocomplete="off">
      <span class="text">页</span>`;
    }

    return '';
  }

  /**
   * @param {number} page 
   */
  changePageDom(page) {
    this.pageWrapper.innerHTML = this.createPageDom(page);
    // @ts-ignore
    new Select(this.pageWrapper.querySelector('.page-select'));
  }

  changePageBtn(page) {
    this.pageWrapper.querySelector('.pagination-box').innerHTML = this.createPageDom(page, true);
  }

  /**
   * @param {HTMLElement} element
   */
  handleChangePage(element) {
    if (u.hasClass(element, 'disabled') || u.hasClass(element, 'active')) return;

    const page = element.getAttribute('data-page');
    const _page = Number(page);
    
    this.changePageNumber(_page);
  }

  changePageNumber(pageNumber) {
    const { onChangePage } = this.settings;
    if (onChangePage && typeof onChangePage === 'function') {
      onChangePage(pageNumber, (next) => {
        if (next) {
          this.changePageBtn(pageNumber);
        }
      });
    } else {
      this.changePageBtn(pageNumber);
    }
  }

  handleInputPage(input) {
    const page = Pagination.limitRange(1, this.max, Number(input.value));
    this.changePageNumber(page);
  }

  events() {
    const self = this;
    const { pageWrapper } = self;
    const { onChangeLimit } = this.settings;

    u.on(pageWrapper, 'click', '.page', function () {
      self.handleChangePage(this);
    });

    u.on(pageWrapper, 'keydown', '.page-input', function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        self.handleInputPage(this);
      }
    });

    u.on(pageWrapper, 'change', '.page-select', function () {
      if (onChangeLimit) {
        onChangeLimit(Number(this.value));
      }
    });
  }
}

export default Pagination;
