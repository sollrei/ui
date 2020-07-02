import u from '../base/util.js';
import Upload from './Upload.js';

class UploadHelper {
  /**
   * @param {*} selector 
   * @param {object} options 
   */
  constructor(selector, options) {
    const defaultSettings = {
      url: ''
    };

    this.settings = Object.assign({}, defaultSettings, options);

    this.init(selector);
  }

  /**
   * @param {*} selector 
   */
  init(selector) {
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!element) return;

    const input = element.querySelector('input[type="file"]');

    if (!input) {
      console.warn('loose input');
      return;
    }

    this.wrap = element;
    this.input = input;

    if (element.hasAttribute('data-drag')) {
      this.dragEvents();
    }

    if (input.hasAttribute('accept')) {
      this.settings.fileType = input.getAttribute('accept').split(',');
    }

    if (u.hasClass(element, 'ui-upload-img')) {
      this.singleUpload();
    }

    this.inputEvent();
  }

  singleUpload() {
    const { wrap } = this;
    const trigger = wrap.querySelector('.trigger');
    const image = wrap.querySelector('.image');
    const self = this;

    u.on(wrap, 'click', '.js-clean', function () {
      u.removeClass(trigger, 'hidden');
      u.addClass(image, 'hidden');
      image.innerHTML = '';
      self.input.value = '';
    });

    u.on(wrap, 'click', '.js-change', function () {
      self.input.click();
    });
  }

  /**
   * @param {string} url 
   * @param {string=} name 
   */
  createSingleDom(url, name = 'file') {
    const { wrap } = this;
    const trigger = wrap.querySelector('.trigger');
    const image = wrap.querySelector('.image');

    image.innerHTML = `<input type="hidden" name="${name}" value="${url}"><img src="${url}" alt="">
    <div class="option">
      <a href="javascript:;" class="js-change">替换</a><a href="javascript:;" class="js-clean">清除</a>
    </div>`;

    u.removeClass(image, 'hidden');
    u.addClass(trigger, 'hidden');
  }

  inputEvent() {
    const { input } = this;
    const self = this;

    input.addEventListener('change', function () {
      self.createUpload(this);
    });
  }

  createUpload(input) {
    const { url } = this.settings;

    new Upload(url, input, this.settings);
  
    // input.value = ''; // eslint-disable-line
  }

  dragEvents() {
    const { wrap } = this;
    const self = this;

    wrap.addEventListener('dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();

      u.addClass(this, 'highlight');
    }, false);

    wrap.addEventListener('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();

      u.removeClass(this, 'highlight');
    }, false);

    wrap.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();

      u.addClass(this, 'highlight');
    }, false);

    wrap.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();

      u.removeClass(this, 'highlight');
      
      const files = e.dataTransfer.files;

      self.createUpload(files);
    }, false);
  }
}

/**
 * @param {*} selector
 * @param {object} options
 * @returns {object} -
 */
export default function (selector, options) {
  const arr = [];
  
  if (typeof selector === 'string') {
    const element = document.querySelectorAll(selector);
    u.forEach(element, item => {
      arr.push(new UploadHelper(item, options));
    });

    if (element.length > 1) {
      return arr;
    }

    return arr[0];
  }
  
  if (typeof selector === 'object') {
    if (selector.length) {
      u.forEach(selector, item => {
        arr.push(new UploadHelper(item, options));
      });
      return arr;
    }
    
    return new UploadHelper(selector, options);
  }

  return null;
}
