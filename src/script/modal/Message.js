import Util from '../base/util.js';

class Message {
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

  success(message, position) {
    this.show(message, true, position);
  }

  warn(message, position) {
    this.show(message, false, position);
  }

  show(message, type, position) {
    const content = Message.createAlert(message, type);

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
      msg.style.top = this.settings.top + 'px';
    }

    // const top = this.settings.top + (this.count * 50) + 'px';
    
    // msg.style.top = top;
      
    // this.count += 1;
      
    // this.messages.push(msg);
    
    setTimeout(() => {
      // this.hide(msg);
      if (msg && msg.parentNode) {
        msg.parentNode.removeChild(msg);
      }
    }, this.settings.duration);
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

  static createAlert(content, type) {
    let _type = 'success';
    if (typeof type === 'boolean' && !type) {
      _type = 'warn';
    }
    const className = 'alert-' + _type;

    const domString = Message.createDomString(content, className);
    const div = Util.createElement('div', { className: 'ui-alert' }, domString);

    return div;
  }

  static createDomString(content, className) {
    return `<div class="alert-content ${className}">${content}</div>`;
  }
}

export default Message;
