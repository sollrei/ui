import Util from '../base/util.es6';

class Layer {
  constructor(settings) {
    const defaults = {
      layer: null,
      title: null,
      type: null, // alert, confirm

      confirmType: 'warn', // warn success

      close: '[data-layer-close]',

      showClass: 'layer-visible',
      width: 640,

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
    const { width } = this.settings;
    const closeIcon = '<span class="layer-close iconfont icon-times" data-layer-close></span>';
    let htmlString = `<div class="layer-box" style="width: ${width}px">${closeIcon} 
      <div class="layer-head"></div>
      <div class="layer-content"></div>
    </div>`;
    const div = Util.createElement('div', { className: 'ui-layer' }, htmlString);

    return document.body.appendChild(div);
  }

  setContent(str) {
    this.layerContent.innerHTML = str;
  }

  setTitle(str) {
    this.layerHead.innerHTML = `<div class="layer-title">${str}</div>`;
  }

  show(option) {
    const layer = this.layer;
    const { showClass, onOpen } = this.settings;
    const { content, title } = option;
    this.setContent(content);
    this.setTitle(title);
    Util.addClass(document.querySelector('html'), 'layer-open');
    Util.addClass(layer, showClass);
    if (onOpen) {
      onOpen(this);
    }
  }

  hide() {
    const { onClose, showClass } = this.settings;

    if (onClose) {
      onClose(this);
    }
    
    Util.removeClass(this.layer, showClass);
    if (!document.querySelector('.' + showClass)) {
      Util.removeClass(document.querySelector('html'), 'layer-open');
    }
  }

  events() {
    Util.on(this.layer, 'click', '[data-layer-close]', () => {
      this.hide();
    });
  }
}

export default Layer;
