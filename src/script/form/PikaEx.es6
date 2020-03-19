import u from '../base/util.es6';

class PikaEx {
  constructor(selector, options, selectData, Pikaday) {
    const defaultSettings = {
      valueInput: '1',
      checkLabel: '到达时自动执行活动',
      checkValue: '2020-01-01'
    };

    this.selectData = selectData;
    this.settings = Object.assign({}, defaultSettings, options);

    this.pikaday = new Pikaday({
      i18n: {
        previousMonth: '<',
        nextMonth: '>',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weekdays: ['日', '一', '二', '三', '四', '五', '六'],
        weekdaysShort: ['日', '一', '二', '三', '四', '五', '六']
      },
      onSelect: (date) => {
        this.changeValue(date);
      }
    });

    this.init(selector);
    this.events();
  }

  init(selector) {
    if (typeof selector === 'string') {
      this.element = document.querySelector(selector);
    }

    if (typeof selector === 'object') {
      this.element = selector;
    }

    if (!this.element) return;
    
    this.value = null;

    this.createDom();
  }

  createDom() {
    const content = this.createContent();

    const div = u.createElement('div', { className: 'ui-pika' }, content);
    const parent = this.element.closest('.ui-control-wrap');

    this.piker = parent.appendChild(div);
    this.piker.hide = this.hide.bind(this.piker, this.element);
    
    this.piker.querySelector('.pika-container').appendChild(this.pikaday.el);

    this.select = this.piker.querySelector('.option-select');
    this.empty = this.piker.querySelector('.option-empty');
    this.checkbox = this.piker.querySelector('input');

    this.resetSelectPosition();
  }

  createContent() {
    const { selectData } = this;
    const { checkLabel, checkValue } = this.settings;

    const check = PikaEx.createCheckRow(checkLabel, checkValue);
    const empty = PikaEx.createEmptyRow();
    const select = PikaEx.createSelect('指定活动结束后开始', selectData);
    return '<div class="pika-container"></div>' + check + select + empty;
  }

  static createSelect(label, data) {
    return `<div class="option-row option-select">
              <div class="select-label">${label}</div>
              <div class="select-dropdown">
                <div class="ui-menu">
                  <ul>` 
              + data.reduce((pre, cur) => {
                const { label: name, value } = cur;
                const date = PikaEx.getDateValue(value);
                return pre + `<li class="menu-item" data-value="${date}">${name}</li>`;
              }, '')
    + '</ul></div></div></div>';
  }

  static createCheckRow(label, value) {
    const date = PikaEx.getDateValue(value);
    return `<div class="option-row option-check"><label class="ui-checkbox"><input type="checkbox" class="pika-check" value="${date}"/><i class="iconfont"></i><span>${label}</span></label></div>`;
  }

  static createEmptyRow() {
    return '<div class="option-row option-empty menu-item">无</div>';
  }

  resetSelectPosition() {
    const { piker, select } = this;
    const drop = select.querySelector('.select-dropdown');
    const listHeight = drop.getBoundingClientRect().height;
    const pikerHeight = piker.getBoundingClientRect().height;
    const selectTop = select.offsetTop;
    const selectBottom = pikerHeight - selectTop;

    if (listHeight > pikerHeight) {
      drop.style.top = '0';
    } else if (listHeight <= selectBottom) {
      drop.style.top = selectTop + 'px';
    } else {
      drop.style.bottom = '0';
    }
  }

  hide(element) {
    if (u.hasClass(this, 'show')) {
      u.removeClass(this, 'show');
      u.removeClass(element, 'active');
    }
  }

  show() {
    u.addClass(this.element, 'active');
    u.addClass(this.piker, 'show');
    const { value } = this;

    if (value) {
      this.pikaday.setDate(value, true);
    }
  }

  static formatDate(date) {
    return new Date(+new Date(date) + (8 * 3600 * 1000)).toISOString().slice(0, 10);
  }

  static getDateValue(date) {
    if (date instanceof Date) {
      return PikaEx.formatDate(date);
    }
    if (typeof date === 'string') {
      return date;
    }

    if (typeof date === 'number') {
      return PikaEx.formatDate(date);
    }

    return '';
  }

  changeValue(element) {
    const { checkbox, piker } = this;

    u.removeClass(piker.querySelector('.selected'), 'selected');

    if (element instanceof Date) {
      this.value = PikaEx.formatDate(element);
      checkbox.checked = false;
    } else if (element === checkbox) {
      this.value = element.checked ? PikaEx.getDateValue(element.value) : '';
    } else if (u.hasClass(element, 'menu-item')) {
      u.addClass(element, 'selected');
      checkbox.checked = false;
      this.value = element.getAttribute('data-value');
    }
    
    this.element.value = this.value;
    this.hide();
  }

  events() {
    const self = this;
    const { element, piker, select } = this;

    element.addEventListener('click', function (e) {
      if (u.hasClass(piker, 'show')) {
        piker.hide();
      } else {
        self.show();
      }
      e.stopPropagation();
    });

    u.on(piker, 'click', '.menu-item', function () {
      self.changeValue(this);
    });

    u.on(piker, 'change', '.pika-check', function () {
      self.changeValue(this);
    });

    let timer = null;
    select.addEventListener('mouseenter', function () {
      clearTimeout(timer);
      u.addClass(this, 'show');
    });

    select.querySelector('.select-label').addEventListener('click', function (e) {
      e.stopPropagation();
    });

    u.on(piker, 'click', '.pika-container', function (e) {
      e.stopPropagation();
    });

    select.addEventListener('mouseleave', function () {
      timer = setTimeout(() => {
        u.removeClass(this, 'show');
      }, 400);
    });
  }
}

document.body.addEventListener('click', function () {
  const pika = document.querySelectorAll('.ui-pika');

  u.forEach(pika, item => {
    item.hide();
  });
});

export default PikaEx;
