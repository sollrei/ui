import util from '../base/util.js';

class InputNumber {
  constructor(selector, options) {
    const defaultSettings = {
      disableClass: 'disabled',

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

    util.on(container, 'click', '.step-up', function () {
      if (!util.hasClass(this, disableClass)) {
        self.stepUp(input, _step, up, down);
      }
    });

    util.on(container, 'click', '.step-down', function () {
      if (!util.hasClass(this, disableClass)) {
        self.stepDown(input, _step, up, down);
      }
    });
  }

  stepUp(input, step, up, down) {
    const { max } = this.settings;
    const _max = input.getAttribute('max')
      ? Number(input.getAttribute('max'))
      : max;

    if (input.stepUp && typeof input.stepUp === 'function' && input.getAttribute('step')) {
      input.stepUp();
    } else {
      InputNumber.changeInputValue(input, step);
    }

    this.checkValue('plus', _max, Number(input.value), up, down);
    this.triggerCallback(input);
  }

  stepDown(input, step, up, down) {
    const { min } = this.settings;
    const _min = input.getAttribute('min')
      ? Number(input.getAttribute('min'))
      : min;

    if (input.stepDown && typeof input.stepDown === 'function') {
      input.stepDown();
    } else {
      InputNumber.changeInputValue(input, -step);
    }

    this.checkValue('minus', _min, Number(input.value), up, down);
    this.triggerCallback(input);
  }

  static changeInputValue(input, step) {
    const ele = input;
    const value = Number(ele.value);

    ele.value = value + step;
  }

  checkValue(type, total, result, up, down) {
    const { disableClass } = this.settings;

    if (type === 'plus') {
      if (typeof total === 'number' && (result >= total)) {
        util.addClass(up, disableClass);
      } else {
        util.removeClass(up, disableClass);
      }
      util.removeClass(down, disableClass);
    }

    if (type === 'minus') {
      if (typeof total === 'number' && (result <= total)) {
        util.addClass(down, disableClass);
      } else {
        util.removeClass(down, disableClass);
      }
      util.removeClass(up, disableClass);
    }
  }

  triggerCallback(ele) {
    const callback = this.settings.callback;

    if (callback && typeof callback === 'function') {
      callback(ele.value);
    }
  }
}

module.exports = InputNumber;
