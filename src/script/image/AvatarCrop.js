/**
 * @author zhangdan
 *
 * 缺：
 * destroy 或者弹窗修改content设置
 * */

const _ = require('common/lodash:core');

const doc = document;

class Crop {
  constructor(selector, options) {
    const defaultSetting = {
      offsetLeft: 50,
      offsetTop: 50,
      imageHeight: 200,
      imageWidth: 200,
      onSave: null,
      imgClass: '.img',
      smallButtonClass: '.img-small',
      bigButtonClass: '.img-big',
      saveButtonClass: '.img-save',
      layerClass: '.layer'
    };

    this.settings = Object.assign({}, defaultSetting, options);
    const box = doc.querySelector(selector);
    if (!box) return;

    const {
      imgClass,
      layerClass,
      smallButtonClass,
      bigButtonClass,
      saveButtonClass
    } = this.settings;

    this.image = box.querySelector(imgClass);
    this.layer = box.querySelector(layerClass);
    this.smallButton = box.querySelector(smallButtonClass);
    this.bigButton = box.querySelector(bigButtonClass);
    this.saveButton = box.querySelector(saveButtonClass);

    this.rate = 1;

    this.init();
  }

  init() {
    const src = this.image.src;
    const img = new Image();
    img.src = src;
    img.addEventListener('load', () => {
      this.image.setAttribute('crossOrigin', 'Anonymous');
      this.initImageSize();
      this.setFinalPosition();
      this.events();
    });
    this.createCanvas();
    this.moving = this.moving.bind(this);
    this.stopMove = this.stopMove.bind(this);
  }

  /**
   * @method
   * reset image height and width
   * center it in container
   * */
  initImageSize() {
    const img = this.image;
    const { height, width } = img;
    const { imageHeight, imageWidth, offsetLeft, offsetTop } = this.settings;

    if ((height > imageHeight) && (width > imageWidth)) {
      if (height >= width) {
        this.setWidth(height, width);
      } else {
        this.setHeight(height, width);
      }
    }
    if ((height < imageHeight) || (width < imageWidth)) {
      if (height >= width) {
        this.setWidth(height, width);
      } else {
        this.setHeight(height, width);
      }
    }
    this.setNewPosition(
      ((imageWidth / 2) + offsetLeft) - (img.width / 2),
      ((imageHeight / 2) + offsetTop) - (img.height / 2));

    this.initHeight = img.height;
    this.initWidth = img.width;
  }

  setHeight(height, width) {
    const img = this.image;
    const { imageHeight } = this.settings;

    img.height = imageHeight;
    img.width = (width / height) * imageHeight;
  }

  setWidth(height, width) {
    const img = this.image;
    const { imageWidth } = this.settings;

    img.width = imageWidth;
    img.height = (height / width) * imageWidth;
  }

  /**
   * @method
   * create canvas element
   * */
  createCanvas() {
    const { imageHeight, imageWidth } = this.settings;
    this.canvas = doc.createElement('canvas');
    this.canvas.height = imageHeight;
    this.canvas.width = imageWidth;
  }

  // bind events
  events() {
    const { saveButton, smallButton, bigButton, layer } = this;

    let rate = 1;

    layer.addEventListener('mousedown', e => {
      this.startMove(e);
    });

    doc.addEventListener('mouseup', e => {
      this.stopMove(e);
    });

    saveButton.addEventListener('click', () => {
      this.saveImage();
    });

    smallButton.addEventListener('click', () => {
      rate *= 0.9;
      this.resizing(rate);
    });

    bigButton.addEventListener('click', () => {
      rate *= 1.1;
      this.resizing(rate);
    });
  }

  getStartStatus(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const style = this.image.style;
    const imgLeft = style.left ? parseInt(style.left, 10) : 0;
    const imgTop = style.top ? parseInt(style.top, 10) : 0;

    this.start = {
      x: mouseX,
      y: mouseY,
      imgLeft,
      imgTop
    };
  }

  /**
   * @method
   * save final position left and top
   * */
  setFinalPosition() {
    const { left, top } = this.image.style;
    const x = left ? parseInt(left, 10) : 0;
    const y = top ? parseInt(top, 10) : 0;

    this.result = { x, y };
  }

  startMove(e) {
    e.preventDefault();
    e.stopPropagation();

    this.getStartStatus(e);

    doc.addEventListener('mousemove', this.moving);
  }

  stopMove(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setFinalPosition();

    doc.removeEventListener('mousemove', this.moving);
  }

  /**
   * @method
   * reset image's size and get new position
   *
   * @param {Number} rate
   * */
  resizing(rate) {
    const { height, style } = this.image;
    const { initHeight, initWidth } = this;
    const { x, y } = this.result;
    const { imageHeight, imageWidth, offsetLeft, offsetTop } = this.settings;
    const newHeight = initHeight * rate;
    const newWidth = initWidth * rate;
    const dRate = (rate / height) * initHeight;

    if ((newHeight < imageHeight) || (newWidth < imageWidth)) {
      return;
    }

    // origin center point (x0, y0)
    const x0 = (imageWidth / 2) + offsetLeft;
    const y0 = (imageHeight / 2) + offsetTop;

    // (x0 - oldLeft) * rate = x1 - oldLeft
    // newLeft = oldLeft - (x1 - x0)
    const newLeft = x0 - ((x0 - x) * dRate);
    const newTop = y0 - ((y0 - y) * dRate);

    style.height = newHeight + 'px';
    style.width = newWidth + 'px';

    this.setNewPosition(newLeft, newTop);
    this.setFinalPosition();
  }

  moving(e) {
    const { x, y, imgLeft, imgTop } = this.start;

    let left = (e.clientX - x) + imgLeft;
    let top = (e.clientY - y) + imgTop;

    this.setNewPosition(left, top);
  }

  /**
   * @method
   * reset image's position
   *
   * @param {Number} left
   * @param {Number} top
   * */
  setNewPosition(left, top) {
    const { offsetLeft, offsetTop, imageHeight, imageWidth } = this.settings;
    const { height, width, style } = this.image;
    const minY = -(height - offsetTop - imageHeight);
    const minX = -(width - offsetLeft - imageWidth);

    let newLeft = left;
    let newTop = top;

    if (newLeft > offsetLeft) {
      newLeft = offsetLeft;
    }

    if (newLeft < minX) {
      newLeft = minX;
    }

    if (newTop > offsetTop) {
      newTop = offsetTop;
    }

    if (newTop < minY) {
      newTop = minY;
    }

    style.left = newLeft + 'px';
    style.top = newTop + 'px';
  }

  /**
   * @method
   * use canvas to get new image's
   * */
  saveImage() {
    const { canvas, image, result, settings } = this;
    const { offsetLeft, offsetTop, onSave } = settings;
    const { x, y } = result;

    canvas.getContext('2d')
      .drawImage(image, x - offsetLeft, y - offsetTop, image.width, image.height);

    const url = canvas.toDataURL('image/png');

    if (onSave && _.isFunction(onSave)) {
      onSave(url);
    }
  }
}

module.exports = Crop;
