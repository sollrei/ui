import Util from '../base/util.es6';

const doc = document;
const body = doc.body;

class Modal {
  constructor(settings) {
    const defaultSettings = {
      modal: null,
      modalBox: '.modal-box',
      modalContent: '.modal-content',
      modalTitle: '.modal-title',

      title: null,

      type: null, // confirm

      open: '[data-modal-open]',
      close: '[data-modal-close]',

      showClass: 'modal-visible',
      animateClass: 'fadeInDown',

      resize: false,

      clickOutside: true,
      closeKey: 27,

      onOpen: null,
      onClose: null,
      onResize: null,

      onCancel: null,
      onConfirm: null,

      footer: true,
      cancelBtn: '取消',
      confirmBtn: '确定',   

      // button
      btnOkClass: 'ui-button primary',
      btnCancelClass: 'ui-button',
      btnType: '' // '' 'center'
    };

    if (settings && settings.type === 'confirm') {
      defaultSettings.btnOkClass = 'ui-button small primary';
      defaultSettings.btnCancelClass = 'ui-button small';
    }

    this.settings = Object.assign({}, defaultSettings, settings);

    this.isShow = false;
    this.current = null;

    this.init();
  }

  /**
   * @method
   * create modal element
   *
   * @returns {Node}
   * */
  createModalHtml(type) {
    const closeIcon = '<span class="modal-close iconfont icon-times" data-modal-close></span>';
    let str = '';
    let className = 'ui-modal';

    switch (type) {
      case 'confirm':
        str = this.getConfirmTypeHtml();
        className = 'ui-modal-confirm';
        break;
      default:
        str = this.getModalTypeHtml(closeIcon);
        break;
    }

    const div = Util.createElement('div', { className }, str);

    return body.appendChild(div);
  }

  createModalFooter() {
    const { cancelBtn, footer, confirmBtn, btnOkClass, btnCancelClass, onCancel } = this.settings;

    let confirmButton = '';
    let cancelButton = '';
    let foot = '';

    if (!footer) {
      return foot;
    }

    if (confirmBtn) {
      confirmButton = `<button class="${btnOkClass} modal-ok">${confirmBtn}</button>`;
    }

    if (cancelBtn) {
      if (onCancel) {
        cancelButton = `<button class="${btnCancelClass} modal-cancel">${cancelBtn}</button>`;
      } else {
        cancelButton = `<button class="${btnCancelClass} modal-cancel" data-modal-close>${cancelBtn}</button>`;
      }
    }

    if (confirmBtn || cancelBtn) {
      foot = `<div class="modal-footer">${confirmButton}${cancelButton}</div>`;
    }

    return foot;
  }

  getModalTypeHtml(closeIcon) {
    const { resize } = this.settings;
    const resizeClass = resize ? ' resizable' : '';
    const resizeTrigger = resize ? '<span class="resize-trigger"></span>' : '';
    const foot = this.createModalFooter();

    return `<div class="modal-box${resizeClass}">${closeIcon}`
            + '<div class="modal-title"></div><div class="modal-content"></div>'
            + `${foot}${resizeTrigger}</div>`;
  }

  getConfirmTypeHtml() {
    const foot = this.createModalFooter();

    return '<div class="ui-confirm modal-box">'
      + '<div class="modal-content"></div>'
      + foot
      + '</div>';
  }

  /**
   * @method
   * @param {Object} option
   * @returns {String} confirm html
   * */
  static createConfirmHtml(option) {
    const { content, desc } = option;
    const titHtml = content ? `<div class="warn">${content}</div>` : '';
    const descHtml = desc ? `<p class="desc">${desc}</p>` : '';

    return `${titHtml}${descHtml}`;
  }

  init() {
    let modal = this.settings.modal;
    const {
      modalBox,
      modalContent,
      modalTitle,
      type
    } = this.settings;

    if (!modal) {
      modal = this.createModalHtml(type);
    }

    this.modal = modal;
    this.modalBox = modal.querySelector(modalBox);
    this.modalTitle = modal.querySelector(modalTitle);
    this.modalContent = modal.querySelector(modalContent);

    this.modalOk = modal.querySelector('.modal-ok');
    this.modalCancel = modal.querySelector('.modal-cancel');

    this.events();
  }

