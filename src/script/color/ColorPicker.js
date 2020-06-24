let tinyColor;
import u from '../base/util';
import Position from '../modal/Position';

class ColorPicker extends Position {
  /**
   * @param {string|HTMLElement} trigger
   * @param {object=} options
   */
  constructor(trigger, options) {
    // @ts-ignore
    tinyColor = window.tinycolor;

    const defaultSettings = {
      swatches: [
        '#000000', '#595959', '#BFBFBF', '#f5f5f5', '#F5242D', '#FA541C', '#FA8C17', '#FADB13', 
        '#52C41A', '#13C2C2', '#1790FF', '#2F54EB', '#722ED1', '#EB2F96', '#2A86C5', '#2E5089'],
      onChange: null,
      gap: 0,
      position: 'right bottom'
    };
  
    const settings = Object.assign({}, defaultSettings, options);

    super(settings);
  
    this.settings = settings;

    if (tinyColor) {
      this.init(trigger);
    }
  }

  static createDom() {
    const div = document.createElement('div');
    div.className = 'ui-color-picker';
  
    div.innerHTML = `<div class="color-picker-panel">
      <div class="spectrum-map">
        <a href="javascript:;" class="spectrum-cursor color-cursor"></a>
        <canvas class="spectrum-canvas"></canvas>
      </div>
      <div class="panel-row panel-color-row">
        <div class="panel-color"></div>
        <div class="panel-bar">
          <div class="hue-map">
            <a href="javascript:;" class="hue-cursor color-cursor"></a>
            <canvas class="hue-canvas"></canvas>
          </div>
          <div class="panel-input">
          <label>#</label>
          <input type="text" class="hex field-input" maxlength="6"/>
          <button class="field-button color-confirm">确定</button>
        </div>
        </div>
      </div>
      <div class="panel-row">
        <div class="swatches-title">预制</div>
        <div class="swatches default-swatches"></div>
      </div>
    </div>`;
  
    return div;
  }

  /**
   * @param {number} hue
   * @returns {string} color hue
   */
  static colorToHue(hue) {
    return tinyColor('hsl ' + hue + ' 1 .5').toHslString();
  }

  /**
   * @param {*} trigger
   */
  init(trigger) {
    let element = trigger;

    if (typeof trigger === 'string') {
      /** @type {HTMLElement} */
      element = document.querySelector(trigger);
    }

    this.input = element;

    const dom = ColorPicker.createDom();
    const panel = document.body.appendChild(dom);
    this.panel = panel;

    this.cacheVariable();
  }
  
  cacheVariable() {
    const { panel } = this;

    /** @type {HTMLCanvasElement} */
    this.spectrumCanvas = panel.querySelector('.spectrum-canvas');
    /** @type {HTMLElement} */
    this.spectrumCursor = panel.querySelector('.spectrum-cursor');
    this.spectrumCtx = this.spectrumCanvas.getContext('2d');

    /** @type {HTMLCanvasElement} */
    this.hueCanvas = panel.querySelector('.hue-canvas');
    /** @type {HTMLElement} */
    this.hueCursor = panel.querySelector('.hue-cursor');
    this.hueCtx = this.hueCanvas.getContext('2d');

    /** @type {HTMLElement} */
    this.panelColor = panel.querySelector('.panel-color');
    /** @type {HTMLInputElement} */
    this.hex = panel.querySelector('.hex');

    this.spectrumRect = null;
    this.hueRect = null;

    this.currentColor = '';

    // hsl
    this.hue = 0;
    this.saturation = 1;
    this.lightness = 0.5;

    this.initSwatch();
    this.initHueSpectrum();
    this.createShadeSpectrum();
    this.events();
  }
  
  initSwatch() {
    const { settings, panel } = this;
    const swatchesWrap = panel.querySelector('.default-swatches');
    const self = this;

    settings.swatches.forEach(color => {
      const swatch = document.createElement('button');
      
      swatch.className = 'swatch';
      swatch.style.backgroundColor = color;
  
      swatch.addEventListener('click', function () {
        self.changeColor(this.style.backgroundColor);
      });

      swatchesWrap.appendChild(swatch);
    });
  }
  
