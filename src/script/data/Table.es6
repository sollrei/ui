// @ts-ignore
import u from '../base/util.es6';
// @ts-ignore
import Pagination from './Pagination.es6';

class Table extends Pagination {
  /**
   * @param selector {string|Object}
   * @param options {Object=}
   */
  constructor(selector, options) {
    const defaultSettings = {
      header: [{
        name: 'title',
        label: 'title'
      }, {
        name: 'date',
        label: 'date'
      }],

      tableClass: 'ui-table',
      data: [],
      type: 'ajax', // local
      onChangePage: null,

      total: 120,
      page: 1,
      size: 5,
      pages: 5,
      prevIcon: 'iconfont icon-arrow-left',
      nextIcon: 'iconfont icon-arrow-right',
      pageInput: false
    };

    const settings = Object.assign({}, defaultSettings, options);
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!element) return;

    const pageWrapper = u.createElement('div', { className: 'ui-pagination' });
    const tableWrapper = u.createElement('div', { className: 'table-wrapper' });
    const wrapTable = element.appendChild(tableWrapper);
    const wrapPage = element.appendChild(pageWrapper);

    super(wrapPage, settings);

    this.settings = settings;

    this.init(wrapTable);
  }

  /**
   * @param element {string|Object}
   */
  init(element) {
    this.wrapper = element;
    this.table = this.createTable();
    this.thead = this.createTableHeader();
    this.tbody = this.createTableTbody();
  }

  /**
   * @returns {HTMLElement}
   */
  createTable() {
    const dom = u.createElement('table', { className: this.settings.tableClass });
    return this.wrapper.appendChild(dom);
  }

  /**
   * @returns {HTMLElement}
   */
  createTableHeader() {
    const { header } = this.settings;
    let str = '';
    let thead;

    if (Array.isArray(header)) {
      str = header.reduce((pre, cur) => {
        let name = cur;

        if (typeof cur === 'object') {
          name = cur.name;
        }

        return pre + `<th>${name}</th>`;
      }, '');
    }

    thead = u.createElement('thead', {}, str);
    
    return this.table.appendChild(thead);
  }

  /**
   * @returns {HTMLElement}
   */
  createTableTbody() {
    const tbody = u.createElement('tbody');
    return this.table.appendChild(tbody);
  }

  /**
   * @param data {Object}
   * @returns {string}
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

    return str;
  }

  /**
   * 
   * @param data {Array}
   */
  updateList(data) {
    const list = data.reduce((pre, cur) => {
      return pre + this.createTableRow(cur);
    }, '');

    this.tbody.innerHTML = list;
  }
}

export default Table;
