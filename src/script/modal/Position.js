class Position {
  /**
   * @param {object=} options 
   */
  constructor(options) {
    const defaultSettings = {
      position: 'right bottom',
      gap: 4
    };

    this.settings = Object.assign({}, defaultSettings, options);
  }

  /**
   * @param {HTMLElement} element 
   * @param {HTMLElement} targetElement 
   */
  setPosition(element, targetElement) {
    const { gap, position } = this.settings;
    const { left, top } = targetElement.getBoundingClientRect();
    const data = targetElement.getAttribute('data-position');
    const _position = data || position;
    const ele = element;

    const { offsetHeight: targetHeight, offsetWidth: targetWidth } = targetElement;
    const { offsetHeight: elementHeight, offsetWidth: elementWidth } = element;
    const { scrollX, scrollY } = window;

    const pos = {
      targetHeight,
      targetWidth,
      targetLeft: left + (scrollX || document.documentElement.scrollLeft || 0),
      targetTop: top + (scrollY || document.documentElement.scrollTop || 0),
      left,
      top,
      scrollX: scrollX || document.documentElement.scrollLeft || 0,
      scrollY: scrollY || document.documentElement.scrollTop || 0,
      elementHeight,
      elementWidth
    };

    const style = element.style;

    ele.style.width = element.offsetWidth + 'px';

    const [x, y] = _position.split(' ');

    if (y === 'middle') {
      Position.setPositionMiddle(x, pos, style, gap);
    } else {
      Position.setPositionVertical(y, pos, style, gap);
      Position.setPositionHorizontal(x, pos, style);
    }
  }

  /**
   * @param {'bottom'|'top'} y
   * @param {object} pos 
   * @param {object} style 
   * @param {number} gap 
   */
  static setPositionVertical(y, pos, style, gap) {
    const { targetTop, targetHeight, elementHeight, top, scrollY } = pos;
    let bottomPosition = targetTop + targetHeight + gap;
    let topPosition = targetTop - elementHeight - gap;
    const sty = style;

    if (top < elementHeight) {
      topPosition = bottomPosition;
    } else if ((bottomPosition - scrollY) + elementHeight > document.documentElement.clientHeight) {
      bottomPosition = topPosition;
    }

    if (y === 'bottom') {
      sty.top = bottomPosition + 'px';
    }

    if (y === 'top') {
      sty.top = topPosition + 'px';
    }
  }

  /**
   * @param {'left'|'right'|'center'} x 
   * @param {object} pos 
   * @param {object} style 
   */
  static setPositionHorizontal(x, pos, style) {
    const sty = style;
    const { targetLeft, targetWidth, elementWidth } = pos;

    switch (x) {
      case 'right':
        sty.left = targetLeft + 'px';
        break;
      case 'left':
        sty.left = ((targetLeft + targetWidth) - elementWidth) + 'px';
        break;
      case 'center':
        sty.left = ((targetLeft + (targetWidth / 2)) - (elementWidth / 2)) + 'px';
        break;
      default:
        break;
    }
  }

  /**
   * @param {'left'|'right'} x 
   * @param {object} pos 
   * @param {object} style 
   * @param {number} gap 
   */
  static setPositionMiddle(x, pos, style, gap) {
    const sty = style;
    const { targetTop, targetHeight, elementHeight, elementWidth, targetLeft, targetWidth } = pos;

    sty.top = ((targetTop + (targetHeight / 2)) - (elementHeight / 2)) + 'px';

    if (x === 'left') {
      sty.left = ((targetLeft - gap) - elementWidth) + 'px';
    }

    if (x === 'right') {
      sty.left = targetLeft + targetWidth + gap + 'px';
    }
  }
}

export default Position;
