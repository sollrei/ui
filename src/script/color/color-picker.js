// classList.add  .remove

// @ts-ignore
const tinycolor = window.tinycolor;

class ColorPicker {
  constructor(input, options) {
    const defaultSettings = {
      swatches: ['#000000', '#595959', '#BFBFBF', '#f5f5f5', '#F5242D', '#FA541C', '#FA8C17', '#FADB13', '#52C41A', '#13C2C2', '#1790FF', '#2F54EB', '#722ED1', '#EB2F96', '#2A86C5', '#2E5089'],
      onChange: null
    };

    const settings = Object.assign({}, defaultSettings, options);

    this.settings = settings;
    this.init(input);
  }

  /**
   * @param {*} input 
   */
  init(input) {
    let element = input;

    if (typeof input === 'string') {
      element = document.querySelector(input);
    }

    if (!element) return;

    this.input = element;

    const dom = ColorPicker.createDom();
    const wrap = document.body;

    document.body.appendChild(dom);

    const panel = wrap.querySelector('.ui-color-picker');
    this.panel = panel;

    this.initColors(panel);
  }

  initColors(panel) {
    this.spectrumCanvas = panel.querySelector('.spectrum-canvas');
    this.spectrumCtx = this.spectrumCanvas.getContext('2d');
    this.spectrumCursor = panel.querySelector('.spectrum-cursor'); 
    this.spectrumRect = this.spectrumCanvas.getBoundingClientRect();

    this.hueCanvas = panel.querySelector('.hue-canvas');
    this.hueCtx = this.hueCanvas.getContext('2d');
    this.hueCursor = panel.querySelector('.hue-cursor'); 
    this.hueRect = this.hueCanvas.getBoundingClientRect();

    this.panelColor = panel.querySelector('.panel-color');

    this.currentColor = '';
    this.hue = 0;
    this.saturation = 1;
    this.lightness = 0.5;

    this.hexField = panel.querySelector('.hex-field');
    this.hex = panel.querySelector('.hex');

    this.createSwatch();
    this.createShadeSpectrum();
    this.createHueSpectrum();

    this.events();
  }

  changeColor(_color) {
    const color = tinycolor(_color); 
    this.colorToPos(color);
    this.setColorValues(color);
  }

  createSwatch() {
    const swatches = this.panel.querySelector('.default-swatches');
    const { settings } = this;
    const self = this;

    settings.swatches.forEach(_color => {
      const swatch = document.createElement('button');
      swatch.className = 'swatch';
      swatch.style.backgroundColor = _color;
  
      swatch.addEventListener('click', function () {
        self.changeColor(this.style.backgroundColor);
      });

      swatches.appendChild(swatch);
      self.refreshElementRects();
    });
  }

  createHueSpectrum() {
    const canvas = this.hueCanvas;
    const ctx = this.hueCtx;
    const self = this;
    const hueGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    
    hueGradient.addColorStop(0.00, 'hsl(0,100%,50%)');
    hueGradient.addColorStop(0.17, 'hsl(298.8, 100%, 50%)');
    hueGradient.addColorStop(0.33, 'hsl(241.2, 100%, 50%)');
    hueGradient.addColorStop(0.50, 'hsl(180, 100%, 50%)');
    hueGradient.addColorStop(0.67, 'hsl(118.8, 100%, 50%)');
    hueGradient.addColorStop(0.83, 'hsl(61.2,100%,50%)');
    hueGradient.addColorStop(1.00, 'hsl(360,100%,50%)');

    ctx.fillStyle = hueGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    canvas.addEventListener('mousedown', function (e) {
      self.startGetHueColor(e);
    });
  }

  refreshElementRects() {
    this.spectrumRect = this.spectrumCanvas.getBoundingClientRect();
    this.hueRect = this.hueCanvas.getBoundingClientRect();
  }
  
  setColorValues(_color) {  
    const color = tinycolor(_color);
    const hexValue = color.toHex();
  
    this.hex.value = hexValue;
  }

  colorToPos(_color) {
    const { hueRect } = this;
    const color = tinycolor(_color);
    const hsl = color.toHsl();
    const hsv = color.toHsv();
    const x = this.spectrumRect.width * hsv.s;
    const y = this.spectrumRect.height * (1 - hsv.v);

    this.hue = hsl.h;

    const hueX = hueRect.width - ((this.hue / 360) * hueRect.width);

    this.updateSpectrumCursor(x, y);
    this.updateHueCursor(hueX);

    this.setCurrentColor(color);
    this.createShadeSpectrum(ColorPicker.colorToHue(color));   
  }

  updateSpectrumCursor(x, y) {
    this.spectrumCursor.style.left = x + 'px';
    this.spectrumCursor.style.top = y + 'px';  
  }

  updateHueCursor(x) {
    this.hueCursor.style.left = x + 'px';
  }

  setCurrentColor(_color) {
    const color = tinycolor(_color);
    this.currentColor = color;
    this.spectrumCursor.style.backgroundColor = color; 
    this.panelColor.style.backgroundColor = color;
  }

  static colorToHue(_color) {
    const color = tinycolor(_color);
    const hueString = tinycolor('hsl ' + color.toHsl().h + ' 1 .5').toHslString();
    return hueString;
  }

