import u from '../base/util.es6';
import SelectBase from './SelectBase.es6';

class Select extends SelectBase {
  constructor(elementSelector, options) {
    const defaultSettings = {
      // selectElement: 'div',
      selectedClass: 'selected',

      showClass: 'show',

      selectClass: 'ui-select ui-form-control',
      optionClass: 'ui-select-dropdown hide',

      valueName: 'value',
      labelName: 'label',

      emptyLabel: '<span class="ft-gray">请选择</span>',

      data: null,
      selectFn: null,
      optionTemplate: null, // function 
      tagClass: null // function or string
    };

    const settings = Object.assign({}, defaultSettings, options);

    super(settings);

    this.init(elementSelector);
  }

  /**
   * @method
   * @param {NodeList} element
   * */
  init(element) {
    if (!element) return;

    const nodeName = element.nodeName.toLowerCase();

    this.value = [];
    this.cache = {};
    this.data = this.settings.data;

    if ((nodeName !== 'select') && (nodeName !== 'input')) return;

    this.nodeType = nodeName;

    if (element.multiple || element.hasAttribute('data-multiple')) {
      this.multiple = true;
    }

    if (element.hasAttribute('data-max')) {
      this.max = Number(element.getAttribute('data-max'));
    }

    if (element.querySelector('optgroup')) {
      this.group = true;
    }

    if (element.hasAttribute('data-search')) {
      this.search = true;
    }

    if (element.hasAttribute('data-checkable')) {
      this.checkable = true;
    }

    if (!this.data) {
      this.data = this.getDataFromSelect(element);
    } else {
      this.createCacheFromData(this.data);
    }

    this.initSelect(element);
  }

  getDataFromSelect(element, parentId) {
    const elements = element.children;

    return [].slice.call(elements).map(item => {
      const nodeName = item.nodeName.toLowerCase();
      if (nodeName === 'option') {
        const { label, value, selected } = item;
        if (selected) {
          this.value.push(item.value);
        }

        const _data = {
          label, value
        };

        if (parentId) {
          _data.parent = parentId;
        }

        this.cache[value] = _data;

        return _data;
      } if (nodeName === 'optgroup') {
        const id = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
        const child = [].slice.call(item.children).map(itm => itm.value);
        this.cache[id] = child;

        return {
          id,
          child,
          label: item.label,
          value: this.getDataFromSelect(item, id),
          type: 'optgroup'
        };
      }
      return null;
    });
  }

  createCacheFromData(data) {
    data.forEach(({ label, value, type, selected }) => {
      if (type === 'optgroup') {
        return;
      }
      if (selected) {
        this.value.push(value);
      }
      
      this.cache[value] = {
        label,
        value
      };
    });
  }

  /**
   * @method
   * create new element to exchange select element
   * @param {HTMLElement} item
   * */
  initSelect(item) {
    const element = item;
    const { select, value, label } = this.createSelectDom(item);

    // hide original select element
    element.style.display = 'none';

    this.select = select;

    select.option = this.createOptionWrap(element);
    select.option.innerHTML = this.createDropdown();
    select.options = select.option.querySelectorAll('.menu-item');
    select.option.style.width = Math.max(select.clientWidth, select.option.clientWidth) + 'px';
    select.originElement = element;


    // set default value
    // won't trigger 'change' event
    if (this.multiple) {
      this.changeMultiSelectValue(false, 'init');
    } else {
      this.changeSelectValue(select, value, label, false, 'init');
    }
    
    // bind event
    this.bindEvent(select);

    return select;
  }

  /**
   * @method
   * create new select element
   * @param {HTMLElement} element
   * @returns {Object}
   * */
  createSelectDom(element) {
    const { selectClass, emptyLabel } = this.settings;
    let className = element.getAttribute('data-class')
      ? selectClass + ' ' + element.getAttribute('data-class')
      : selectClass;

    if (this.multiple) {
      className += ' multiple';
    }

    if (this.group) {
      className += ' group';
    }

    const selectUI = u.createElement('div', { className });

    const value = this.value[0];
    
    let label = value ? this.cache[value].label : emptyLabel;

    return {
      select: element.parentNode.appendChild(selectUI),
      value,
      label
    };
  }

