import './polyfill.js';

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

  getUrlParameter(name) {
    if (typeof window.URLSearchParams === 'function') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }
  
    const _name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + _name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(decodeURIComponent(location.href));

    if (!results) return null;
    if (!results[2]) return '';

    return results[2];

    // const regex = new RegExp('[?&]' + _name + '(=([^&#]*)|&|#|$)', 'g');
    // let result;
    // while ((result = regex.exec(url)) != null) {
    //   console.log(result)
    // }
  },

  hasClass(element, className) {
    if (!element) return false;

    if (!element.className) return false;
    
    if (element.classList) {
      return className.match(/(\w|-)+/g).every(function (item) {
        return element.classList.contains(item);
      });
    }
    
    return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  },

  /**
   * addClass removeClass toggleClass ie10+
   *
   * @param {HTMLElement|Element} element 
   * @param {string} className 
   */
  addClass(element, className) {
    if (!element || !className) return;

    let ele = element;

    if (element.classList) {
      className.match(/(\w|-)+/g).forEach(item => {
        element.classList.add(item);
      });
    } else if (!this.hasClass(element, className)) {
      ele.className = element.className ? element.className.trim() + ' ' + className : className;
    }
  },

  /**
   * @param {HTMLElement|Element} element 
   * @param {string} className 
   */
  removeClass(element, className) {
    if (!element || !className) return;

    const ele = element;

    if (element.classList) {
      className.match(/(\w|-)+/g).forEach(item => {
        element.classList.remove(item);
      });
    } else {
      ele.className = ele.className.replace(new RegExp(`(\\s|^)${className}(\\s|$)`), ' ');
    }
  },

  /**
   * @param {HTMLElement|Element} element 
   * @param {string} className 
   */
  toggleClass(element, className) { 
    if (!element || !className) return;

    if (element.classList) {
      className.match(/(\w|-)+/g).forEach(item => {
        element.classList.toggle(item);
      });
      return;
    }
    
    if (this.hasClass(element, className)) {
      this.removeClass(element, className);
    } else {
      this.addClass(element, className);
    }
  },

  /**
   * @param {HTMLElement|Element|HTMLDocument} element 
   * @param {string} eventNames 
   * @param {object|Function} listener 
   */
  addMultiEvent(element, eventNames, listener) {
    const eventArray = eventNames.split(' ');
    for (let i = 0, l = eventArray.length; i < l; i += 1) {
      element.addEventListener(eventArray[i], listener, false);
    }
  },

  /**
   * @description
   * @param {HTMLElement|Element|HTMLDocument} element
   * @param {string} eventName
   * @param {string} selector
   * @param {Function} handler
   */
  on(element, eventName, selector, handler) {
    this.addMultiEvent(element, eventName, event => {
      for (let target = event.target; target && target !== element; target = target.parentNode) {
        if (target.matches(selector)) {
          handler.call(target, event);
          break;
        }
      }
    });
  },

  /**
   * @param {string} type - element type
   * @param {object} attribute - element attributes
   * @param {string} html - innerHTML
   * @returns {HTMLElement} -
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
      throw new Error(e);
    }
    return dom;
  },

  createId() {
    return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
  },

  supportPseudo(pseudoClass) {
    // from https://gomakethings.com/testing-for-css-pseudo-class-support-with-vanilla-javascript/
    // Get the document stylesheet
    let _pseudoClass = pseudoClass;
    let ss = document.styleSheets[0];

    // Create a stylesheet if one doesn't exist
    if (!ss) {
      let el = document.createElement('style');
      document.head.appendChild(el);
      ss = document.styleSheets[0];
      document.head.removeChild(el);
    }

    // Test the pseudo-class by trying to style with it
    let testPseudo = function () {
      try {
        if (!(/^:/).test(pseudoClass)) {
          _pseudoClass = ':' + pseudoClass;
        }
        ss.insertRule('html' + _pseudoClass + '{}', 0);
        ss.deleteRule(0);
        return true;
      } catch (e) {
        return false;
      }
    };

    // Run the test
    return testPseudo();
  },

  /**
   * 
   * @param {*} _date 
   * @param {string} format 
   * @returns {string} -
   */
  dateFormate(_date, format) {
    const date = new Date(_date);
    const year = date.getFullYear() + '';
    const month = date.getMonth() + 1;

    const _month = ('0' + month).slice(-2);
    const _day = ('0' + date.getDate()).slice(-2);
    const _hours = ('0' + date.getHours()).slice(-2);
    const _minutes = ('0' + date.getMinutes()).slice(-2);
    const _seconds = ('0' + date.getSeconds()).slice(-2);

    const opt = {
      YY: year,
      MM: _month,
      DD: _day,
      hh: _hours,
      mm: _minutes,
      ss: _seconds 
    };

    let result;

    if (format) {
      result = format;

      Object.keys(opt).forEach(key => {
        result = result.replace(key, opt[key]);
      });
    } else {
      // YYYY-MM-DD hh:mm:ss
      result = `${year}-${_month}-${_day} ${_hours}:${_minutes}:${_seconds}`;
    }

    return result;
  },

  getPageScrollTop() {
    return (window.pageYOffset 
      || document.documentElement.scrollTop 
      || document.body.scrollTop 
      || 0);
  },

  getPageScrollLeft() {
    return (window.pageXOffset 
      || document.documentElement.scrollLeft 
      || document.body.scrollLeft
      || 0);
  },

  /**
   * @param {string} url - request url
   * @param {object} data - request data
   * @param {string} method  - request method
   * @param {object} header -
   * @returns {Promise} - 
   * */
  fetchData(
    url, 
    data = {}, 
    method = 'GET', 
    header = { 
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
    }) {
    let dataArr = [];
    let dataStr = '';

    for (let i in data) {
      if (Object.prototype.hasOwnProperty.call(data, i)) {
        dataArr.push(`${i}=${encodeURIComponent(data[i])}`);
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

    let getUrl = url;

    if (dataStr) {
      getUrl = url.indexOf('?') > 0 ? `${url}&${dataStr}` : `${url}?${dataStr}`;
    }

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
