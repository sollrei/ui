import u from '../base/util.es6';

const doc = document;

class SelectBase {
  constructor(options) {
    const defaultSettings = {
      selectElement: 'div',
      selectedClass: 'selected',

      showClass: 'show',

      selectShowClass: 'ui-select-active',
      selectClass: 'ui-select ui-form-control',

      optionClass: 'ui-select-dropdown hide'
    };

    this.settings = Object.assign({}, defaultSettings, options);
  }

  /**
   * @method
   * @param {Boolean} selected  - selected status
   * @param {String} value - option value
   * @param {String} label - option text
   * @param {Number} level - linkage level
   * @returns {String}  new option html
   * */
  createOptionItem(selected, value, label, level = 1, mark = '') {
    const { selectedClass } = this.settings;
    const className = selected ? selectedClass : '';

    return `<li class="menu-item ${className}" data-value="${value}" data-level="${level}">${label}${mark}</li>`;
  }

  /**
   * @method
   * change selected option     in Cascader ColorPicker
   * @param {HTMLElement} option
   * @param {HTMLElement} current
   * */
  changeSelectedClass(option, current) {
    const { selectedClass } = this.settings;
    const elements = option.querySelectorAll(`.${selectedClass}`);

    u.forEach(elements, item => {
      u.removeClass(item, selectedClass);
    });

    u.addClass(current, selectedClass);
  }

  removeMultipleTag(element) {
    const value = element.getAttribute('data-value');

    this.changeCacheValue(value, false);
    this.changeMultiSelectValue(true);
  }

  /**
   * @method
   * bind click event
   * @param {HTMLElement|Node|Object} select
   * @param {function} [beforeShow = null]
   * */
  selectClickEvent(select, beforeShow) {
    const self = this;

    select.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target;

      if (self.multiple && u.hasClass(target, 'js-del-selected')) {
        self.removeMultipleTag(target);
        return;
      }

      if (this.show) {
        self.hideOption(select);
      } else {
        self.hideOther(select);

        if (beforeShow && typeof beforeShow === 'function') {
          beforeShow(select);
        }

        self.showOption(select);
      }
    }, false);
  }

  /**
   * @method
   * hide other select's option
   * @param {HTMLElement} select
   * */
  hideOther(select) {
    const selectShowClass = this.settings.selectShowClass;
    const selector = doc.querySelectorAll(`.${selectShowClass}`);

    u.forEach(selector, item => {
      if (item !== select) this.hideOption(item);
    });
  }

  /**
   * @method
   * display select option
   * @param {Object} select
   * */
  showOption(select) {
    const element = select;
    const option = select.option;
    const rect = select.getBoundingClientRect();
    const { height, top } = rect;
    const { selectShowClass, showClass } = this.settings;
    const optionHeight = option.clientHeight;

    // option.style.top = `${height + 3}px`;
    option.style.zIndex = '100';

    if (top
      && (top > optionHeight)
      && (top > doc.documentElement.clientHeight - optionHeight - height)
    ) {
      option.style.top = 'auto';
      option.style.bottom = height + 3 + 'px';
    } else {
      option.style.bottom = 'auto';
    }

    if (this.search) {
      const search = select.option.querySelector('.ui-form-control');
      
      if (search && search.value !== '') {
        search.value = '';
        search.trigger('input');
      }
    }

    u.addClass(option, showClass);
    u.addClass(select, selectShowClass);

    element.show = true;
  }

  /**
   * hide option
   * @param {Object} select
   * @param {String} className
   * */
  hideOption(select) {
    const { selectShowClass, showClass } = this.settings;
    const element = select;
    const option = select.option;

    u.removeClass(select, selectShowClass);
    u.removeClass(option, showClass);

    element.show = false;
  }

  /**
   * change text and value
   * @param {Object} select
   * @param {String} value
   * @param {String} label
   * @param {Boolean} show
   * @param {String} type
   * */
  changeSelectValue(select, value, label, show = false, type = 'change') {
    const element = select;

    element.innerHTML = label;
    element.originElement.value = value;
    element.originElement.trigger(type);

    if (!show) {
      this.hideOption(select);
    }
  }
}

doc.addEventListener('click', () => {
  const elements = doc.querySelectorAll('.ui-select-active');
  [].slice.call(elements).forEach(item => {
    const select = item;
    const option = select.option;

    u.removeClass(select, 'ui-select-active');
    u.removeClass(option, 'show');

    select.show = false;

    setTimeout(function () {
      option.style.zIndex = 0;
    }, 200);
  });
});

export default SelectBase;