  initHueSpectrum() {
    const self = this;
    const { hueCanvas: canvas, hueCtx: ctx } = self;
    const { height, width } = canvas;
    const hueGradient = ctx.createLinearGradient(width, 0, 0, 0);
    
    hueGradient.addColorStop(0.00, 'hsl(0,100%,50%)');
    hueGradient.addColorStop(0.17, 'hsl(298.8, 100%, 50%)');
    hueGradient.addColorStop(0.33, 'hsl(241.2, 100%, 50%)');
    hueGradient.addColorStop(0.50, 'hsl(180, 100%, 50%)');
    hueGradient.addColorStop(0.67, 'hsl(118.8, 100%, 50%)');
    hueGradient.addColorStop(0.83, 'hsl(61.2,100%,50%)');
    hueGradient.addColorStop(1.00, 'hsl(360,100%,50%)');

    ctx.fillStyle = hueGradient;
    ctx.fillRect(0, 0, width, height);
  
    canvas.addEventListener('mousedown', function (e) {
      self.startGetHueColor(e);
    });
  }
  
  /**
   * @param {string} _color 
   */
  changeColor(_color) {
    const color = tinyColor(_color); 

    this.colorToPos(color);
    this.setColorValues(color);
  }
  
  refreshElementRects() {
    this.spectrumRect = this.spectrumCanvas.getBoundingClientRect();
    this.hueRect = this.hueCanvas.getBoundingClientRect();
  }
  
  /**
   * @param {string} _color 
   */
  setColorValues(_color) {  
    const color = tinyColor(_color);
    const hexValue = color.toHex();
  
    this.hex.value = hexValue;
  }
  
  /**
   * @param {string} _color 
   */
  colorToPos(_color) {
    const { hueRect } = this;
    const { width, height } = this.spectrumRect;
    const color = tinyColor(_color);
    const hsv = color.toHsv();
    const hsl = color.toHsl();
    const x = width * hsv.s;
    const y = height * (1 - hsv.v);
    const hue = hsv.h;
    const hueX = (hue / 360) * hueRect.width;

    this.hue = hue;
    this.lightness = hsl.l;
    this.saturation = hsl.s;

    this.updateSpectrumCursor(x, y);
    this.updateHueCursor(hueX);

    this.setCurrentColor(color);
    this.createShadeSpectrum(ColorPicker.colorToHue(hue));   
  }
  
  /**
   * @param {number} x 
   * @param {number} y 
   */
  updateSpectrumCursor(x, y) {
    const { style } = this.spectrumCursor;
    style.left = x + 'px';
    style.top = y + 'px';  
  }
  
  /**
   * @param {number} x 
   */
  updateHueCursor(x) {
    this.hueCursor.style.left = x + 'px';
  }
  
  /**
   * @param {object|string} _color 
   */
  setCurrentColor(_color) {
    const color = tinyColor(_color);
    this.currentColor = color;
    this.spectrumCursor.style.backgroundColor = color; 
    this.panelColor.style.backgroundColor = color;
  }

  /**
   * @param {*=} _color 
   */
  createShadeSpectrum(_color) {
    const { spectrumCanvas: canvas, spectrumCtx: ctx } = this;
    const { height, width } = canvas;
    let color = _color;

    ctx.clearRect(0, 0, width, height);
    
    if (!color) color = '#f00';

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
    whiteGradient.addColorStop(0, '#fff');
    whiteGradient.addColorStop(1, 'rgba(255,255,255,0)');
  
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, width, height);
    
    const blackGradient = ctx.createLinearGradient(0, 0, 0, height);
    blackGradient.addColorStop(0, 'rgba(0,0,0,0)');
    blackGradient.addColorStop(1, '#000');
  
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  startGetSpectrumColor(e) {
    this.getSpectrumColor(e);
    u.addClass(this.spectrumCursor, 'dragging');
    this.isDrag = true;
  }
  
  endGetSpectrumColor() {
    u.removeClass(this.spectrumCursor, 'dragging');
    this.isDrag = false;
  }
  
