class Parallax {
  constructor(options = {}) {
    const defaultSettings = {
      selector: '[data-parallax]',
      ratio: 0.2,
      type: 'background',
      direction: 'vertical'
    };

    const settings = Object.assign(defaultSettings, options);

    this.settings = settings;
    this.init();
  }

  init() {
    const { selector, ratio, type, direction } = this.settings;
    const elements = document.querySelectorAll(selector);

    if (!elements.length) return;

    const docEle = document.documentElement;
    const winHeight = docEle.clientHeight;
    const documentHeight = docEle.scrollHeight;

    [].slice.call(elements).forEach(element => {
      let top = Parallax.getOffset(element).top;
      let eleHeight = element.scrollHeight;

      let _ratio = element.getAttribute('data-ratio') || ratio;
      let _type = element.getAttribute('data-type') || type;
      let _direction = element.getAttribute('data-direction') || direction;

      function scrollHandler() { // eslint-disable-line
        const _top = docEle.scrollTop;
        let val1 = Math.round((top - _top) * _ratio);
        let val2 = Math.round(((top - (winHeight / 2)) + (eleHeight - _top)) * _ratio);

        if (_type === 'background') {
          Parallax.changeBackground(element, _direction, val1);
        } else if (_type === 'foreground' && documentHeight > top) {
          Parallax.changeForeground(element, _direction, val2);
        }
      }

      window.addEventListener('scroll', scrollHandler);

      scrollHandler();
    });
  }

  static changeTranslate(element, direct, value) {
    let val = `translate${direct}(${value}px)`;
  
    element.style['-webkit-transform'] = val;
    element.style['-moz-transform'] = val;
    element.style.transform = val;
  }

  static getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.top + window.scrollX
    };
  }

  static changeBackground(element, direction, value) {
    if (direction === 'vertical') {
      element.style.backgroundPosition = 'center ' + -value + 'px';
    } else if (direction === 'horizontal') {
      element.style.backgroundPosition = -value + 'px center';
    }
  }

  static changeForeground(element, direction, value) {
    if (direction === 'vertical') {
      Parallax.changeTranslate(element, 'Y', value);
    } else if (direction === 'horizontal') {
      Parallax.changeTranslate(element, 'X', value);
    }
  }
}

export default Parallax;
