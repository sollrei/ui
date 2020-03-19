// element.closest polyfill
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

if (typeof Object.assign !== 'function') {
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

// trigger
HTMLElement.prototype.trigger = function (type, data) {
  const event = document.createEvent('HTMLEvents');
  event.initEvent(type, true, true);
  event.data = data || {};
  event.eventName = type;
  this.dispatchEvent(event);
  return this;
};

// requestAnimFrame
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

// cancelAnimFrame
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

const util = {
  IEVersion() {
    const agent = window.navigator.userAgent;
    const index = agent.indexOf('MSIE');

    return index > 0 || agent.match(/Trident.*rv:11\./)
      ? parseInt(agent.substring(index + 5, agent.indexOf('.', index)), 10)
      : 999;
  },

  forEach(arrLike, callback) {
    [].slice.call(arrLike).forEach(callback);
  },

  isEmpty(value) {
    return value === undefined ||
            value === null ||
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            (typeof value === 'string' && value.trim().length === 0);
  },

  hasClass(element, className) {
    if (element.className) {
      return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }
    return false;
  },

  addClass(element, className) {
    const ele = element;
    if (!ele) return;
    if (!this.hasClass(ele, className)) {
      ele.className = ele.className ? ele.className.trim() + ' ' + className : className;
    }
  },

  removeClass(element, className) {
    const ele = element;
    if (!ele) return;
    if (this.hasClass(element, className)) {
      ele.className = ele.className.replace(new RegExp(`(\\s|^)${className}(\\s|$)`), ' ');
    }
  },

  toggleClass(element, className) { 
    if (!element) return;
    if (this.hasClass(element, className)) {
      this.removeClass(element, className);
    } else {
      this.addClass(element, className);
    }
  },

  addMultiEvent(element, eventNames, listener) {
    const eventArray = eventNames.split(' ');
    for (let i = 0, l = eventArray.length; i < l; i += 1) {
      element.addEventListener(eventArray[i], listener, false);
    }
  },

  /*
   reference: http://bdadam.com/blog/plain-javascript-event-delegation.html
   */
  on(element, eventName, selector, handler) {
    this.addMultiEvent(element, eventName, event => {
      const possibleTargets = element.querySelectorAll(selector);
      const target = event.target;

      for (let i = 0, l = possibleTargets.length; i < l; i += 1) {
        let el = target;
        let p = possibleTargets[i];

        while (el && el !== element) {
          if (el === p) {
            handler.call(p, event);
            break;
          }
          el = el.parentNode;
        }
      }
    });
  },

  /**
   * @param {string} type - element type
   * @param {object} attribute - element attributes
   * @param {string} html - innerHTML
   * @returns {HTMLElement}
   * */
  createElement(type, attribute = {}, html = '') {
    const dom = document.createElement(type);
    for (let i in attribute) {
      if (Object.prototype.hasOwnProperty.call(attribute, i)) {
        dom[i] = attribute[i];
      }
    }
    try {
      dom.innerHTML = html;
    } catch (e) {
      console.warn('innerHTML error');
    }
    return dom;
  },

  createId() {
    return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
  },

  /**
   * @param {String} url - request url
   * @param {Object} data - request data
   * @param {String} method  - request method
   * @param {Object} header
   * @returns {Promise}
   * */
  fetchData(url, data = {}, method = 'GET', header = { 'Content-Type': 'application/x-www-form-urlencoded' }) {
    let dataArr = [];
    let dataStr = '';

    for (let i in data) {
      if (Object.prototype.hasOwnProperty.call(data, i)) {
        dataArr.push(`${i}=${data[i]}`);
      }
    }

    dataStr = dataArr.join('&');

    if (method === 'POST') {
      return fetch(url, {
        method: method,
        headers: header,
        body: dataStr
        // credentials: 'include'
      }).then(res => {
        if (res.status) {
          return res.json();
        }
        throw new Error('post data fetch error!');
      });
    }

    let getUrl = url.indexOf('?') > 0 ? `${url}&${dataStr}` : `${url}?${dataStr}`;

    return fetch(getUrl, {
      // credentials: 'include'
    }).then(res => {
      if (res.status) {
        return res.json();
      }
      throw new Error('get data fetch error!');
    });
  }
};


export default util;
