// @ts-nocheck
// https://developer.mozilla.org/zh-CN/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector
    || Element.prototype.webkitMatchesSelector
    || Element.prototype.mozMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;
    if (!document.documentElement.contains(el)) return null;
    if (!Element.prototype.matches) {
      return el.parentNode;
    }
    do {
      if (el.matches(s)) return el;
      el = el.parentElement;
    } while (el !== null);
    return null;
  };
}

if (typeof Object.assign !== 'function') { // for IE
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    /* eslint-disable-next-line */ 
    value: function assign(target, varArgs) { // .length of function is 2 
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }
      let to = Object(target);
      for (let index = 1; index < arguments.length; index += 1) {
        let nextSource = arguments[index];
        if (nextSource != null) { // Skip over if undefined or null
          for (let nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

HTMLElement.prototype.trigger = function (type, data) {
  const event = document.createEvent('HTMLEvents');
  event.initEvent(type, true, true);
  event.data = data || {};
  event.eventName = type;
  this.dispatchEvent(event);
  return this;
};

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
}());

window.cancelAnimFrame = (function () {
  return (
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    function (id) {
      window.clearTimeout(id);
    }
  );
}());
