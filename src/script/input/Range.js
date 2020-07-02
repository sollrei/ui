class Range {
  /**
   * @param {string|object} selector 
   * @param {object=} options 
   */
  constructor(selector, options) {
    const defaultSetting = {
      onChange: null,
      sliderDom: '',
      thumbClass: '.thumb',
      rateClass: '.rate',
      delay: 30,
      width: 180,

      withInput: false,
      inputWidth: 80,
      inputUnit: '%',
      inputName: 'range'
    };
  
    let container = selector;
  
    if (typeof selector === 'string') {
      container = document.querySelector(selector);
    }
  
    if (!container) {
      return;
    }

    this.settings = Object.assign({}, defaultSetting, options);
    
    this.container = container;
    this.input = container.querySelector('input');
  
    this.moving = this.moving.bind(this);
  
    this.init();
  }

  init() {
    const input = this.input;
    const { value } = input;
    const max = input.getAttribute('max');
    const min = input.getAttribute('min');

    input.style.display = 'none';

    this.min = Number(min);
    this.max = Number(max);
    this.value = Number(value);
    this.range = this.max - this.min;
    this.zero = 0;

    this.startDrag = false;
    this.timer = null;

    if (min < 0) {
      this.zero = 0 - this.min;
    }

    this.initDom();
    this.initRate(this.value);
  }

  initDom() {
    const slider = this.createSlider();
    const rangeSlider = this.container.appendChild(slider);
    const { thumbClass, rateClass, withInput } = this.settings;

    this.rangeSlider = rangeSlider;
    // cache thumb button, rate element and popup element
    this.elementThumb = rangeSlider.querySelector(thumbClass);
    this.elementRate = rangeSlider.querySelector(rateClass);

    if (withInput) {
      const inputDom = this.createInput();
      const inputWrap = this.container.parentNode.appendChild(inputDom);
      this.valueInput = inputWrap.querySelector('.js-range-value');
    }
    
    this.events();
  }
  
  createSlider() {
    const slider = document.createElement('div');
    slider.className = 'ui-slider';
    slider.innerHTML = this.createDomStr();

    return slider;
  }

  createInput() {
    const { inputWidth, inputUnit } = this.settings;
    const { value } = this;
    const div = document.createElement('div');

    div.className = 'ui-icon-input ml-20';
    div.style.width = inputWidth + 'px';
    div.innerHTML = `<input class="ui-form-control js-range-value" type="text" value="${value}"/>
    <span class="suffix">${inputUnit}</span>`;

    return div;
  }

  /**
   * @returns {string} range slider html
   * */
  createDomStr() {
    const { zero, range, settings } = this;
    const percent = (zero / range) * 100;
    const width = (settings.width * percent) / 100;
    
    return settings.sliderDom
      || '<div class="bar">'
          + `<div class="negative" style="width: ${percent}%"></div>`
          + '<div class="rate">'
          + `<div class="negative-rate" style="max-width: ${width}px"></div>`
          + '<div class="btn thumb"></div>'
          + '</div>'
          + '</div>';
  }

  /**
   * init thumb's position
   *
   * @param {number} value
   * */
  initRate(value) {
    const { elementRate, range, min } = this;
    elementRate.style.width = (((value - min) / range) * 100) + '%';
  }

  /**
   * set thumb element position
   *
   * @param {number} width
   * */
  setPosition(width) {
    const { settings, range, min } = this;
    const value = Math.round((width / settings.width) * range);
    const rate = (value / range) * 100;

    this.changeBtnPosition(rate, value + min);
  }

  /**
   * @param {number} value
   * */
  setValue(value) {
    const { onChange, withInput } = this.settings;

    this.value = value;
    if (onChange && typeof onChange === 'function') {
      onChange(value);
    } 
    if (withInput) {
      this.valueInput.value = value;
    }
  }

  /**
   * @param {number|string} val 
   */
  changeValue(val) {
    const { max, min, range } = this;
    let rate = 0;
    let value = Number(val) || 0;

    if (value > max) {
      value = max;
    }

    if (value < min) {
      value = min;
    }

    rate = (value / range) * 100;
    this.changeBtnPosition(rate, value);
  }

  /**
   * @param {number} rate 
   * @param {number} value 
   */
  changeBtnPosition(rate, value) {
    this.elementRate.style.width = rate + '%';
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.setValue(value);
    }, this.settings.delay);
  }

  /**
   * bind move event when start
   *
   * @param {MouseEvent} e
   * */
  startMove(e) {
    e.preventDefault();
    this.startDrag = true;
  }

  /**
   * remove event when stop
   * */
  stopMove() {
    this.setStopStatus();
    this.startDrag = false;
  }

  /**
   * @param {MouseEvent} e
   * */
  moving(e) {
    if (!this.startDrag) return;

    const { width } = this.settings;
    const x = e.clientX;
    const left = this.rangeSlider.getBoundingClientRect().left;

    let deltaX = x - left;

    if (deltaX > width) {
      deltaX = width;
    }

    if (deltaX < 0) {
      deltaX = 0;
    }

    this.setPosition(deltaX);
  }

  setStopStatus() {
    this.input.value = this.value;
  }

  /**
   * bind events
   * */
  events() {
    const { elementThumb, container, settings, valueInput } = this;
    const doc = document;
    const self = this;

    elementThumb.addEventListener('mousedown', (e) => {
      this.startMove(e);
    });

    doc.addEventListener('mouseup', () => {
      this.stopMove();
    });

    container.addEventListener('click', (e) => {
      this.startMove(e);
      this.moving(e);
      this.setStopStatus();
      this.stopMove();
    });

    doc.addEventListener('mousemove', this.moving);

    if (!settings.withInput) return;

    valueInput.addEventListener('change', function () {
      self.changeValue(this.value);
    });

    valueInput.addEventListener('keydown', function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        self.changeValue(this.value);
      }
    });
  }
}

export default Range;