  // to base
  createOptionWrap(element) {
    let { optionClass } = this.settings;
    if (this.group) {
      optionClass += ' group';
    }

    if (this.multiple) {
      optionClass += ' multiple';
    }

    if (this.checkable) {
      optionClass += ' checkable';
    }

    if (this.max && this.value.length >= this.max) {
      optionClass += ' no-add';
    }

    const optionUI = u.createElement('div', { className: optionClass });
    return element.parentNode.appendChild(optionUI);
  }

  /**
   * @method
   * create new 'option'
   * @param {HTMLElement} element
   * @returns {String}
   * */
  createDropdown(match) {
    let domString = '<div class="select-ul">';

    if (this.search) {
      domString += Select.createSearch() + '<ul class="select-main">';
    }

    domString += '<ul class="select-main">' + this.createOptionContent(this.data, match);

    return domString + '</ul></div>';
  }

  /**
   * create main options list
   * @param element {HTMLElement} origin select
   * @param match {string|any} search content
   */ 
  createOptionContent(data, match) {
    return data.reduce((str, item) => {
      if (item.type && item.type === 'optgroup') {
        return str + this.createOptionGroup(item, match);
      }
      return str + this.createOptionSingle(item, match);
    }, '');
  }

  createOptionGroup(optgroup, match) {
    let { value: options, label: groupLabel, id } = optgroup;
    const hasSelect = options.filter(({ selected, label }) => 
      selected || (match && label.indexOf(match) > -1)).length;
    const str = this.createOptionContent(options, match);

    if (!str) return '';
    
    const className = hasSelect ? ' expend' : '';

    if (this.checkable) {
      groupLabel = `<label class="ui-checkbox"><input type="checkbox" class="check-group" value="${id}"><i class="iconfont"></i>${groupLabel}</label>`;
    }
    
    return `<li class="option-group">
              <div class="group-label${className}">
                <i class="iconfont icon-arrow-right"></i>
                ${groupLabel}</div>
              <ul class="group-ul">
              ${str}
              </ul>
            </li>`;
  }

  createOptionSingle(item, match) {
    const { value, label, selected } = item;
    const { optionTemplate } = this.settings;

    if (match && label.indexOf(match) === -1) return '';

    if (this.checkable) {
      return Select.createOptionWithCheckbox(selected, value, label);
    }
    
    if (optionTemplate) {
      return optionTemplate(selected, value, label);
    }
    
    return this.createOptionItem(selected, value, label);
  }

  static createSearch() {
    const searchDom = `<div class="select-search">
      <input type="search" class="ui-form-control">
    </div>`;
    return searchDom;
  }

  static createOptionWithCheckbox(selected, value, label) {
    const checked = selected ? 'checked' : '';
    return `<li class="menu-item label-item" title="${label}" data-value="${value}">
      <label class="ui-checkbox"><input type="checkbox" ${checked} value="${value}"/><i class="iconfont"></i>${label}</label>
    </li>`;
  }

  changeCheck(checkbox) {
    if (u.hasClass(checkbox, 'check-group')) {
      this.changeCheckParent(checkbox);
    } else {
      const checked = checkbox.checked;
      this.changeCacheValue(checkbox.value, checked);
      this.changeCheckAll(checkbox.value);
    }

    this.changeMultiSelectValue(true);
  }

  changeCheckParent(checkbox) {
    const parent = checkbox.value;
    const { checked } = checkbox;
    const child = this.cache[parent];

    child.forEach(id => {
      this.select.option.querySelector('[value="' + id + '"]').checked = checked;
    });

    this.changeCacheValue(child, checked);
  }

  changeCheckAll(value) {
    const { parent } = this.cache[value];
    if (!parent) return;

    const child = this.cache[parent];
    const checkbox = this.select.option.querySelector('[value="' + parent + '"]');
    let check = true;
    let indeterminate = false;

    child.forEach(itm => {
      const { selected } = this.cache[itm];
      if (selected) {
        indeterminate = true;
      } else {
        check = false;
      }
    });

    checkbox.checked = check;
    checkbox.indeterminate = !check && indeterminate;
  }

  toggleItemSelected(value) {
    const add = this.value.indexOf(value) === -1;
    this.changeCacheValue(value, add);
  }

  changeCacheValue(value, add) {
    if (!this.multiple) {
      this.value = add ? [value] : [];
    } else if (Array.isArray(value)) {
      value.forEach(item => {
        this.dealMultiValue(item, add);
      });
    } else {
      this.dealMultiValue(value, add);
    }
  }

