import u from '../base/util.js';

// count

class Message {
  /**
   * @param {object=} settings 
   */
  constructor(settings) {
    const defaultSettings = {
      duration: 3000,
      position: 'top',
      top: 27 // px
    };

    this.settings = Object.assign({}, defaultSettings, settings);

    this.init();
  }

  init() {
    // do .. what ...
    this.count = 0;
    // this.messages = [];
  }

  /**
   * @param {string} message - message content
   * @param {'top'|'center'} position 
   * @param {object=} option
   */
  success(message, position, option) {
    this.show(message, true, position, option);
  }

  /**
   * @param {string} message - message content
   * @param {'top'|'center'} position 
   * @param {object=} option
   */
  warn(message, position, option) {
    this.show(message, false, position, option);
  }

  /**
   * @param {string} message - message content
   * @param {boolean} type 
   * @param {'top'|'center'} position
   * @param {object=} option
   */
  show(message, type, position, option) {
    const content = Message.createAlert(message, type, option);

    const alert = document.querySelector('.ui-alert');

    if (alert) {
      alert.parentNode.removeChild(alert);
    }

    const msg = document.body.appendChild(content);

    if (this.settings.position === 'center' || position === 'center') {
      msg.style.top = '50%';

      // setTimeout(() => {
      //   msg.parentNode.removeChild(msg);
      // }, this.settings.duration);

      // return;
    } else {
      let top = this.settings.top;
      if (typeof top === 'number') {
        top = this.settings.top + 'px';
      }
      msg.style.top = this.settings.top;
    }

    // const top = this.settings.top + (this.count * 50) + 'px';
    
    // msg.style.top = top;
      
    // this.count += 1;
      
    // this.messages.push(msg);

    if (msg.querySelector('.alert-close')) {
      msg.querySelector('.alert-close').addEventListener('click', function () {
        Message.hide(msg);
      });
    }
    
    setTimeout(() => {
      // this.hide(msg);
      Message.hide(msg);
    }, this.settings.duration);
  }

  static hide(msg) {
    if (msg && msg.parentNode) {
      msg.parentNode.removeChild(msg);
    }
  }

  // hide() {
  //   this.count -= 1;
  //   const ele = this.messages.shift();
  //   ele.parentNode.removeChild(ele);
  //   this.resetTop();
  // }

  // resetTop() {
  //   const { messages } = this;
  //   messages.forEach((item) => {
  //     const top = item.style.top;
  //     item.style.top = (parseInt(top, 10) - 50) + 'px';
  //   });
  // }

  /**
   * 
   * @param {string} content 
   * @param {boolean} type 
   * @param {object=} option
   * @returns {HTMLElement} - ui-alert element
   */
  static createAlert(content, type, option) {
    let _type = 'success';
    if (typeof type === 'boolean' && !type) {
      _type = 'warn';
    }
    const className = 'alert-' + _type;

    const domString = Message.createDomString(content, className, option);
    const div = u.createElement('div', { className: 'ui-alert' }, domString);

    return div;
  }

  static createDomString(content, className, option = {}) {
    const { closeable } = option;
    const icon = closeable ? '<span class="alert-close iconfont"></span>' : '';

    return `<div class="alert-content ${className} ${closeable ? 'alert-closeable' : ''}">${content}${icon}</div>`;
  }
}

export default Message;
