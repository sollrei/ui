import Util from '../base/util.es6';

class Popper {
  constructor(element, options) {
    const defaultSettings = {
      className: 'ui-popper',
      position: 'bottom',
      content: '',
      close: null
    };

    this.settings = Object.assign({}, defaultSettings, options);

    this.init(element);
  }

  init(element) {
    let { position } = this.settings;
    let data = element.getAttribute('data-position');
    if (data) {
      position = data;
    }

    const pos = element.getBoundingClientRect();
    const dom = this.createPopper();
    this.tip = dom;

    const posEle = {
      width: dom.offsetWidth,
      height: dom.offsetHeight
    };

    if (position === 'bottom') {
      dom.style.left = (pos.left + window.scrollX) - (posEle.width - pos.width) + 'px';
      dom.style.top = pos.top + window.scrollY + pos.height + 'px';
    }

    this.events();
  }

  hide() {
    this.destroy();
  }

  createPopper() {
    const { className, content } = this.settings;
    const dom = Util.createElement('div', { className: `${className}` }, content);
    return document.body.appendChild(dom);
  }

  destroy() {
    this.tip.remove();
  }

  events() {
    const { close } = this.settings;

    Util.on(this.tip, 'click', '[data-popper-close]', () => {
      if (close) {
        close();
      }  
      this.destroy();
    });
  }
}

export default Popper;
