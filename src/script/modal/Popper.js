import u from '../base/util.js';
import Position from './Position.js';

let poppers = [];

class Popper extends Position {
  /**
   * @param {HTMLElement} element 
   * @param {object=} options 
   */
  constructor(element, options) {
    const defaultSettings = {
      className: 'ui-popper',
      position: 'center bottom',
      content: '',
      gap: 4,
      zIndex: null
    };

    const settings = Object.assign({}, defaultSettings, options);

    super(settings);

    this.init(element);
  }

  /**
   * @param {HTMLElement} element 
   */
  init(element) {
    if (!element) return;

    const { zIndex } = this.settings;

    let data = element.getAttribute('data-position');
    
    if (data) {
      this.settings.position = data;
    }

    Popper.hideOthers();
    
    const dom = this.createPopper();

    this.setPosition(dom, element);

    if (zIndex) {
      dom.style.zIndex = zIndex;
    }
    
    this.popper = dom;
    poppers.push(this);
    this.events();
  }

  static hideOthers() {
    poppers.forEach(item => {
      item.destroy();
    });

    poppers = [];
  }

  createPopper() {
    const { className, content } = this.settings;
    const dom = u.createElement('div', { className: `${className}` }, content);
    return document.body.appendChild(dom);
  }

  destroy() {
    if (!this.popper) return;
    this.popper.parentNode.removeChild(this.popper);
    this.popper = null;
  }

  events() {
    const self = this;

    this.popper.addEventListener('click', function (e) {
      // @ts-ignore
      if (e.target.hasAttribute('data-popper-close')) {
        self.destroy();
      }
    });
  }
}

document.addEventListener('click', (e) => {
  // @ts-ignore
  if (e.target.closest('.ui-popper')) return;

  poppers.forEach(item => {
    item.destroy();
  });

  poppers = [];
}, false);

window.addEventListener('resize', function () {
  if (poppers.length) {
    poppers.forEach(item => {
      item.destroy();
    });
  
    poppers = [];
  }
}, false);

export default Popper;
