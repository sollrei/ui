import Util from '../base/util.js';

class Tag {
  constructor(selector, options) {
    const element = document.querySelector(selector);

    if (!element) return;

    const defaultSettings = {
      className: '',
      defaultValue: [],

      inputType: 'text',

      editable: true,

      valueSelector: '.tag-values',

      onDeleteFn: null,

      max: null
    };

    this.settings = Object.assign({}, defaultSettings, options);
    this.wrap = element;
    this.init();
  }

  init() {
    const { defaultValue, editable } = this.settings;

    this.tags = [];
    this.valueInput = document.querySelector(this.settings.valueSelector);

    const list = Tag.createTagList();
    const input = this.createInput();

    this.wrap.appendChild(list);

    if (editable) {
      this.wrap.appendChild(input);
    }

    this.list = list;
    this.input = input;

    const value = this.valueInput.value ? this.valueInput.value.split(',') : defaultValue;

    this.addTags(value);

    this.events();
  }

  static createTagList() {
    return Util.createElement('ul', { className: 'tag-list' });
  }

  createInput() {
    const { inputType } = this.settings;

    return Util.createElement('input', { type: inputType, className: 'tag-input' });
  }

  emptyTags() {
    this.list.innerHTML = '';
    this.tags = [];
    this.addValueToInput();
  }

  /**
   * @param {Array} values
   * */
  addTags(values) {
    if (Array.isArray(values) && values.length) {
      values.forEach(item => {
        this.addTagValue(item);
      });
    }
  }

  /**
   * @param {string} value
   * */
  addTagValue(value) {
    const { max } = this.settings;
    if (value
      && (this.tags.indexOf(value) < 0)
      && (max ? (this.tags.length < max) : true)) {
      this.tags.push(value);
      this.appendTag(value);
      this.addValueToInput();
    }

    if (this.settings.editable) {
      this.input.value = '';
    }
  }

  appendTag(value) {
    const item = Tag.createTagDom(value);

    const div = document.createElement('div');

    div.innerHTML = item;
    this.list.appendChild(div.firstElementChild);
  }

  removeTagValue(value) {
    const tags = this.tags;
    const { onDeleteFn } = this.settings;
    for (let i = 0, l = tags.length; i < l; i += 1) {
      if (tags[i] === value) {
        tags.splice(i, 1);

        if (onDeleteFn) {
          onDeleteFn(value, i);
        }

        return;
      }
    }
  }

  removeTag(element) {
    const value = element.getAttribute('data-value');
    this.removeTagValue(value);

    const parent = element.parentNode;
    this.wrap.querySelector('.tag-list').removeChild(parent);

    this.addValueToInput();
  }

  addValueToInput() {
    const valueInput = this.valueInput;

    if (this.tags.length) {
      valueInput.value = this.tags.join(',');
    } else {
      valueInput.value = '';
    }

    valueInput.trigger('change');
  }

  static createTagDom(value) {
    return `<li class="tag">${value}<a href="javascript:;" data-value="${value}" class="iconfont icon-times tag-delete"></a></li>`;
  }

  events() {
    const wrap = this.wrap;
    const self = this;
    const input = this.input;
    const { editable } = this.settings;

    Util.on(wrap, 'click', '.tag-delete', function () {
      self.removeTag(this);
    });

    if (editable) {
      wrap.addEventListener('click', function () {
        self.input.focus();
      }, 'false');
    }

    input.addEventListener('keydown', function (e) {
      const code = e.keyCode;
      const value = this.value.trim ? this.value.trim() : this.value;

      if ((code === 13) || (code === 32)) {
        e.preventDefault();
        self.addTagValue(value);
      }
    });

    input.addEventListener('blur', function (e) {
      const value = this.value.trim ? this.value.trim() : this.value;

      self.addTagValue(value);
    });
  }
}

export default Tag;