  /**
   * @method
   * set modal content
   *
   * @param {String} content
   * */
  setContent(content) {
    this.modalContent.innerHTML = content;
  }

  /**
   * @method
   * set modal title
   *
   * @param {String} title
   * */
  setTitle(title) {
    if (!title) return;
    this.modalTitle.innerHTML = `<div class="modal-head">${title}</div>`;
  }

  /**
   * @method
   * display modal
   *
   * @param {Object} options
   * */
  show(options) {
    const { content, title } = options;

    this.setContent(content);
    this.setTitle(title);

    this.toggleShowHide('show');
    Util.addClass(document.querySelector('html'), 'modal-open');
  }

  confirm(option, getData = null) {
    const content = Modal.createConfirmHtml(option);
    this.getData = getData;
    this.setContent(content);

    this.toggleShowHide('show');
  }

  /**
   * @method
   * hide modal
   * */
  hide() {
    this.toggleShowHide('hide');
    this.modalContent.innerHTML = '';
    if (this.modalTitle) {
      this.modalTitle.innerHTML = '';
    }

    Util.removeClass(document.querySelector('html'), 'modal-open');
  }

  /**
   * @param {'show'|'hide'} type
   * */
  toggleShowHide(type) {
    const modal = this.modal;
    const modalBox = this.modalBox;
    const { showClass, animateClass, onOpen, onClose } = this.settings;

    if (type === 'show') {
      Util.addClass(modal, showClass);
      Util.addClass(modalBox, animateClass);

      this.isShow = true;
      if (typeof onOpen === 'function') {
        onOpen(this);
      }
    }

    if (type === 'hide') {
      this.isShow = false;
      if (typeof onClose === 'function') {
        onClose(this);
      }

      Util.removeClass(modal, showClass);
      Util.removeClass(modalBox, animateClass);
    }
  }

  events() {
    const self = this;
    const { clickOutside, closeKey, resize, onCancel, onConfirm } = this.settings;
    const { modalOk, modalCancel } = this;

    Util.on(this.modal, 'click', '[data-modal-close]', () => {
      this.hide();
    });

    if (modalOk && onConfirm) {
      modalOk.addEventListener('click', function (e) {
        onConfirm(e, self, self.getData);
      });
    }

    if (modalCancel && onCancel) {
      modalCancel.addEventListener('click', function (e) {
        onCancel(e, self, self.getData);
      });
    }

    if (clickOutside) {
      body.addEventListener('keydown', (e) => {
        if (e.keyCode === closeKey) {
          this.hide();
        }
      });
    }

    if (resize) {
      this.resizeEvent();
    }
  }

  // resize modal
  resizeEvent() {
    const modalBox = this.modalBox;
    const docEle = document.documentElement;
    const { onResize } = this.settings;
    const { height: minHeight, width: minWidth } = modalBox.getBoundingClientRect();

    let startX;
    let startY;
    let startWidth;
    let startHeight;
    let maxWidth;
    let maxHeight;

    const resizeTrigger = modalBox.querySelector('.resize-trigger');

    function doDrag(e) {
      let width = startWidth + ((e.clientX - startX) * 2);
      let height = startHeight + ((e.clientY - startY) * 2);

      if (width > maxWidth) {
        width = maxWidth;
      }

      if (height > maxHeight) {
        height = maxHeight;
      }

      modalBox.style.width = width + 'px';
      modalBox.style.height = height + 'px';

      if (typeof onResize === 'function') {
        onResize(width, height);
      }
    }

    function stopDrag() {
      docEle.removeEventListener('mousemove', doDrag, false);
      docEle.removeEventListener('mouseup', stopDrag, false);
    }

    resizeTrigger.addEventListener('mousedown', function (e) {
      e.preventDefault();
      e.stopPropagation();

      startX = e.clientX;
      startY = e.clientY;

      maxWidth = docEle.clientWidth * 0.95;
      maxHeight = docEle.clientHeight * 0.98;

      startWidth = modalBox.getBoundingClientRect().width;
      startHeight = modalBox.getBoundingClientRect().height;

      docEle.addEventListener('mousemove', doDrag, false);
      docEle.addEventListener('mouseup', stopDrag, false);
    }, false);
  }
}

export default Modal;
