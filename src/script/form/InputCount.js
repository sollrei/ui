import Util from '../base/util.js';

class InputCount {
  /**
   * @param {*} selector 
   * @param {object=} options 
   */
  constructor(selector, options) {
    const defaultSetting = {
      countElementClass: 'count',
      inputElementSelector: '.ui-form-control'
    };

    const settings = Object.assign({}, defaultSetting, options);
    
    this.settings = settings;

    this.init(selector);
  }

  /**
   * @param {*} selector 
   */
  init(selector) {
    const { countElementClass, inputElementSelector } = this.settings;

    this.initCountElement(selector);

    Util.on(document, 'input', selector + ' ' + inputElementSelector, function () {
      const input = this;
      const wrap = input.closest(selector);
      const max = input.getAttribute('maxlength');
      const count = wrap.querySelector('.' + countElementClass);

      let timer = this.timer;

      clearTimeout(timer);
      
      timer = setTimeout(() => {
        const value = this.value.trim();
        const length = value.length;

        count.innerHTML = length > max
          ? `<em class="ft-error">${length}</em>/${max}`
          : `${length}/${max}`;
      }, 100);
    });
  }

  /**
   * @param {*} selector 
   */
  initCountElement(selector) {
    const { countElementClass, inputElementSelector } = this.settings;
    let elements;

    if (typeof selector === 'string') {
      elements = document.querySelectorAll(selector);
    }

    if (typeof selector === 'object') {
      elements = selector;
    }

    if (!elements) return;

    [].slice.call(elements).forEach(item => {
      const input = item.querySelector(inputElementSelector);
      const length = input.value.length;
      const max = input.getAttribute('maxlength');
      const count = item.querySelector('.' + countElementClass);
      
      if (!count) {
        item.appendChild(this.createCountElement(`${length}/${max}`));
      } else {
        count.innerHTML = `${length}/${max}`;
      }
    });
  }

  /**
   * @param {string} inner 
   * @returns {Element} count span
   */
  createCountElement(inner) {
    const { countElementClass } = this.settings;
    return Util.createElement('span', { className: countElementClass }, inner);
  }
}
export default InputCount;
