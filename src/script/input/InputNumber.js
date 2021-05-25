import u from '../base/util.js';

class InputNumber {
  constructor(selector, options) {
    const defaultSettings = {
      disableClass: 'disabled',

      decimal: 2,
      step: 1,
      min: null,
      max: null,
      callback: null
    };

    this.settings = Object.assign({}, defaultSettings, options);

    this.init(selector);
  }

  init(selector) {
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }
    
    if (!element) return;

    this.bindEvents(element);
  }

  bindEvents(container) {
    const input = container.querySelector('input');
    const up = container.querySelector('.step-up');
    const down = container.querySelector('.step-down');

    const self = this;
    const { step, disableClass } = this.settings;
    const _step = input.getAttribute('step')
      ? Number(input.getAttribute('step'))
      : step;

    u.on(container, 'click', '.step-up', function () {
      if (!u.hasClass(this, disableClass)) {
        self.stepUp(input, _step, up, down);
      }
    });

    u.on(container, 'click', '.step-down', function () {
      if (!u.hasClass(this, disableClass)) {
        self.stepDown(input, _step, up, down);
      }
    });
  }

  stepUp(input, step, up, down) {
    const { max } = this.settings;
    const _max = input.getAttribute('max')
      ? Number(input.getAttribute('max'))
      : max;
    this.max = _max;

    this.changeInputValue(input, step);

    this.checkValue('plus', _max, Number(input.value), up, down);
    this.triggerCallback(input);
  }

  stepDown(input, step, up, down) {
    const { min } = this.settings;
    const _min = input.getAttribute('min')
      ? Number(input.getAttribute('min'))
      : min;
    this.min = _min;

    this.changeInputValue(input, -step);

    this.checkValue('minus', _min, Number(input.value), up, down);
    this.triggerCallback(input);
  }

  changeInputValue(input, step) {
    const ele = input;
    const value = Number(ele.value);
    if (value + step < this.min || value + step > this.max) return;
    
    let val = value + step;
    if (this.settings.decimal) {
      let n = Math.pow(10, this.settings.decimal);

      val = Math.round(val * n) / n; 
    }
    ele.value = val;
  }

  checkValue(type, total, result, up, down) {
    const { disableClass } = this.settings;

    if (type === 'plus') {
      if (typeof total === 'number' && (result >= total)) {
        u.addClass(up, disableClass);
      } else {
        u.removeClass(up, disableClass);
      }
      u.removeClass(down, disableClass);
    }

    if (type === 'minus') {
      if (typeof total === 'number' && (result <= total)) {
        u.addClass(down, disableClass);
      } else {
        u.removeClass(down, disableClass);
      }
      u.removeClass(up, disableClass);
    }
  }

  triggerCallback(ele) {
    const callback = this.settings.callback;

    if (callback && typeof callback === 'function') {
      callback(ele.value);
    }
  }
}

export default InputNumber;
