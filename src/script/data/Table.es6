import u from '../base/util.es6';
import Pagination from './Pagination.es6';

/**
 * @class
 * @augments Pagination
 */
class Table extends Pagination {
  /**
   * @param {string|object} selector .
   * @param {object=} options .
   */
  constructor(selector, options) {
    const defaultSettings = {
      header: [],

      data: [],
      type: 'ajax', // local
      fetchUrl: '',

      onChangePage: null,
      
      total: 0,
      page: 1,
      size: 5,
      pages: 5,
      
      tableClass: 'ui-table',
      prevIcon: 'iconfont icon-arrow-left',
      nextIcon: 'iconfont icon-arrow-right',
      pageClass: 'ui-pagination right',
      pageInput: false
    };

    const settings = Object.assign({}, defaultSettings, options);
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!element) return;

    const pageWrapper = u.createElement('div', { className: 'ui-row mt-16' });
    const tableWrapper = u.createElement('div', { className: 'table-wrapper' });
    const wrapTable = element.appendChild(tableWrapper);
    const wrapPage = element.appendChild(pageWrapper);

    super(wrapPage, settings);

    this.settings = settings;
    this.pageWrapper = wrapPage;

    this.init(wrapTable);
  }

  /**
   * @param {string|object} element - 
   */
  init(element) {
    const { data } = this.settings;
    this.wrapper = element;

    this.table = this.createTable();
    this.thead = this.createTableHeader();
    this.tbody = this.createTableTbody();
    
    if (data.length) {
      this.updateList(data);
    }
  }

  /**
   * @returns {HTMLElement} .
   */
  createTable() {
    const dom = u.createElement('table', { className: this.settings.tableClass });
    return this.wrapper.appendChild(dom);
  }

  /**
   * @returns {HTMLElement} - thead 
   */
  createTableHeader() {
    const { header } = this.settings;
    let str = '';
    let thead;

    if (Array.isArray(header)) {
      str = header.reduce((pre, cur) => {
        let name = cur;
        let width = cur.width || '';

        if (typeof cur === 'object') {
          name = cur.name;
        }

        return pre + `<th width="${width}">${name}</th>`;
      }, '');
    }

    thead = u.createElement('thead', {}, str);
    
    return this.table.appendChild(thead);
  }

  /**
   * @returns {HTMLElement} - tbody
   */
  createTableTbody() {
    const tbody = u.createElement('tbody');
    return this.table.appendChild(tbody);
  }

  /**
   * @param {object} data - 
   * @returns {string} - tr
   */
  createTableRow(data) {
    const { header } = this.settings;
    let str = '';

    if (typeof data === 'object') {
      header.forEach(item => {
        if (typeof item === 'object') {
          const { name, template } = item;
          const value = data[name] || '';

          if (template && typeof template === 'function') {
            str += template(data[name], data);
          } else {
            str += `<td>${value}</td>`;
          }
        }
      });
    }

    return `<tr>${str}</tr>`;
  }

  /**
   * @param {Array} data -
   */
  updateList(data) {
    const list = data.reduce((pre, cur) => {
      return pre + this.createTableRow(cur);
    }, '');

    this.tbody.innerHTML = list;
  }

  handleChangePage(element) {
    const { onChangePage } = this.settings;

    if (u.hasClass(element, 'disabled') || u.hasClass(element, 'active')) return;

    const page = element.getAttribute('data-page');
    const _page = Number(page);
    
    if (onChangePage && typeof onChangePage === 'function') {
      onChangePage(page, (next) => {
        if (next) {
          // @ts-ignore
          this.changePageDom(_page);
        }
      });
    } else {
      // @ts-ignore
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

export default Table;
