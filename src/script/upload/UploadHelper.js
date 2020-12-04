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
    const input = wrap.querySelector('.upload-value');

    const self = this;

    u.on(wrap, 'click', '.js-clean', function () {
      u.removeClass(trigger, 'hidden');
      u.addClass(image, 'hidden');
      image.innerHTML = '';
      self.input.value = '';

      if (input) {
        input.value = '';
        input.trigger('focusout');
      }
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
    const input = wrap.querySelector('.upload-value');
    let str = '';

    if (input) {
      input.value = url;
      input.trigger('change');
    } else {
      str = `<input type="hidden" name="${name}" value="${url}">`;
    }

    str += `<img src="${url}">
    <div class="option">
      <a href="javascript:;" class="js-change">替换</a><a href="javascript:;" class="js-clean">清除</a>
    </div>`;
    
    image.innerHTML = str;
    u.removeClass(image, 'hidden');
    u.addClass(trigger, 'hidden');
  }

  static createProgress({ id, file }) {
    const div = document.createElement('div');
    div.id = id;
    div.className = 'file-item mt-12';
    div.innerHTML = `<div class="ui-progress mb-8" style="width: 100%;">
        <div class="bar" style="width: 0;"></div>
      </div>
      <div class="file-name ui-row">
        <i class="iconfont icon-paperclip"></i>${file.name}
        <a href="javascript:;" class="cancel right ft-primary">取消</a>
      </div>`;
    return div;
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
function ep(selector, options) {
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

ep.createProgress = UploadHelper.createProgress;

export default ep;
