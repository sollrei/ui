import u from '../base/util.js';

class CheckAll {
  constructor(selector, option) {
    const defaultSettings = {
      groupClass: 'tree-group',
      checkAllClass: 'check-all',
      nodeClass: 'tree-node',
      labelClass: 'node-label'
    };
    this.settings = Object.assign({}, defaultSettings, option);
    this.init(selector);
  }
  
  init(selector) {
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!element) return;

    this.element = element;


    this.cache = {};
    this.data = [];
    this.value = [];

    this.events();
  }

  getDataFromDom(element) {
    const { groupClass, nodeClass, labelClass } = this.settings;
    let elements = element;

    if (typeof elements === 'object' && !elements.length) {
      elements = [element];
    }

    let elementArr = [].slice.call(elements);

    if (u.hasClass(elementArr[0], labelClass)) {
      const input = elementArr[0].querySelector('input');
      const { value } = input;
      const label = input.parentNode.innerText || '';

      return {
        label,
        value: value || u.createId(),
        checkbox: input,
        children: this.getDataFromDom(elementArr.splice(1))
      };
    }

    return elementArr.map(item => {
      if (u.hasClass(item, groupClass)) {
        return this.getDataFromDom(item.children);
      }

      if (u.hasClass(item, nodeClass)) {
        const input = item.querySelector('input');
        const { value } = input;
        const label = input.parentNode.innerText || '';
      
        return {
          label,
          value,
          checkbox: input
        };
      }

      return null;
    });
  }

  createDataCache(data, parent) {
    data.forEach(item => {
      const { checkbox, value, children, label } = item;

      const _item = {
        label,
        value,
        checkbox
      };

      if (parent) {
        _item.parent = parent;
      }

      if (children) {
        _item.children = children.map(itm => itm.value);
        this.createDataCache(children, value);
      }

      this.cache[value] = _item;
    });
  }

  dealCheck(item) {
    this.dealCheckChild(item);
    this.dealCheckParent(item);
  }

  dealCheckChild(item) {
    const checked = item.checkbox.checked;
    const { cache } = this;

    if (item.children) {
      item.children.forEach(val => {
        const _item = cache[val];
        const { checkbox } = _item;
        if (checked) {
          checkbox.indeterminate = false;
        }
        if (checkbox.checked !== checked && !checkbox.disabled) {
          checkbox.checked = checked;
          this.dealCheckChild(_item);
        }
      });
    }
  }

  dealCheckParent(item) {
    const { cache } = this;

    if (item.parent) {
      const _item = cache[item.parent];
      const { children, checkbox } = _item;

      const originChecked = checkbox.checked;
      const originIndeterminate = checkbox.indeterminate;

      let check = true;
      let indeterminate = false;

      children.forEach(val => {
        const itm = cache[val];
        if (itm.checkbox.checked) {
          indeterminate = true;
        } else if (itm.checkbox.indeterminate) {
          indeterminate = true;
          check = false;
        } else {
          check = false;
        }
      });

      const newIndeterminate = !check && indeterminate;
      let newCheck = check && !newIndeterminate;

      checkbox.indeterminate = newIndeterminate;
      checkbox.checked = newCheck;
      
      if (originChecked !== newCheck || originIndeterminate !== newIndeterminate) {
        this.dealCheckParent(_item);
      }
    }
  }

  changeValue() {
    const { cache } = this;
    this.value = [];
    Object.keys(cache).forEach(key => {
      const { label, value, checkbox, children } = cache[key];
      
      if (checkbox.checked && !children) {
        this.value.push({
          label,
          value
        });
      }
    });
  }

  events() {
    const { element } = this;

    let ele = element;

    // if (!u.hasClass(ele, 'ui-tree')) {
    //   ele = this.element.querySelector('.ui-tree');
    // }

    this.data = this.getDataFromDom(ele.children);
    
    this.createDataCache(this.data);

    const self = this;

    u.on(element, 'change', 'input', function () {
      const value = this.value;
      const item = self.cache[value];
      
      self.dealCheck(item);
      self.changeValue();
      element.trigger('tree-change');
    });
  }
}


export default CheckAll;
