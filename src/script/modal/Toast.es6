import u from '../base/util.es6';

let cacheToast = null;

class Toast {
  constructor(options) {
    const defaultSettings = {
      duration: 2000,
      position: 'center' // center
    };

    this.settings = Object.assign({}, defaultSettings, options);
  }

  show(type, message, position) {
    const _position = position || this.settings.position;
    const content = Toast.createAlert(message, type, _position);
    const toast = document.body.appendChild(content);

    if (cacheToast) {
      Toast.hide(cacheToast);
    }

    cacheToast = toast;

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
        cacheToast = null;
      }
    }, this.settings.duration);
  }

  warn(message, position) {
    this.show('warn', message, position);
  }

  success(message, position) {
    this.show('success', message, position);
  }

  loading(position) {
    this.show('loading', null, position);
  }

  static hide(element) {
    element.parentNode.removeChild(element);
  }

  static createDomString(content, type) {
    const className = `toast-${type}`;
    let icon = '';

    if (type === 'success') {
      icon = '<i class="iconfont icon-success-fill"></i>';
    }

    return `<div class="toast-content ${className}">${icon}${content}</div>`;
  }

  static createAlert(content, type, position) {
    const domString = Toast.createDomString(content, type);
    const div = u.createElement('div', { className: `ui-toast ${position}` }, domString);

    return div;
  }
}

export default Toast;