  startGetHueColor(e) {
    this.getHueColor(e);
    u.addClass(this.hueCursor, 'dragging');
    this.hueDrag = true;
  }
  
  endGetHueColor() {
    u.removeClass(this.hueCursor, 'dragging');
    this.hueDrag = false;
  }
  
  /**
   * @param {MouseEvent} e 
   */
  getHueColor(e) {
    if (!this.hueDrag) return;

    e.preventDefault();
    
    const { saturation, lightness } = this;
    const { left, width } = this.hueRect;
    const x = ColorPicker.limitRange(0, width, e.clientX - left);
  
    const percent = x / width;
    const hue = 360 * percent;

    this.hue = hue;
  
    const hueColor = ColorPicker.colorToHue(hue);
    const color = tinyColor(`hsl ${hue} ${saturation} ${lightness}`).toHslString();
  
    this.createShadeSpectrum(hueColor);
    this.updateHueCursor(x);
    
    this.setCurrentColor(color);
    this.setColorValues(color);
  }

  /**
   * @param {number} min 
   * @param {number} max 
   * @param {number} value 
   * @returns {number} new value
   */
  static limitRange(min, max, value) {
    if (value < min) {
      return min;
    }

    if (value > max) {
      return max;
    }

    return value;
  }
  
  /**
   * @param {*} e 
   * @param {string=} type 
   */
  getSpectrumColor(e, type) {
    if (!this.isDrag && !type) return;

    e.preventDefault();

    const { width, height, left, top } = this.spectrumRect;

    let x = e.clientX - left;
    let y = e.clientY - top;

    x = ColorPicker.limitRange(0, width, x);
    y = ColorPicker.limitRange(0.1, height, y);

    const hsvValue = 1 - (y / height);
    const hsvSaturation = x / width;
    const color = tinyColor(`hsv ${this.hue} ${hsvSaturation} ${hsvValue}`);
    const rgbColor = color.toRgbString();
    const hslColor = color.toHsl();

    this.lightness = hslColor.l;
    this.saturation = hslColor.s;

    this.setCurrentColor(rgbColor);  
    this.setColorValues(rgbColor);
    this.updateSpectrumCursor(x, y);
  }
  
  /**
   * @param {HTMLElement|HTMLInputElement} ele 
   */
  show(ele) {
    const { panel } = this;
    let color = '';

    if (ele.getAttribute('value')) {
      color = ele.getAttribute('value');
    }

    if (ele.getAttribute('data-color')) {
      color = ele.getAttribute('data-color');
    }

    this.setPosition(panel, ele);

    this.refreshElementRects();
    
    if (color) {
      this.changeColor(color);
    }

    u.addClass(this.panel, 'show');
  }
  
  hide() {
    u.removeClass(this.panel, 'show');
  }
  
  confirm() {
    const { onChange } = this.settings;
    const color = this.currentColor;
    const hex = color.toHex();

    if (onChange && typeof onChange === 'function') {
      onChange(hex);
    }

    this.hide();
  }
  
  events() {
    const self = this;
    const { hex, input, spectrumCanvas, panel } = self;

    hex.addEventListener('change', function () {
      self.colorToPos(this.value);
    });

    window.addEventListener('resize', function () {
      self.refreshElementRects();
    });

    window.addEventListener('scroll', function () {
      self.refreshElementRects();
    });

    window.addEventListener('mousemove', this.getSpectrumColor.bind(this));
    window.addEventListener('mouseup', this.endGetSpectrumColor.bind(this));

    window.addEventListener('mousemove', this.getHueColor.bind(this));
    window.addEventListener('mouseup', this.endGetHueColor.bind(this));

    spectrumCanvas.addEventListener('click', function (e) {
      self.getSpectrumColor(e, 'click');
    });

    spectrumCanvas.addEventListener('mousedown', function (e) {
      self.startGetSpectrumColor(e);
    });

    if (input) {
      input.addEventListener('click', function (e) {
        e.stopPropagation();
        self.show(this);
      });
    }

    panel.querySelector('.color-confirm').addEventListener('click', function () {
      self.confirm();
    });

    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    window.addEventListener('click', function () {
      self.hide();
    });
  }
}


export default ColorPicker;
