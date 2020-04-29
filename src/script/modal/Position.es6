class Position {
  constructor(options) {
    const defaultSettings = {
      position: 'right bottom',
      gap: 4
    };

    this.settings = Object.assign({}, defaultSettings, options);
  }

  setPosition(element, targetElement) {
    const { gap } = this.settings;
    const { left, top } = targetElement.getBoundingClientRect();
    const data = targetElement.getAttribute('data-position');
    const position = data || this.settings.position;

    const pos = {
      targetHeight: targetElement.offsetHeight,
      targetWidth: targetElement.offsetWidth,
      targetLeft: left + window.scrollX,
      targetTop: top + window.scrollY,
      elementHeight: element.offsetHeight,
      elementWidth: element.offsetWidth
    };

    const style = element.style;

    element.style.width = element.offsetWidth + 'px';

    const [x, y] = position.split(' ');

    if (y === 'middle') {
      Position.setPositionMiddle(x, pos, style, gap);
    } else {
      Position.setPositionVertical(y, pos, style, gap);
      Position.setPositionHorizontal(x, pos, style, gap);
    }
  }

  static setPositionVertical(y, pos, style, gap) {
    const sty = style;
    const h = (pos.targetTop + pos.targetHeight + gap) + 'px';
    let t = (pos.targetTop - pos.elementHeight - gap) + 'px';

    if (pos.targetTop < pos.elementHeight) {
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
        sty.left = pos.targetLeft + 'px';
        break;
      case 'left':
        sty.left = ((pos.targetLeft + pos.targetWidth) - pos.elementWidth) + 'px';
        break;
      case 'center':
        sty.left = ((pos.targetLeft + (pos.targetWidth / 2)) - (pos.elementWidth / 2)) + 'px';
        break;
      default:
        break;
    }
  }

  static setPositionMiddle(x, pos, style, gap) {
    const sty = style;

    sty.top = ((pos.targetTop + (pos.targetHeight / 2)) - (pos.elementHeight / 2)) + 'px';

    if (x === 'left') {
      sty.left = (pos.targetLeft - gap) - pos.elementWidth + 'px';
    }

    if (x === 'right') {
      sty.left = pos.targetLeft + pos.targetWidth + gap + 'px';
    }
  }
}

export default Position;
