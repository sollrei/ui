import u from '../base/util.es6';

const doc = document;

class Tooltip {
  constructor(selector, options) {
    const defaultSetting = {
      className: 'ui-tooltip',
      position: 'left bottom',
      // x: left center right  y: top bottom

      gap: 4,
      
      showEvent: 'mouseover',
      hideEvent: 'mouseout'
    };

    this.settings = Object.assign({}, defaultSetting, options);

    this.init(selector);
  }

  init(selector) {
    const self = this;
    const { showEvent, hideEvent } = this.settings;


    u.on(doc, showEvent, selector, function () {
      this.timer = setTimeout(() => {
        self.showTooltip(this);
      }, 200);
    });

    u.on(doc, hideEvent, selector, function () {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      Tooltip.destroyTooltip(this.tooltip, this);
    });
  }

  showTooltip(element) {
    const ele = element;
    if (ele.noTooltip) return;

    const title = ele.getAttribute('data-title');
    
    if (title) {
      if (ele.scrollWidth <= ele.offsetWidth) {
        ele.noTooltip = true;
        return;
      }
    }
    
    const data = ele.getAttribute('data-position');
    const position = data || this.settings.position;
    const tooltip = this.createTooltipElement(ele, position);
    const style = tooltip.style;
    const elePos = element.getBoundingClientRect();
    const gap = this.settings.gap;

    style.display = 'block';

    ele.tooltip = tooltip;

    setTimeout(() => {
      const [x, y] = position.split(' ');
      const pos = {
        eleH: ele.offsetHeight,
        eleW: ele.offsetWidth,
        eleL: elePos.left + window.scrollX,
        eleT: elePos.top + window.scrollY,
        tipH: tooltip.offsetHeight,
        tipW: tooltip.offsetWidth
      };

      if (y === 'middle') {
        Tooltip.setPositionMiddle(x, pos, style, gap);
      } else {
        Tooltip.setPositionVertical(y, pos, style, gap);
        Tooltip.setPositionHorizontal(x, pos, style, gap);
      }
    }, 2);
  }

  static setPositionVertical(y, pos, style, gap) {
    const sty = style;
    const h = (pos.eleT + pos.eleH + gap) + 'px';
    let t = (pos.eleT - pos.tipH - gap) + 'px';

    if (pos.eleT < pos.tipH) {
      t = h;
    }

    if (y === 'bottom') {
      sty.top = h;
    }
    if (y === 'top') {
      sty.top = t;
    }
  }

  static setPositionHorizontal(x, pos, style) {
    const sty = style;

    switch (x) {
      case 'right':
        sty.left = pos.eleL + 'px';
        break;
      case 'left':
        sty.left = ((pos.eleL + pos.eleW) - pos.tipW) + 'px';
        break;
      case 'center':
        sty.left = pos.eleL + (pos.eleW / 2) + 'px';
        break;
      default:
        break;
    }
  }

  static setPositionMiddle(x, pos, style, gap) {
    const sty = style;

    sty.top = ((pos.eleT + (pos.eleH / 2)) - (pos.tipH / 2)) + 'px';

    if (x === 'left') {
      sty.left = (pos.eleL - gap) - pos.tipW + 'px';
    }

    if (x === 'right') {
      sty.left = pos.eleL + pos.eleW + gap + 'px';
    }
  }

  static destroyTooltip(tooltipElement) {
    const tip = tooltipElement;

    if (tip) {
      tip.parentNode.removeChild(tip);
    }
  }

  createTooltipElement(element, position) {
    let text = element.getAttribute('data-text');
    const title = element.getAttribute('data-title');
    const dataTip = element.querySelector('.data-tip') ? element.querySelector('.data-tip').innerHTML : '';

    text = (dataTip || text || title);
    
    const { className } = this.settings;
    const dom = u.createElement('div', { className: `${className} ${position}` }, text);
    return document.body.appendChild(dom);
  }
}

export default Tooltip;
