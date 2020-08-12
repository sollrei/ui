import u from '../base/util.js';

class Layer {
  /**
   * @param {object=} settings
   */
  constructor(settings) {
    const defaults = {
      layer: null,
      title: null,
      type: null, 

      confirmType: 'warn', // warn success

      close: '[data-layer-close]',

      layerClass: 'ui-layer',
      showClass: 'layer-visible',
      width: 640,

      position: 'right',

      onOpen: null,
      onClose: null
    };

    this.settings = Object.assign({}, defaults, settings);

    this.init();
    this.events();
  }

  init() {
    let layer = this.settings.layer;

    if (!layer) {
      layer = this.createLayer();
    }

    this.layer = layer;
    this.layerHead = layer.querySelector('.layer-head');
    this.layerContent = layer.querySelector('.layer-content');
  }

  createLayer() {
    const { width, layerClass, position } = this.settings;
    let _width = width;

    if (typeof width === 'number') {
      _width = width + 'px';
    }

    const closeIcon = '<span class="layer-close iconfont icon-times" data-layer-close></span>';
    let htmlString = `<div class="layer-box layer-${position}" style="width: ${_width}">${closeIcon} 
      <div class="layer-head"></div>
      <div class="layer-content"></div>
    </div>`;
    const div = u.createElement('div', { className: layerClass }, htmlString);

    return document.body.appendChild(div);
  }

  /**
   * @param {string} str - content
   */
  setContent(str) {
    this.layerContent.innerHTML = str;
  }

  /**
   * @param {string} str - title
   */
  setTitle(str) {
    this.layerHead.innerHTML = `<div class="layer-title">${str}</div>`;
  }

  show(option) {
    const layer = this.layer;
    const { showClass, onOpen } = this.settings;
    const { content, title } = option;
    this.setContent(content);
    this.setTitle(title);
    u.addClass(document.querySelector('html'), 'layer-open');
    u.addClass(layer, showClass);
    if (onOpen) {
      onOpen(this);
    }
  }

  hide() {
    const { onClose, showClass } = this.settings;

    if (onClose) {
      onClose(this);
    }
    
    u.removeClass(this.layer, showClass);
    if (!document.querySelector('.' + showClass)) {
      u.removeClass(document.querySelector('html'), 'layer-open');
    }
  }

  events() {
    u.on(this.layer, 'click', '[data-layer-close]', () => {
      this.hide();
    });
  }
}

export default Layer;
