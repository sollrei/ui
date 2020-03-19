
import Util from '../base/util.es6';

class InputCount {
  constructor(selector, options) {
    const defaultSetting = {
      countElementClass: 'count',
      inputElementSelector: '.ui-form-control'
    };
    const settings = Object.assign({}, defaultSetting, options);
    const elements = document.querySelectorAll(selector);
    if (!elements.length) {
      return;
    }
    this.settings = settings;

    this.init(elements);
  }

  init(elements) {
    const { countElementClass, inputElementSelector } = this.settings;

    [].slice.call(elements).forEach(item => {
      const element = item.querySelector(inputElementSelector);
      const max = element.getAttribute('maxlength');
      let countElement = item.querySelector('.' + countElementClass);

      if (!countElement) {
        countElement = item.appendChild(this.createCountElement(`0/${max}`));
      }
      element.count = countElement;
      element.timer = null;

      element.count.innerHTML = element.value.length + '/' + max;

      InputCount.bindEvents(element);
    });
  }

  createCountElement(inner) {
    const { countElementClass } = this.settings;
    return Util.createElement('span', { className: countElementClass }, inner);
  }

  static bindEvents(element) {
    element.addEventListener('input', function () {
      let timer = this.timer;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const value = this.value.trim();
        const length = value.length;
        const max = this.getAttribute('maxlength');

        this.count.innerHTML = length > max
          ? `<em class="ft-error">${length}</em>/${max}`
          : `${length}/${max}`;
      }, 500);
    });
  }
}

export default InputCount;
