import u from '../base/util.es6';
import CheckAll from './CheckAll.es6';
// need Sortable js
let Sortable;

class Transfer {
  constructor(selector, options, sortable) {
    const defaultSettings = {};

    this.settings = Object.assign({}, defaultSettings, options);

    Sortable = sortable;
    this.init(selector);
  }

  init(selector) {
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!(element && element instanceof HTMLElement)) {
      throw new Error('need element');
    }

    this.element = element;

    this.targetList = element.querySelector('.select-list');
    this.treeList = element.querySelector('.ui-tree');

    this.value = [];

    this.createTeeCheck();
  }

  createTeeCheck() {
    const { element } = this;
    const tree = element.querySelector('.ui-tree');

    this.tree = new CheckAll(tree);

    this.value = [];

    this.events();
  }

  changeValue(newValue) {
    const { value } = this;
    const _value = [];
    const addValue = [];

    if (!value.length) {
      this.value = newValue;
      this.changeSelectedList();
      return;
    }

    const valueIndex = [];
    
    newValue.forEach(item => {
      let hasIt = false;

      value.forEach((itm, index) => {
        if (hasIt) return;

        if (item.value === itm.value) {
          hasIt = true;
          valueIndex.push(index);
        }
      });

      if (!hasIt) {
        addValue.push(item);
      }      
    });

    value.forEach((item, index) => {
      if (valueIndex.indexOf(index) > -1) {
        _value.push(item);
      }
    });

    this.value = _value.concat(addValue);
    this.changeSelectedList();
  }

  changeSelectedList() {
    const { targetList, value } = this;
    const domString = value.reduce((pre, cur) => {
      return pre + `<div class="transfer-item" data-value="${cur.value}"><span class="name">${cur.label}</span><span class="delete iconfont icon-times"></span></div>`;
    }, '');

    targetList.innerHTML = domString;
  }

  removeSelectedItem(ele) {
    const item = ele.closest('.transfer-item');
    const value = item.getAttribute('data-value');
    const input = this.treeList.querySelector(`input[value="${value}"]`);

    input.checked = false;
    input.trigger('change');
  }

  changeSort(oldIndex, newIndex) {
    const { value } = this;

    value.splice(newIndex, 0, value.splice(oldIndex, 1)[0]);
  }

  events() {
    const self = this;
    const { tree, element, targetList } = this;

    new Sortable(targetList, {
      onSort(evt) {
        const { oldIndex, newIndex } = evt;
        self.changeSort(oldIndex, newIndex);
      }
    });

    u.on(element, 'tree-change', '.ui-tree', function () {
      self.changeValue(tree.value);
    });

    u.on(element, 'click', '.icon-times', function () {
      self.removeSelectedItem(this);
    });
  }
}

export default Transfer;
