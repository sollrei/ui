
import Util from '../base/util.es6';
import Select from './Select.es6';

class Linkage extends Select {
  constructor(selector, options) {
    const defaultSettings = {
      selectElement: 'div',
      selectedClass: 'selected',

      showClass: 'show',

      selectShowClass: 'js-ui-select-show',

      selectClass: 'ui-select ui-form-control w160',
      optionClass: 'ui-select-dropdown hide',

      linkageSelector: '.linkage-item',

      valueName: 'value',
      labelName: 'label',

      dataName: 'catid',

      selectItemFn: null,

      data: {},
      emptyLabel: '请选择',

      defaultUrl: null,
      ajaxUrls: null,

      defaultValue: []
    };

    super();

    let container;
    if (typeof selector === 'string') {
      container = document.querySelector(selector);
    }
    if (typeof selector === 'object') {
      container = selector;
    }

    if (!container) {
      return;
    }

    // input to save single value / last select value / maybe not last level
    this.valueInput = container.querySelector('.linkage-input');

    this.settings = Object.assign({}, defaultSettings, options);

    // rewrite and set selectFn in class Select's setting object [see Select.es6]
    // use 'selectItemFn' to do same thing as selectFn in Select class
    this.settings.selectFn = this.selectFunction.bind(this);

    this.initLinkage(container);
  }

  /**
   * @method
   * selectFn in class Select
   * @param {String} value
   * @param {Object} select
   * */
  selectFunction(value, select) {
    const selectItemFn = this.settings.selectItemFn;

    if (selectItemFn && typeof selectItemFn === 'function') {
      selectItemFn(value, select);
    }

    if (this.valueInput) {
      this.valueInput.value = value;
      this.valueInput.trigger('change');
    }

    this.changeNextSelectData(value, select.level);
  }

  /**
   * @method
   * @param {HTMLElement} element
   * */
  initLinkage(element) {
    const { ajaxUrls, defaultUrl, linkageSelector } = this.settings;
    const selects = element.querySelectorAll(linkageSelector);

    let ajaxUrlsArray = [];
    let defaultUrlString = '';

    this.selects = [];

    // linkage's default value
    // can set in options or get from container's 'data-default' attribute
    this.defaultValue = element.getAttribute('data-default')
      ? element.getAttribute('data-default').split(',')
      : this.settings.defaultValue;

    const defaultValue = this.defaultValue;

    selects.forEach((item, index) => {
      const url = item.getAttribute('data-ajax');

      // first select
      const dUrl = item.getAttribute('data-default-ajax');

      // initSelect: function in Select class
      const select = this.initSelect(item);

      if (url) {
        ajaxUrlsArray.push(url);
      }

      if (dUrl) {
        defaultUrlString = dUrl;
      }

      // level from 0
      select.level = index;

      // set select's default value
      if (defaultValue.length && defaultValue[index]) {
        select.defaultValue = defaultValue[index];
      }

      this.selects.push(select);

      if (index > 0) {
        Linkage.hideSelect(select);
      }
    });

    this.ajaxUrls = ajaxUrls || ajaxUrlsArray;

    this.defaultUrl = defaultUrl || defaultUrlString;

    this.levels = this.selects.length;

    this.initFirstSelect();
  }

  /**
   * @method
   * create first linkage select
   * */
  initFirstSelect() {
    const select = this.selects[0];
    const url = this.defaultUrl;

    const { data } = this.settings;

    Util.fetchData(url, Object.assign({}, data))
      .then(res => {
        if (res.status && res.data.length) {
          this.resetSelectOption(select, res.data);
        }
      });
  }

  static hideSelect(select) {
    const parent = select.parentNode;
    parent.style.display = 'none';
  }

  static showSelect(select) {
    const parent = select.parentNode;
    parent.style.display = 'inline-block';
  }

  /**
   * @method
   * @param {String} value
   * @param {Number} level
   * */
  changeNextSelectData(value, level) {
    const levels = this.levels;
    const { data, dataName } = this.settings;

    if (level < (levels - 1)) {
      const urls = this.ajaxUrls;
      const url = urls[level];
      const select = this.selects[level + 1];

      // if select empty value
      if (!value) {
        this.hideNextSelects(level - 1);
        return;
      }

      // get select data
      Util.fetchData(url, Object.assign({}, data, {
        [dataName]: value
      }))
        .then(res => {
          if (res.status) {
            if (res.data && res.data.length) {
              this.resetSelectOption(select, res.data);

              Linkage.showSelect(select);

              if (level < (levels - 2)) {
                this.hideNextSelects(level);
              }
            } else {
              // no next select data
              this.hideNextSelects(level - 1);
            }
          }
        });
    }
  }

  addEmptyValue(data) {
    const { valueName, labelName, emptyLabel } = this.settings;

    data.unshift({
      [labelName]: emptyLabel,
      [valueName]: ''
    });

    return data;
  }

  /**
   * @method
   * set select's options
   * and select default value
   * @param {Object} select
   * @param {Array} data
   * */
  resetSelectOption(select, data) {
    const selectElement = select;
    const finalData = this.addEmptyValue(data);
    const val = select.defaultValue || '';

    this.changeOptionDomFromData(select, finalData, val);

    if (val) {
      this.selectFunction(val, select);
      selectElement.defaultValue = '';
    }
  }

  /**
   * @method
   * empty select's option
   * @param {Number} level
   * */
  hideNextSelects(level) {
    this.selects.forEach((item, index) => {
      if (index > (level + 1)) {
        this.changeOptionDomFromData(item, []);
        Linkage.hideSelect(item);
      }
    });
  }
}

export default Linkage;
