import u from '../base/util.es6';

class Tab {
  /**
   * 
   * @param selector {string|Object}
   * @param options {Object=}
   */
  constructor(selector, options) {
    const defaultSettings = {
      navActive: 'active',
      conActive: 'show',
      navSelector: '.tab-itm',
      conSelector: '.tab-content',
      onChange: null
    };

    const settings = Object.assign({}, defaultSettings, options);

    this.settings = settings;

    this.init(selector);
  }

  init(selector) {
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!element) return;

    this.wrapper = element;

    this.createIndex();
    this.events();
  }

  createIndex() {
    const { wrapper } = this;
    const { navSelector, conSelector } = this.settings;
    const nav = wrapper.querySelectorAll(navSelector);
    const content = wrapper.querySelectorAll(conSelector);

    this.navElements = nav;
    this.contentElements = content;

    [].slice.call(nav).forEach((item, index) => {
      item.setAttribute('data-index', index);
    });
  }

  /**
   * @param btn {HTMLElement}
   */
  handleChangeTab(btn) {
    const { navActive, onChange } = this.settings;
    const index = btn.getAttribute('data-index');
    const _index = Number(index);

    if (u.hasClass(btn, navActive)) return;

    if (onChange) {
      onChange(_index, () => {
        this.changeTab(btn, _index);
      });

      return;
    }

    this.changeTab(btn, _index);
  }

  /**
   * @param btn {HTMLElement}
   * @param _index {number}
   */
  changeTab(btn, _index) {
    const { settings, navElements, contentElements } = this;
    const { navActive, conActive } = settings;

    u.addClass(btn, navActive);

    [].slice.call(navElements).forEach((nav, ind) => {
      if (ind !== _index) {
        u.removeClass(nav, navActive);
      }
    });
    
    [].slice.call(contentElements).forEach((item, ind) => {
      if (ind === _index) {
        u.addClass(item, conActive);
      } else {
        u.removeClass(item, conActive);
      }
    });
  }

  events() {
    const self = this;
    const { wrapper, settings } = self;
    const { navSelector } = settings;

    u.on(wrapper, 'click', navSelector, function () {
      self.handleChangeTab(this);
    });
  }
}

export default function (selector, options) {
  if (typeof selector === 'string') {
    const elements = document.querySelectorAll(selector);

    return [].slice.call(elements).map(item => {
      return new Tab(item, options);
    });
  } 

  if (typeof selector === 'object' && selector !== null) {
    if (selector.length) {
      return [].slice.call(selector).map(item => {
        return new Tab(item, options);
      });
    }

    return new Tab(selector, options);
  }

  return null;
}

