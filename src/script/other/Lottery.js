class Lottery {
  constructor(selector, options) {
    const defaultSettings = {
      items: [],
      round: 6,
      delay: 1400,
      ajaxFn: null,
      onRotateEnd: null,
      callback: null,
      itemSelector: '.item',
      activeClass: 'active'
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

    this.element = element;

    this.moving = false;

    this.events();
  }

  start() {
    if (this.moving || this.fetching) return;
    
    const { ajaxFn } = this.settings;
    
    if (typeof ajaxFn === 'function') {
      this.fetching = true;
      ajaxFn(result => {
        this.fetching = false;
        this.result = result;
        this.rotate(result);
      });
    }
  }

  rotate(result) {
    const { element } = this;
    const { items } = this.settings;
    const index = items.indexOf(result);
    const target = this.getDeg(index);

    this.index = index;
    this.moving = true;

    element.classList.add('animation');
    element.style.transform = `rotate(${target}deg)`;
  }

  getDeg(result) {
    const { items, round } = this.settings;
    const total = items.length;
    const circle = 360 * round;
    const single = 360 / total;
    const realIndex = total - result - 1;
    const half = single * 0.5;

    const target = ((single * realIndex) + half) + circle;
    return target;
  }

  changeHighlight() {
    const { itemSelector, activeClass } = this.settings;
    const { element, index } = this;

    if (!activeClass) return;

    const item = element.querySelectorAll(itemSelector)[index];

    if (item) {
      item.classList.add(activeClass);
    }
  }

  removeHighlight() {
    const { activeClass } = this.settings;
    const { element } = this;

    if (!activeClass) return;

    const item = element.querySelector('.' + activeClass);

    if (item) {
      item.classList.remove(activeClass);
    }
  }

  reset() {
    this.moving = false;
    this.removeHighlight();
    this.element.classList.remove('animation');
    this.element.style.transform = 'rotate(0deg)';
  }

  events() {
    const { element } = this;
    const { delay, callback, onRotateEnd } = this.settings;

    element.addEventListener('transitionend', () => {
      this.changeHighlight();

      if (typeof onRotateEnd === 'function') {
        onRotateEnd(this.result);
      }

      setTimeout(() => {
        if (typeof callback === 'function') {
          callback(this.result);
          this.reset();
        }
      }, delay);
    });
  }
}

export default Lottery;
