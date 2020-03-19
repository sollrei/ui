import Util from '../base/util.es6';

class Message {
  constructor(settings) {
    const defaultSettings = {
      duration: 3000,
      position: 'top',
      top: 88 // px
    };

    this.settings = Object.assign({}, defaultSettings, settings);

    this.init();
  }

  init() {
    // do .. what ...
    this.count = 0;
    this.messages = [];
  }

  success(message) {
    this.show(message, true);
  }

  warn(message) {
    this.show(message, false);
  }

  show(message, type) {
    const content = Message.createAlert(message, type);
    const msg = document.body.appendChild(content);

    if (this.settings.position === 'center') {
      msg.style.top = '50%';

      setTimeout(() => {
        msg.parentNode.removeChild(msg);
      }, this.settings.duration);

      return;
    }

    const top = this.settings.top + (this.count * 50) + 'px';
    msg.style.top = top;
      
    this.count += 1;
      
    this.messages.push(msg);
    
    setTimeout(() => {
      this.hide(msg);
    }, this.settings.duration);
  }

  hide(element) {
    this.resetTop(element);
    this.count -= 1;
  }

  resetTop(element) {
    const { messages } = this;
    messages.forEach((item, index) => {
      if (element === item) {
        element.parentNode.removeChild(element);
        messages.splice(index, 1);
        return;
      }
      const top = item.style.top;
      item.style.top = (parseInt(top, 10) - 50) + 'px';
    });
  }

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
