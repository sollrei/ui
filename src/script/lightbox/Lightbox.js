import u from '../base/util.js';

class Lightbox {
  constructor(selector, options) {
    const defaultSettings = {
      selector: '.lightbox'
    };

    this.settings = Object.assign({}, defaultSettings, options);

    const wrapper = document.querySelector(selector);
    this.init(wrapper);
  }

  init(element) {
    this.wrapper = element;

    const dom = Lightbox.createTemplate();
    const eleString = u.createElement('div', { className: 'ui-lightbox' }, dom);
    const box = document.body.appendChild(eleString);

    this.box = box;
    this.img = box.querySelector('.lb-img');
    this.prev = box.querySelector('.lb-prev');
    this.next = box.querySelector('.lb-next');

    this.bindEvent();
  }

  static createTemplate() {
    const tmp = `<div class="lb-close">&times;</div>
      <div class="lb-main">
        <img src="" alt="" class="lb-img">
        <a href="javascript:;" class="lb-prev"><i class="iconfont icon-arrow-left"></i></a>
        <a href="javascript:;" class="lb-next"><i class="iconfont icon-arrow-right"></i></a>
      </div>`;
    return tmp;
  }

  changeImage(arg) {
    let src;

    if (typeof arg === 'number') {
      src = this.imageArray[arg];
    }

    if (typeof arg === 'string') {
      src = arg;
    }

    if (src) {
      this.img.setAttribute('src', '');
      this.img.setAttribute('src', src);
    }
  }

  showBox(ele) {
    const src = ele.getAttribute('data-src');

    this.changeImage(src);
    this.box.classList.add('show');

    this.initGroup(ele);
  }

  initGroup(ele) {
    const { selector } = this.settings;
    const { wrapper } = this;
    const elements = wrapper.querySelectorAll(selector);

    const imageArray = [].slice.call(elements).map(item => {
      return item.getAttribute('data-src');
    });

    this.currentIndex = [].indexOf.call(elements, ele);
    this.imageArray = imageArray;
    this.max = imageArray.length;

    this.toggleNav();
  }

  toggleNav() {
    if (this.currentIndex >= this.max - 1) {
      this.next.classList.add('hide');
    } else {
      this.next.classList.remove('hide');
    }

    if (this.currentIndex === 0) {
      this.prev.classList.add('hide');
    } else {
      this.prev.classList.remove('hide');
    }
  }

  hideBox() {
    this.box.classList.remove('show');
  }

  showPrev() {
    this.currentIndex -= 1;
    this.changeImage(this.currentIndex);
    this.toggleNav();
  }

  showNext() {
    this.currentIndex += 1;
    this.changeImage(this.currentIndex);
    this.toggleNav();
  }

  bindEvent() {
    const { selector } = this.settings;
    const self = this;

    u.on(this.wrapper, 'click', selector, function () {
      self.showBox(this);
    });

    u.on(this.box, 'click', '.lb-close', function () {
      self.hideBox();
    });

    u.on(this.box, 'click', '.lb-prev', function () {
      self.showPrev();
    });

    u.on(this.box, 'click', '.lb-next', function () {
      self.showNext();
    });
  }
}

export default Lightbox;
