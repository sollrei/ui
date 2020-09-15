class SectionRange {
  constructor(selector, options) {
    const defaultSettings = {
      min: 0,
      max: 0,
      width: 480,
      decimal: 0,

      section: [],

      onSelect: null,
      onChange: null
    };

    this.settings = Object.assign({}, defaultSettings, options);
    this.moving = this.moving.bind(this);
    
    this.init(selector);
  }

  init(selector) {
    let wrap = selector;
    if (typeof wrap === 'string') {
      wrap = document.querySelector(selector);
    }
    if (!wrap) return;

    this.wrap = wrap;

    this.startDrag = false;
    this.createDom();
    this.events();
  }

  createDom() {
    const { settings, wrap } = this;
    const { section, width } = settings;
    const style = `width: calc(${100 / section.length}% - 1px)`;
    const sectionStr = section.reduce((pre, cur) => {
      return pre + `<div class="range-section" style="${style}">${cur.label}</div>`;
    }, '');

    const htmlString = `<div class="ui-section-range" style="width: ${width}px">
      <div class="bar ui-row">
        ${sectionStr}
      </div>
      <div class="rate">
        <div style="width: ${width}px" class="ui-row">${sectionStr}</div>
      </div>
      <div class="thumb"></div>
    <div>`;

    wrap.innerHTML = htmlString;
    this.rangeSlider = wrap.querySelector('.ui-section-range');
    this.elementRate = wrap.querySelector('.rate');
    this.elementThumb = wrap.querySelector('.thumb');
    this.elementBar = wrap.querySelector('.bar');
  }

  moving(e) {
    if (!this.startDrag) return;

    const { width } = this.settings;
    const x = e.clientX;
    const left = this.rangeSlider.getBoundingClientRect().left;

    let deltaX = x - left;

    if (deltaX >= width) {
      deltaX = width;
    }

    if (deltaX < 0) {
      deltaX = 0;
    }

    this.setPosition(deltaX);
    this.countValue(deltaX);
    this.setValue();
  }

  setPosition(width) {
    this.elementRate.style.width = width + 'px';
    this.elementThumb.style.left = width + 'px';
  }

  countValue(_width) {
    const { width, section, decimal } = this.settings;
    const item = 1 / section.length;
    const rate = _width / width;
    let index = Math.floor(rate / item);
    let value = 0;
    
    if (index > section.length - 1) {
      index = section.length - 1;
    }

    if (index === 0) {
      value = section[0].value * (rate / item);
    } else if (_width >= width) {
      value = section[section.length - 1].value;
    } else {
      let prev = section[index - 1].value;
      let current = section[index].value;
      value = prev + ((current - prev) * ((rate - (item * index)) / item));
    }

    if (decimal) {
      this.value = value.toFixed(decimal);
    } else {
      this.value = Math.floor(value);
    }
  }

  valueToWidth(_val) {
    const val = Number(_val) || 0;
    const { section, width, max, min } = this.settings;
    const length = section.length;
    
    if (val >= max) {
      this.setPosition(width);
      return;
    }

    if (val <= min) {
      this.setPosition(0);
      return;
    }

    let _index = null;
    let _value = 0;

    section.every((item, index) => {
      const { value } = item;
      if (val <= value) {
        _index = index; 
        _value = value;
        return false;
      }
      return true;
    });

    let percent;

    if (typeof _index !== 'number') return;
    
    if (_index === 0) {
      percent = (val / _value) * (1 / length);
    } else {
      const prev = section[_index - 1].value;
      percent = (((val - prev) / (_value - prev)) * (1 / length)) + (_index / length);
    }

    this.setPosition(width * percent);
  }

  setValue() {
    const { onChange } = this.settings;

    if (onChange && typeof onChange === 'function') {
      onChange(this.value);
    } 
  }

  startMove(e) {
    e.preventDefault();
    this.startDrag = true;
  }

  stopMove() {
    this.startDrag = false;
    this.setStopStatus();
  }

  setStopStatus() {
    const { onSelect } = this.settings;

    if (onSelect) {
      onSelect(this.value);
    }
  }

  events() {
    const { elementThumb, elementBar, elementRate } = this;
    const doc = document;
    let moving = this.moving;

    elementThumb.addEventListener('mousedown', (e) => {
      this.startMove(e);
      doc.addEventListener('mousemove', moving);
    });

    doc.addEventListener('mouseup', () => {
      if (!this.startDrag) return;
      this.stopMove();
      doc.removeEventListener('mousemove', moving);
    });

    elementBar.addEventListener('click', (e) => {
      this.startMove(e);
      this.moving(e);
      this.stopMove();
    });

    elementRate.addEventListener('click', (e) => {
      this.startMove(e);
      this.moving(e);
      this.stopMove();
    });
  }
}

export default SectionRange;
