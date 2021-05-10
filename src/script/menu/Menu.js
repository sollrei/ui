import u from '../base/util.js';

class Menu {
  constructor(selector, options) {
    const defaultSettings = {
      data: [],
      position: 'right'
    };

    const settings = Object.assign({}, defaultSettings, options);
    this.settings = settings;
    this.init(selector);
  }

  init(selector) {
    let ele = selector;

    if (typeof ele === 'string') {
      ele = document.querySelector(selector);
    } 

    if (!ele) return;

    this.anchor = ele;
    this.isShow = false;
    this.hideTimer = null;
    this.showTimer = null;

    this.events();
  }

  createSvgElement() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const anchorRect = this.anchor.getBoundingClientRect();
    const anchor = {
      x: 0,
      y: 0,
      width: anchorRect.width,
      height: anchorRect.height
    };
    const drop = this.menu.querySelector('ul').getBoundingClientRect();
    const menu = {
      x: anchor.width,
      y: 0,
      width: drop.width,
      height: drop.height
    };

    svg.setAttribute('width', anchor.width);
    svg.setAttribute('height', menu.height);

    svg.setAttribute('style', `width: ${anchor.width}px;height: ${menu.height}px;left: -${anchor.width}px`);

    svg.innerHTML = `<path fill="rgba(235,235,235,0)" d="M ${anchor.x} ${anchor.y}
    Q ${menu.x} ${anchor.y}, ${menu.x} ${menu.y}
    v ${menu.height}
    Q ${menu.x} ${anchor.y + anchor.height}, ${anchor.x} ${anchor.y + anchor.height}
    h ${anchor.width}
    v -${anchor.width}
    z"/>`;

    return svg;
  }

  static createMenuItem(data) {
    let { title, icon, href } = data;
    let iconString = `<i class="iconfont icon-${icon}"></i>`;
    let titleString = title;

    if (href) {
      return `<li class="menu-item"><a href="${href}">${iconString}${titleString}</a></li>`;
    }

    return `<li class="menu-item">${iconString}${titleString}</li>`;
  }

  createMenu(option) {
    const { data } = this.settings;

    const div = document.createElement('div');
    div.className = 'ui-anchor-menu';

    if (Array.isArray(data) && data.length) {
      const li = data.reduce((pre, cur) => { 
        return pre + Menu.createMenuItem(cur);
      }, '');
      div.innerHTML = `<ul class="ui-menu">${li}</ul>`;
    }

    div.style.left = option.left + option.width + 'px';
    div.style.top = option.top + 'px';

    this.menu = document.body.appendChild(div);
    this.svg = this.menu.appendChild(this.createSvgElement());
    this.isShow = true;

    this.menuEvents();
  }

  show(button) {
    const { width, height, left, top } = button.getBoundingClientRect();
    const scrollY = u.getPageScrollTop();
    const scrollX = u.getPageScrollLeft();

    this.createMenu({
      left: left + scrollX,
      top: top + scrollY,
      width,
      height
    });
  }

  hide() {
    if (this.menu) {
      this.menu.remove();
    }
  }

  menuHandler() {
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      this.menu.removeEventListener('mouseleave', this.menuHandler);
      this.menu.removeEventListener('mouseenter', this.menuEnterHandler);

      this.menu.remove();
      this.isShow = false;
    }, 200);
  }

  menuEnterHandler() {
    clearTimeout(this.hideTimer);
  }

  menuEvents() {
    const menu = this.menu;
    menu.addEventListener('mouseleave', this.menuHandler);
    menu.addEventListener('mouseenter', this.menuEnterHandler);
  }

  events() {
    const self = this;
    const { anchor } = this;

    this.menuHandler = this.menuHandler.bind(this);
    this.menuEnterHandler = this.menuEnterHandler.bind(this);

    anchor.addEventListener('mouseenter', function () {
      clearTimeout(self.hideTimer);
      if (!self.isShow) {
        self.show(this);
      }
    });

    anchor.addEventListener('mouseleave', function () {
      self.menuHandler();
    });
  }
}

export default Menu;
