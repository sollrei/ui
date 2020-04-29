
import Util from '../base/util.es6';

class InputCount {
  constructor(selector, options) {
    const defaultSetting = {
      countElementClass: '.count',
      inputElementSelector: '.ui-form-control'
    };

    const settings = Object.assign({}, defaultSetting, options);
    
    this.settings = settings;

    this.init(selector);
  }

  init(selector) {
    const { countElementClass, inputElementSelector } = this.settings;

    Util.on(document, 'input', selector + ' ' + inputElementSelector, function () {
      const input = this;
      const wrap = input.closest(selector);
      const max = input.getAttribute('maxlength');
      let countElement = wrap.querySelector(countElementClass);

      let timer = this.timer;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const value = this.value.trim();
        const length = value.length;

        countElement.innerHTML = length > max
          ? `<em class="ft-error">${length}</em>/${max}`
          : `${length}/${max}`;
      }, 500);
    });
  }

  createCountElement(inner) {
    const { countElementClass } = this.settings;
    return Util.createElement('span', { className: countElementClass }, inner);
  }
}

export default InputCount;