  createShadeSpectrum(_color) {
    const canvas = this.spectrumCanvas;
    const ctx = this.spectrumCtx;
    let color = _color;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!color) color = '#f00';

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    whiteGradient.addColorStop(0, '#fff');
    whiteGradient.addColorStop(1, 'transparent');
  
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    blackGradient.addColorStop(0, 'transparent');
    blackGradient.addColorStop(1, '#000');
  
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  startGetSpectrumColor(e) {
    this.getSpectrumColor(e);
    this.spectrumCursor.classList.add('dragging');
    this.isDrag = true;
  }

  endGetSpectrumColor() {
    this.spectrumCursor.classList.remove('dragging');
    this.isDrag = false;
  }

  startGetHueColor(e) {
    this.getHueColor(e);
    this.hueCursor.classList.add('dragging');
    this.hueDrag = true;
  }

  endGetHueColor() {
    this.hueCursor.classList.remove('dragging');
    window.removeEventListener('mousemove', this.getHueColor);
    this.hueDrag = false;
  }

  getHueColor(e) {
    if (!this.hueDrag) return;

    e.preventDefault();
    
    const { hueRect } = this;
    let x = e.pageX - hueRect.left;
  
    if (x > hueRect.width) { 
      x = hueRect.width; 
    }
  
    if (x < 0) { 
      x = 0; 
    }  
  
    const percent = x / hueRect.width;
  
    const hue = 360 - (360 * percent);

    this.hue = hue;
  
    const hueColor = tinycolor('hsl ' + hue + ' 1 .5').toHslString();
    const color = tinycolor('hsl ' + hue + ' ' + this.saturation + ' ' + this.lightness).toHslString();
  
    this.createShadeSpectrum(hueColor);
    this.updateHueCursor(x);
    
    this.setCurrentColor(color);
    this.setColorValues(color);
  }

  // got some help here - http://stackoverflow.com/questions/23520909/get-hsl-value-given-x-y-and-hue
  getSpectrumColor(e) {
    if (!this.isDrag) return;
    e.preventDefault();

    const { spectrumRect } = this;
    // get x/y coordinates
    let x = e.pageX - spectrumRect.left;
    let y = e.pageY - spectrumRect.top;

    // constrain x max
    if (x > spectrumRect.width) { x = spectrumRect.width; }
    if (x < 0) { x = 0; }
    if (y > spectrumRect.height) { y = spectrumRect.height; }
    if (y < 0) { y = 0.1; }  

    // convert between hsv and hsl
    const xRatio = (x / spectrumRect.width) * 100;
    const yRatio = (y / spectrumRect.height) * 100; 
    const hsvValue = 1 - (yRatio / 100);
    const hsvSaturation = xRatio / 100;

    this.lightness = (hsvValue / 2) * (2 - hsvSaturation);
    this.saturation = (hsvValue * hsvSaturation) / (1 - Math.abs((2 * this.lightness) - 1));
    const color = tinycolor('hsl ' + this.hue + ' ' + this.saturation + ' ' + this.lightness);

    this.setCurrentColor(color);  
    this.setColorValues(color);
    this.updateSpectrumCursor(x, y);
  }
  
  show(ele) {
    const { input, panel } = this;
    const pos = input.getBoundingClientRect();
    const x = pos.left;
    const y = pos.top + pos.height;

    let color = '';

    if (ele.value) {
      color = ele.value;
    }

    if (ele.getAttribute('data-color')) {
      color = ele.getAttribute('data-color');
    }

    panel.style.left = x + 'px';
    panel.style.top = y + 'px';

    this.panel.classList.add('show');

    this.refreshElementRects();
    
    if (color) {
      this.changeColor(color);
    }
  }

  hide() {
    this.panel.classList.remove('show');
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

    this.hex.addEventListener('change', function () {
      const value = this.value;
      self.colorToPos(value);
    });

    window.addEventListener('resize', function () {
      self.refreshElementRects();
    });

    window.addEventListener('mousemove', this.getSpectrumColor.bind(this));
    window.addEventListener('mouseup', this.endGetSpectrumColor.bind(this));

    window.addEventListener('mousemove', this.getHueColor.bind(this));
    window.addEventListener('mouseup', this.endGetHueColor.bind(this));

    this.spectrumCanvas.addEventListener('mousedown', function (e) {
      self.startGetSpectrumColor(e);
    });

    this.input.addEventListener('click', function (e) {
      e.stopPropagation();
      self.show(this);
    });

    this.panel.querySelector('.color-confirm').addEventListener('click', function (e) {
      self.confirm();
    });

    this.panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    window.addEventListener('click', function (e) {
      self.hide();
    });
  }

  static createDom() {
    const div = document.createElement('div');
    div.className = 'ui-color-picker';

    div.innerHTML = `<div class="color-picker-panel">
      <div class="spectrum-map">
        <button class="spectrum-cursor color-cursor"></button>
        <canvas class="spectrum-canvas"></canvas>
      </div>
      <div class="panel-row panel-color-row">
        <div class="panel-color"></div>
        <div class="panel-bar">
          <div class="hue-map">
            <button class="hue-cursor color-cursor"></button>
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
}

window.onload = () => {
  new ColorPicker('#picker-trigger', {
    onChange(data) {
      document.querySelector('#picker-trigger').value = data;
    }
  });
};