  dealMultiValue(value, add) {
    const { select, max } = this;
    const index = this.value.indexOf(value);
    if (add) {
      if (index === -1) {
        this.value.push(value);
      }
    } else if (index > -1) {
      this.value.splice(index, 1);
    }

    if (max) {
      if (this.value.length >= max) {
        u.addClass(select.option, 'no-add');
      } else {
        u.removeClass(select.option, 'no-add');
      }
    }
  }

  changeMultiSelectedClass() {
    const { select, value } = this;
    const { selectedClass } = this.settings;

    u.forEach(select.options, item => {
      const _value = item.getAttribute('data-value');

      if (value.indexOf(_value) > -1) {
        u.addClass(item, selectedClass);
      } else {
        u.removeClass(item, selectedClass);
      }
    });
  }

  changeOriginElementValue(eventType) {
    const { select, nodeType, value } = this;
    const originElement = select.originElement;

    if (nodeType === 'input') {
      originElement.value = this.value;
    }

    if (nodeType === 'select') {
      const options = originElement.options;

      if (Array.isArray(value)) {
        u.forEach(options, item => {
          item.selected = value.indexOf(item.value) > -1;
        });
      }
    }

    originElement.trigger(eventType);
  }

  /**
   * @param {Boolean} show
   * @param {String} type
   * */
  changeMultiSelectValue(show = false, type = 'change') {
    const { select } = this;
    this.changeOriginElementValue(type);

    if (!show) {
      this.hideOption(select);
    }
    
    select.innerHTML = this.createMultiTag() || this.settings.emptyLabel;

    this.changeMultiSelectedClass();
  }

  createMultiTag() {
    const values = this.value;
    const { tagClass } = this.settings;

    if (!values.length) {
      return this.settings.emptyLabel;
    }

    const str = values.reduce((result, item) => {
      const { label, value } = this.cache[item];
      let tagClassName = 'gray';
      if (tagClass) {
        if (typeof tagClass === 'string') {
          tagClassName = tagClass;
        }
        if (typeof tagClass === 'function') {
          tagClassName = tagClass(label, value);
        }
      }
      return result + `<span class="ui-tag ${tagClassName} closeable" data-tooltip data-position="center top" data-title="${label}">${label} <i data-value="${value}" class="iconfont icon-times js-del-selected"></i></span>`;
    }, '');
    return str;
  }

  /**
   * @method
   * @param {Object} select
   * */
  bindEvent(select) {
    const option = select.option;
    const self = this;
    const selectFn = this.settings.selectFn;

    this.selectClickEvent(select);

    u.on(option, 'click', '.menu-item', function (e) {
      e.stopPropagation();
      
      if (u.hasClass(this, 'label-item')) return;

      if (self.max && self.value.length >= self.max && !u.hasClass(this, 'selected')) {
        return;
      }

      const value = this.getAttribute('data-value');
      const { label } = self.cache[value];

      if (selectFn && typeof selectFn === 'function') {
        selectFn(value, select);
      }

      self.toggleItemSelected(value);

      if (self.multiple) {
        self.changeMultiSelectValue();
      } else {
        self.changeSelectValue(select, value, label);
        self.changeMultiSelectedClass();
      }
    });

    u.on(option, 'click', '.group-label', function (e) {
      e.stopPropagation();

      u.toggleClass(this, 'expend');
    });

    u.on(option, 'change', 'input', function () {
      self.changeCheck(this);
    });

    u.on(option, 'click', '.select-search', function (e) {
      e.stopPropagation();
    });

    let timer = null;

    u.on(option, 'input', '.ui-form-control', function () {
      clearTimeout(timer);

      timer = setTimeout(() => {
        const val = this.value;
        const main = self.createOptionContent(self.data, val);
        let con = main || '<li class="li-empty">暂无搜索结果</li>';

        option.querySelector('.select-main').innerHTML = con;
      }, 200);
    });
  }
}

export default function (selector, options) {
  if (typeof selector === 'string') {
    const elements = document.querySelectorAll(selector);

    return [].slice.call(elements).map(item => {
      return new Select(item, options);
    });
  } 

  if (typeof selector === 'object' && selector !== null) {
    return new Select(selector, options);
  }

  return null;
}
