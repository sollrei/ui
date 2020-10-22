import u from '../base/util.js';
import SelectBase from './SelectBase.js';

class Autocomplete extends SelectBase {
  /**
   * @param {*} elementSelector 
   * @param {object=} options 
   */
  constructor(elementSelector, options) {
    const defaultSettings = {
      selectShowClass: 'ui-select-active',
      selectedClass: 'selected',

      url: '',

      loadingClass: 'loading',
      showClass: 'show',
      selectClass: 'ui-autocomplete',
      optionClass: 'ui-select-dropdown hide',

      queryKey: 'keyword',

      labelName: 'label',
      valueName: 'id',

      placeholder: '请输入',
      emptyLi: '暂无匹配结果',

      liHeight: 32,

      fetchSuccess(res) {
        return res.code === 200;
      }
    };

    const settings = Object.assign({}, defaultSettings, options);
    super(settings);
    this.settings = settings;

    this.init(elementSelector);
    this.events();
  }

  /**
   * @param {*} elementSelector
   */
  init(elementSelector) {
    let ele = elementSelector;

    if (typeof elementSelector === 'string') {
      ele = document.querySelector(elementSelector);
    }

    if (!ele) return;

    this.element = ele;

    this.fetchUrl = this.settings.url;

    if (ele.getAttribute('data-url')) {
      this.fetchUrl = ele.getAttribute('data-url');
    }
    
    const wrap = ele.parentNode;
    const selectDom = wrap.appendChild(this.createIconInput());
    const optionDom = selectDom.appendChild(this.createOption());

    this.selectInput = selectDom.querySelector('input');
    this.optionUl = optionDom.querySelector('.select-main');

    this.select = selectDom.querySelector('.ui-icon-input');
    this.select.option = optionDom;

    this.timer = null;
    this.blurTimer = null;

    this.cacheOptionData = [];
  }

  fetchData(keyword, callback) {
    const { fetchSuccess, queryKey } = this.settings;
    const data = {};

    u.addClass(this.select, 'loading');

    if (keyword !== '') {
      data[queryKey] = keyword;
    }

    u.fetchData(this.fetchUrl, data).then(res => {
      u.removeClass(this.select, 'loading');

      if (fetchSuccess(res)) {
        if (callback) {
          callback(res);
        }
      }
    });
  }

  createIconInput() {
    const div = document.createElement('div');
    const { selectClass, placeholder } = this.settings;
    const id = u.createId();

    div.className = selectClass;

    div.innerHTML = `<div class="ui-icon-input">
      <input type="text" class="ui-form-control" autocomplete="off" placeholder="${placeholder}" id="input${id}">
      <label class="suffix" for="input${id}"><i class="iconfont icon-search"></i></label>
    </div>`;

    return div;
  }

  createOption() {
    const { optionClass } = this.settings;
    const div = document.createElement('div');
    div.className = optionClass;

    div.innerHTML = '<div class="select-ul"><ul class="select-main"></ul></div>';

    return div;
  }

  /**
   * @param {Array} data - option data
   */
  changeOption(data) {
    const { labelName, valueName, emptyLi } = this.settings;
    if (Array.isArray(data) && data.length) {
      this.optionUl.innerHTML = data.reduce((pre, d) => pre + this.createOptionItem({ label: d[labelName], value: d[valueName] }), '');
      const selectItem = data.filter(item => {
        return item[valueName].toString() === this.value;
      });
      
      this.selectIndex = selectItem.length ? selectItem[0].$index : -1;
    } else {
      this.optionUl.innerHTML = `<li class="li-empty">${emptyLi}</li>`;
      this.selectIndex = -1;
    }
  }

  /**
   * @param {object} e 
   */
  handleFocus(e) {
    const input = e.target;
    const value = input.value;

    this.hideOther(this.select);

    this.fetchData(value, (res) => {
      const data = res.data.map((item, index) => {
        return Object.assign({}, item, {
          $index: index
        });
      });

      this.cacheOptionData = data;
      this.changeOption(data);
      this.showOption(this.select);
    });
  }

  /**
   * @param {HTMLElement} li 
   */
  handleSelect(li) {
    const value = li.getAttribute('data-value');
    const label = li.innerText;

    this.changeLabelInput(label);
    this.changeValue(value);
  }

  handleBlur() {
    clearTimeout(this.blurTimer);

    this.blurTimer = setTimeout(() => {
      if (typeof this.value === 'undefined' || (typeof this.value === 'object' && !this.value)) {
        this.selectInput.value = '';
      }
    }, 100);
  }

  changeLabelInput(label) {
    this.selectInput.value = label;
  }

  changeValue(value) {
    this.value = value;
    this.element.value = value;
    this.element.trigger('change');
  }

  scrollToSelected(index) {
    const height = this.settings.liHeight;
    const top = index * height;

    this.optionUl.scrollTo({ top });
  }

  handleDown() {
    const index = this.selectIndex;
    const length = this.cacheOptionData.length;

    const newIndex = (index + 1 + length) % length;
    this.changeSelectLi(newIndex);
  }

  handleUp() {
    let index = this.selectIndex;
    const length = this.cacheOptionData.length;

    if (index < 0) {
      index = length;
    }

    const newIndex = ((index - 1) + length) % length;
    this.changeSelectLi(newIndex);
  }

  changeSelectLi(index) {
    this.selectIndex = index;

    const li = this.optionUl.children[index];
    this.handleSelect(li);
    this.changeSelectedClass(this.optionUl, li);
    this.scrollToSelected(index);
  }

  events() {
    const { selectInput, optionUl } = this;
    const self = this;

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    selectInput.addEventListener('focus', this.handleFocus);

    selectInput.addEventListener('blur', this.handleBlur);

    selectInput.addEventListener('keydown', e => {
      if (e.keyCode === 13) {
        e.preventDefault();
      }

      if (e.keyCode === 40) {
        self.handleDown();
      }

      if (e.keyCode === 38) {
        e.preventDefault();
        self.handleUp();
      }
    });

    selectInput.addEventListener('input', e => {
      self.value = null;
      this.handleFocus(e);
    });

    selectInput.addEventListener('click', e => {
      e.stopPropagation();
    });

    u.on(optionUl, 'click', '.menu-item', function () {
      self.handleSelect(this);
    });
  }
}

export default Autocomplete;
