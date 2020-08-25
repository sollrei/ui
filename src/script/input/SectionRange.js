class SectionRange {
  constructor(selector, options) {
    const defaultSettings = {
      min: 0,
      max: 10240,
      width: 300,

      section: [{
        label: '500M',
        value: 500
      }, {
        label: '1G',
        value: 1024
      }, {
        label: '10G',
        value: 10240
      }],

      onSelect: null
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

    const sectionStr = section.reduce((pre, cur) => {
      return pre + `<div class="flex1 range-section">${cur.label}</div>`
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
  }

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

  setPosition(width) {
    this.elementRate.style.width = width + 'px';
    this.elementThumb.style.left = width + 'px';
    this.countValue(width);
  }

  countValue(_width) {
    const { width, section } = this.settings;
    const item = 1 / section.length;
    const rate = _width / width;
    let index = Math.floor(rate / item);
    let value = 0;
    
    if (index > section.length - 1) {
      index = section.length - 1;
    }

    if (index === 0) {
      value = section[0].value * (rate / item);
    } else {
      let prev = section[index - 1].value;
      let current = section[index].value;
      value = prev + ((current - prev) * ((rate - (item * index)) / item));
    }

    this.value = Math.floor(value);
  }

  setValue(value) {
    const { onChange } = this.settings;

    this.value = value;
    if (onChange && typeof onChange === 'function') {
      onChange(value);
    } 
  }

  startMove(e) {
    e.preventDefault();
    this.startDrag = true;
  }

  stopMove() {
    this.setStopStatus();
    this.startDrag = false;
  }

  setStopStatus() {
    const { onSelect } = this.settings;

    if (onSelect) {
      onSelect(this.value);
    }
  }

  events() {
    const { elementThumb, rangeSlider } = this;
    const doc = document;
    let moving = this.moving;

    elementThumb.addEventListener('mousedown', (e) => {
      this.startMove(e);
      doc.addEventListener('mousemove', moving);
    });

    doc.addEventListener('mouseup', () => {
      this.stopMove();
      doc.removeEventListener('mousemove', moving);
    });

    rangeSlider.addEventListener('click', (e) => {
      this.startMove(e);
      this.moving(e);
    });
  }
}

export default SectionRange;
