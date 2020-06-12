import Util from '../base/util.js';
import SelectBase from './SelectBase.js';

const doc = document;


class Cascader extends SelectBase {
  constructor(elementSelector, options) {
    const defaultSettings = Object.assign({}, {
      selectElement: 'div',
      selectedClass: 'selected',

      showClass: 'show',

      selectShowClass: 'ui-select-active',
      selectClass: 'ui-select ui-form-control',

      optionGroupClass: 'ui-select-dropdown menu-group hide',

      ajaxUrl: [],

      valueName: 'value',
      labelName: 'label',

      dataName: 'id',
      data: {},

      selectFn: null,
      selectFinalFn: null
    }, options);

    super(defaultSettings);

    let element = elementSelector;
    
    if (typeof elementSelector === 'string') {
      element = doc.querySelector(elementSelector);
    }

    if (!element) return;

    this.select = element;

    this.init();
  }

  init() {
    this.complete = false;
    this.linkage = [];
    this.values = [];

    this.defaultValue = null;
    this.max = 0;

    this.initAjaxSelect();
  }

  /**
   * @function
   * */
  initAjaxSelect() {
    const select = this.select;
    const { ajaxUrl } = this.settings;

    const valueArray = select.getAttribute('data-default');

    if (valueArray) {
      this.defaultValue = valueArray.split(',');
    }
    
    if (!ajaxUrl.length && !select.getAttribute('data-ajax')) {
      return;
    }

    // urls to get option items data
    this.urlArray = ajaxUrl.length
      ? ajaxUrl
      : select.getAttribute('data-ajax').split(',');
    
    this.max = this.urlArray.length;

    // whether should select to the final level or not
    this.level = Number(select.getAttribute('data-level')) || 0;

    this.initInput();
    this.initDropdownWrap();

    this.createAjaxOption(1);

    this.selectClickEvent(select, () => {
      if (!this.complete && this.defaultValue) {
        this.initStatus(select);
        this.createAjaxOption(1);
      }
    });

    this.optionClickEvent();
  }

  resetValue(value) {
    this.defaultValue = value;
    this.createAjaxOption(1);
  }

  initStatus(select) {
    const option = select.option;
    this.linkage = [];
    option.innerHTML = '';
  }

  /**
   * input element to save value
   * */
  initInput() {
    const select = this.select;
    const parent = select.parentNode;
    const dataInput = select.getAttribute('data-input');

    select.originElement = dataInput
      ? doc.querySelector(dataInput)
      : parent.appendChild(Util.createElement('input', {
        type: 'hidden',
        name: select.id
      }));
  }

  /**
   * create div.ui-select-dropdown element
   * */
  initDropdownWrap() {
    const select = this.select;
    const className = this.settings.optionGroupClass;
    const option = select.parentNode.appendChild(Util.createElement('div', { className }));
    const _width = Math.max(select.clientWidth, option.clientWidth);

    option.style.width = _width ? _width + 'px' : 'auto';

    select.option = option;
  }

  /**
   * @function
   * @param {Node|object} select
   * @param {number} level
   * @param {object} [d = {}]
   * @param {*} type
   * */
  createAjaxOption(level, d = {}, type = false) {
    const select = this.select;
    const url = this.urlArray[level - 1];
    const data = this.settings.data;

    if (url) {
      Util.fetchData(url, Object.assign({}, data, d))
        .then(res => {
          if (res.code === 200) {
            if (Util.isEmpty(res.data)) {
              this.selectFinalLevelEvent();
              this.removeNextSiblingOptions(level - 1);
            } else {
              this.appendAjaxOption(res.data, select, level, type);
            }
          }
        });
    } else {
      this.selectFinalLevelEvent();
    }
  }

  selectFinalLevelEvent() {
    const { selectFinalFn } = this.settings;
    if (typeof selectFinalFn === 'function') {
      selectFinalFn(this.values);
    }
  }

  /**
   * @function
   * @param {Array} data - options data array
   * @param {object} select
   * @param {number} level - linkage level
   * (index = level - 1, index from 0, level from 1)
   * @param {*} type
   * */
  appendAjaxOption(data, select, level, type) {
    let domString = '';
    const trigger = !!(this.defaultValue);
    const { valueName, labelName } = this.settings;

    // array data to create options
    data.forEach(item => {
      let selected = false;
      if (trigger && !type) {
        selected = item[valueName] == this.defaultValue[level - 1]; // eslint-disable-line
      }
 
      domString += this.createOptionItem({
        selected, 
        value: item[valueName], 
        label: item[labelName]
      }, { level });
    });

    const optionUI = select.option.appendChild(Util.createElement('ul', { className: 'select-main' }, domString));

    // trigger nex level
    if (!type) {
      const selected = optionUI.querySelector('.selected');
      if (selected) {
        this.triggerNewItem(selected, select);
        if (selected.offsetTop > optionUI.clientHeight) {
          optionUI.scrollTop = selected.offsetTop - (optionUI.clientHeight / 2);
        }
      }
    }

    this.removeNextSiblingOptions(level - 1);

    this.linkage.push(optionUI);
  }

  removeNextSiblingOptions(index) {
    const { linkage, urlArray } = this;
    const max = urlArray.length;
    linkage.splice(index, max).forEach(item => {
      item.parentNode.removeChild(item);
    });
  }

  /**
   * @function
   * @param {object} select
   * */
  optionClickEvent() {
    const self = this;
    const select = this.select;

    Util.on(select.option, 'click', '.menu-item', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const ul = this.parentNode;
      self.changeSelectedClass(ul, this);

      self.triggerNewItem(this, select, 'click');
    });

    select.option.addEventListener('click', e => {
      e.stopPropagation();
    });
  }

  triggerNewItem(element, select, type) {
    const value = element.getAttribute('data-value');
    const level = Number(element.getAttribute('data-level'));
    const label = element.innerHTML.trim();
    const show = !type;
    const values = this.values;
    const { selectFn, dataName } = this.settings;

    values[level - 1] = { value, label };
    values.splice(level, values.length);

    if (typeof selectFn === 'function') {
      selectFn(element, select, type);
    }

    if (this.level) {
      if (level < this.level) {
        this.complete = false;
        this.createAjaxOption(level + 1, {
          [dataName]: value
        }, type);
      }

      if (level === this.level) {
        this.complete = true;
        this.setValue(show);
        this.defaultValue = this.values.map(item => item.value);
        this.selectFinalLevelEvent();
      }
    } else {
      this.complete = true;
      this.setValue();
      this.createAjaxOption(level + 1, {
        [dataName]: value
      }, type);
    }
  }

  /**
   * @static
   * @param {object} select
   * @param {boolean} show
   */
  setValue(show) {
    const select = this.select;
    let valueAll = [];
    let labelAll = [];

    this.values.forEach((item) => {
      valueAll.push(item.value);
      labelAll.push(item.label);
    });
    this.changeSelectValue(select, valueAll.join(','), labelAll.join(' / '), show);
  }

  /**
   * @function
   * remove created option and input dom
   * */
  destroy() {
    const select = this.select;
    const { option } = select;
    const dataInput = select.getAttribute('data-input');

    if (!dataInput) {
      select.originElement.parentNode.removeChild(select.originElement);
    }
    option.parentNode.removeChild(option);
  }
}

export default Cascader;
