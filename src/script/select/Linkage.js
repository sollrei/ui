import u from '../base/util.js';
import SelectBase from './SelectBase.js';

const doc = document;

class Linkage extends SelectBase {
  constructor(elementSelector, options) {
    const defaultSettings = {
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
      selectFinalFn: null,
    };

    const settings = Object.assign({}, defaultSettings, options);

    super(settings);

    this.settings = settings;

    let element = elementSelector;

    if (typeof element === 'string') {
      element = doc.querySelector(elementSelector);
    }

    if (!element) return;

    this.select = element;

    this.init();
  }

  init() {
    this.complete = false;
    this.values = [];
    this.cacheData = {};

    this.defaultValue = null;
    this.max = 0;

    this.initAjaxSelect();
  }

  initAjaxSelect() {
    const { ajaxUrl } = this.settings;

    if (!ajaxUrl) return;

    this.initInput();
    this.initDropdownWrap();

    if (typeof ajaxUrl === 'string') {
      u.fetchData(ajaxUrl).then((res) => {
        this.createDataMap(res);
        this.createOption(res);
      });
    }

    this.selectClickEvent(this.select);

    this.optionClickEvent();
  }

  createDataMap(data) {
    data.forEach(item => {
      const { code, children } = item;
      if (children) {
        this.cacheData[code] = children;
        this.createDataMap(children);
      }
    });
  }

  createOption(data) {
    let domString = '';

    if (Array.isArray(data)) {
      data.forEach(item => {
        const tpl = `<div class="menu-item-text" title="${item.name}">${item.name}</div>`;
        
        domString += this.createOptionItem({
          selected: null, 
          value: item.code, 
          label: item.name
        }, { tpl });
      });

      this.select.option.appendChild(u.createElement('ul', { className: 'select-main' }, domString));
    }
  }

  /**
   * input element to save value
   * */
  initInput() {
    const select = this.select;
    const parent = select.parentNode;
    const dataInput = select.getAttribute('data-input');
    const input = u.createElement('input', {
      type: 'hidden',
      name: select.id || 'area'
    });

    select.originElement = dataInput
      ? doc.querySelector(dataInput)
      : parent.appendChild(input);
  }

  /**
   * create div.ui-select-dropdown element
   * */
  initDropdownWrap() {
    const select = this.select;
    const className = this.settings.optionGroupClass;
    const option = select.parentNode.appendChild(
      u.createElement('div', { className })
    );
    const _width = Math.max(select.clientWidth, option.clientWidth);

    option.style.width = _width ? _width + 'px' : 'auto';

    select.option = option;
  }

  optionClickEvent() {
    const self = this;
    const select = this.select;

    u.on(select.option, 'click', '.menu-item', function (e) {
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
    const data = this.cacheData[value];
    const { onSelect } = this.settings; 

    if (data) {
      Linkage.removeSiblings(element.parentElement);
      this.createOption(data);
    } else {
      this.complete = true;
      this.setValue(false);
    }

    if (type === 'click' && typeof onSelect === 'function') {
      onSelect(element, select, type);
    }
  }

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

  static removeSiblings(element) {
    while(element.nextSibling) {
      element.parentNode.removeChild(element.nextSibling);
    }
  }
}

export default Linkage;
