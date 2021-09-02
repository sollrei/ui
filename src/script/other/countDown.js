class CountDown {
  constructor(element, options) {
    const defaultSettings = {
      seconds: 60,
      template: '{{time}}s',
      callback: null,
      auto: true
    };

    const opt = Object.assign({}, defaultSettings, options);
    const text = element.innerHTML;

    this.opt = opt;
    this.normalText = text;
    this.element = element;

    element.classList.add('disabled');

    if (opt.auto) {
      this.changeTime();
    }
  }

  changeTime() {
    const { seconds, template, callback } = this.opt;
    const { element } = this;
    let end = seconds;
    let [pre, suf] = template.split('{{time}}');

    let timer = setInterval(() => {
      if (end === 1) {
        clearInterval(timer);
        this.reset(element);
        if (typeof callback === 'function') {
          callback();
        }
        return;
      }

      // eslint-disable-next-line no-param-reassign
      element.innerHTML = `${pre}${end}${suf}`;
      end -= 1;
    }, 1000);
  }

  reset(element) {
    element.classList.remove('disabled');
    // eslint-disable-next-line no-param-reassign
    element.innerHTML = this.normalText;
  }
}

export default CountDown;
