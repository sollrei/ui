import u from '../base/util.js';

class Modal {
  /**
   * @param {object=} settings 
   */
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
   * @param {string} type
   * @returns {Node} - ui-modal element
   */
  createModalHtml(type) {
    let str = '';
    let className = 'ui-modal';

    switch (type) {
      case 'confirm':
        str = this.createConfirmTypeHtml();
        className = 'ui-modal-confirm';
        break;
      default:
        str = this.createModalTypeHtml();
        break;
    }

    const div = u.createElement('div', { className }, str);

    return document.body.appendChild(div);
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
      let cancelClass = onCancel ? '' : 'data-modal-close';
      
      cancelButton = `<button class="${btnCancelClass} modal-cancel" ${cancelClass}>${cancelBtn}</button>`;
    }

    if (confirmBtn || cancelBtn) {
      foot = `<div class="modal-footer">${confirmButton}${cancelButton}</div>`;
    }

    return foot;
  }

  /**
   * @returns {string} - normal modal html
   */
  createModalTypeHtml() {
    const { resize } = this.settings;
    const resizeClass = resize ? ' resizable' : '';
    const resizeTrigger = resize ? '<span class="resize-trigger"></span>' : '';
    const foot = this.createModalFooter();

    return `<div class="modal-box${resizeClass}">`
      + '<span class="modal-close iconfont icon-times" data-modal-close></span>'
      + '<div class="modal-title"></div><div class="modal-content"></div>'
      + `${foot}${resizeTrigger}</div>`;
  }

  /**
   * @returns {string} - confirm modal html
   */
  createConfirmTypeHtml() {
    const foot = this.createModalFooter();

    return '<div class="ui-confirm modal-box">'
      + '<div class="modal-content"></div>'
      + foot
      + '</div>';
  }

  /**
   * @param {object} option
   * @returns {string} confirm html
   * */
  static createConfirmHtml(option) {
    const { content, desc } = option;
    const titHtml = content ? `<div class="warn">${content}</div>` : '';
    const descHtml = desc ? `<div class="desc">${desc}</div>` : '';

    return `${titHtml}${descHtml}`;
  }

  /**
   * @param {string} content
   * */
  setContent(content) {
    this.modalContent.innerHTML = content;
  }

  /**
   * @param {string} title
   * */
  setTitle(title) {
    if (!title) return;
    this.modalTitle.innerHTML = `<div class="modal-head">${title}</div>`;
  }

  /**
   * @param {object} options
   * */
  show(options) {
    const { content, title } = options;

    this.setContent(content);
    this.setTitle(title);

    this.toggleShowHide('show');
    u.addClass(document.querySelector('html'), 'modal-open');
  }

  /**
   * @param {object=} option 
   * @param {*} getData 
   */
  confirm(option, getData = null) {
    const content = Modal.createConfirmHtml(option);
    this.getData = getData;
    this.setContent(content);
    this.toggleShowHide('show');
  }

  hide() {
    this.toggleShowHide('hide');
    this.modalContent.innerHTML = '';
    if (this.modalTitle) {
      this.modalTitle.innerHTML = '';
    }

    u.removeClass(document.querySelector('html'), 'modal-open');
  }

  /**
   * @param {'show'|'hide'} type
   * */
  toggleShowHide(type) {
    const modal = this.modal;
    const modalBox = this.modalBox;
    const { showClass, animateClass, onOpen, onClose } = this.settings;

    if (type === 'show') {
      u.addClass(modal, showClass);
      u.addClass(modalBox, animateClass);

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

      u.removeClass(modal, showClass);
      u.removeClass(modalBox, animateClass);
    }
  }

  events() {
    const self = this;
    const { clickOutside, closeKey, resize, onCancel, onConfirm } = this.settings;
    const { modalOk, modalCancel } = this;

    u.on(this.modal, 'click', '[data-modal-close]', () => {
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
      document.body.addEventListener('keydown', (e) => {
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
    // const { height: minHeight, width: minWidth } = modalBox.getBoundingClientRect();

    let startX;
    let startY;
    let startWidth;
    let startHeight;
    let maxWidth;
    let maxHeight;

    const resizeTrigger = modalBox.querySelector('.resize-trigger');

    /**
     * @param {object} e
     */
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

    /**
     *
     */
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
