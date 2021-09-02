class Lottery {
  constructor(selector, options) {
    const defaultSettings = {
      items: 6,
      round: 6,
      delay: 1400,
      ajaxFn: null,
      callbackFn: null,
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
      ajaxFn(index => {
        this.fetching = false;
        this.index = index;
        this.rotate(index);
      });
    }
  }

  rotate(index) {
    const { element } = this;
    const target = this.getDeg(index);
    
    this.moving = true;

    element.classList.add('animation');
    element.style.transform = `rotate(${target}deg)`;
  }

  getDeg(result) {
    const { items, round } = this.settings;
    const circle = 360 * round;
    const single = 360 / items;
    const realIndex = items - result - 1;
    const half = single * 0.5;

    const target = ((single * realIndex) + half) + circle;
    return target;
  }

  changeHighlight() {
    const { itemSelector, activeClass } = this.settings;
    const { element, index } = this;

    const item = element.querySelectorAll(itemSelector)[index];

    if (item) {
      item.classList.add(activeClass);
    }
  }

  removeHighlight() {
    const { activeClass } = this.settings;
    const { element } = this;

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
    const { delay, callbackFn } = this.settings;

    element.addEventListener('transitionend', () => {
      this.changeHighlight();

      setTimeout(() => {
        if (typeof callbackFn === 'function') {
          callbackFn(this.index);
          this.reset();
        }
      }, delay);
    });
  }
}

export default Lottery;
