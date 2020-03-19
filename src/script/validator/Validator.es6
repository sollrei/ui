import Util from '../base/util.es6';

const doc = document;
const docEle = doc.documentElement;
const body = doc.body;

const defaultSettings = {
  chinese: '请填写中文',
  date: '日期格式不正确',
  email: '邮箱格式不正确',
  english: '请填写字母',
  IDcard: '身份证号格式不正确',
  mobile: '手机号格式不正确',
  number: '请填写数字',
  phone: '手机号格式不正确',
  qq: 'qq格式不正确',
  weChat: '微信格式不正确',
  tel: '电话号码格式不正确',
  time: '时间格式不正确',
  url: '地址格式不正确',
  required: '请填写该项',
  int: '请填写不为0的正整数'
};

const regs = {
  rule: /^(.+?)\((.+)\)$/,
  chinese: /^[\u0391-\uFFE5]+$/,
  // date: /^[0-9]{4}((0[1-9])|(10|11|12))((0[1-9])|(2[0-9])|(30|31))$/,
  date: /^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$/,
  /**
   * @description 邮箱规则
   * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
   * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
   * 3.@符号是必填项
   * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
   * 5.邮件提供商域可以包含特殊字符-、_、.
   */
  email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
  english: /^[A-Za-z]+$/,
  IDcard: /^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/,
  int: /^[1-9][0-9]*/,
  /**
   * @description phone 简化版
   * */
  mobile: /^1[3-9]\d{9}$/,
  number: /^[0-9]+$/,
  qq: /^[1-9]\d{4,}$/,
  weChat: /^[-_a-zA-Z0-9]{4,24}$/,
  url: /[a-zA-z]+:\/\/[^\s]/,
  tel: /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/,
  time: /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/,
  price: /^-?(([1-9]+\d*)|([1-9]\d*.\d{0,2})|(0.\d{0,2})|(0))$/,
  /**
   *@description
   * 130、131、132、133、134、135、136、137、138、139
   * 145、147
   * 150、151、152、153、155、156、157、158、159
   * 166 167
   * 170、176、177、178
   * 180、181、182、183、184、185、186、187、188、189
   * 198 199 191 
   * 国际码 如：中国(+86)
   */
  phone: /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[579]|15[0-3,5-9]|16[67]|17[0135678]|18[0-9]|19[189])\d{8}$/
};

const testReg = {
  is_email(value) {
    return value ? regs.email.test(value) : true;
  },

  is_english(value) {
    return value ? regs.english.test(value) : true;
  },

  is_chinese(value) {
    return value ? regs.chinese.test(value) : true;
  },

  is_number(value) {
    return value ? regs.number.test(value) : true;
  },

  is_IDcard(value) {
    return value ? regs.IDcard.test(value) : true;
  },

  is_int(value) {
    return value ? regs.int.test(value) : true;
  },

  is_mobile(value) {
    return value ? regs.mobile.test(value) : true;
  },

  is_price(value) {
    return value ? regs.price.test(value) : true;
  },

  is_qq(value) {
    return value ? regs.qq.test(value) : true;
  },

  is_weChat(value) {
    return value ? regs.weChat.test(value) : true;
  },

  is_tel(value) {
    return value ? regs.tel.test(value) : true;
  },

  is_time(value) {
    return value ? regs.time.test(value) : true;
  },

  is_url(value) {
    return value ? regs.url.test(value) : true;
  },

  is_required(value) {
    return !!(value && (value !== '') && (value !== undefined));
  },

  is_reg(value, rule) {
    const reg = new RegExp(rule.value);
    return value ? reg.test(value) : true;
  },

  is_not(value, rule) {
    return value !== rule.value;
  },

  getCheckedCheckbox(element) {
    let cl = 0;

    [].slice.call(element).forEach(item => {
      if (item.checked) {
        cl += 1;
      }
    });

    return cl;
  },

  is_maxlength(value, rule, name, field) {
    const { type, element } = field;
    const max = rule.value;

    if (type === 'checkbox') {
      let cl = this.getCheckedCheckbox(element);

      return cl <= max;
    }

    if (value) {
      const l = value.length;
      return l <= max;
    }
    return true;
  },

  is_minlength(value, rule, name, field) {
    const { type, element } = field;

    if (type === 'checkbox') {
      let l = this.getCheckedCheckbox(element);

      return l >= rule.value;
    }

    return value ? (value.length >= rule.value) : false;
  },

  is_phone(value) {
    return value ? regs.phone.test(value) : true;
  },

  is_remote(value, rule, name, field) {
    const url = rule.value;

    if (value) {
      return Util.fetchData(url, {
        [field.element.name]: value
      });
    }
    return false;
  },

  is_same(value, rule) {
    const ele = doc.querySelector(`[name="${rule.value}"]`);
    const eleValue = ele.value.trim();
    return value === eleValue;
  },

  is_gt(value, rule) {
    const ele = doc.querySelector(`[name="${rule.value}"]`);
    return Number(value) > Number(ele.value);
  },

  is_gtnum(value, rule) {
    return Number(value) > Number(rule.value);
  },

  is_gte(value, rule) {
    const ele = doc.querySelector(`[name="${rule.value}"]`);
    return Number(value) >= Number(ele.value);
  }
};

class Validator {
  constructor(_selector, _fields, _settings, _callback) {
    let selector = _selector;
    let fields = _fields;
    let settings = _settings;
    let callback = _callback;

    if (arguments.length === 2 && typeof _fields === 'function') {
      callback = _fields;
      fields = null;
      settings = null;
    }

    if (arguments.length === 3 && typeof _settings === 'function') {
      callback = _settings;
      fields = null;
      settings = _fields;
    }

    if (typeof selector !== 'string') {
      return;
    }

    const form = doc.querySelector(selector);

    if (!form) {
      return;
    }

    const options = {
      wrapClass: '.ui-control-wrap',

      validClass: '.v-item',

      errorClass: 'error',
      loadClass: 'loading',

      tipElement: 'span',
      tipClass: 'v-error-tip',

      showClass: 'show',

      shouldFresh: false,

      scrollToError: true
    };

    this.settings = Object.assign({}, options, settings);
    this.fields = {};

    this.form = form;

    if (fields) {
      this.addFields(fields);
    }

    this.delegateBlur();
    this.delegateFocus();

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const {
        validClass, tipClass, showClass, shouldFresh 
      } = this.settings;

      const items = this.form.querySelectorAll(validClass);
      if (items) {
        if (shouldFresh) {
          this.fields = {};
        }

        this.addItems(items);
      }

      this.validForm();

      let valid = true;

      Object.keys(this.fields).every(key => {
        let item = this.fields[key];
        if (!item.valid) {
          valid = false;
        }
        return item.valid;
      });
      // this.fields.forEach((item) => {
      //   if (!item.valid) {
      //     valid = false;
      //   }
      //   return item.valid;
      // });

      if (valid) {
        if (typeof callback === 'function') {
          callback();
          return false;
        }
      } else {
        if (this.settings.scrollToError) {
          const tipElement = doc.querySelector('.' + tipClass + '.' + showClass);

          if (tipElement) {
            const top = (tipElement.getBoundingClientRect().top - 80)
              + (docEle.scrollTop + body.scrollTop);
            const left = docEle.scrollLeft + body.scrollLeft;

            // scroll to error tip position
            window.scrollTo(left, top);
          }
        }

        return false;
      }
      return false;
    });
  }

  static getAttrChecked(element, attr) {
    if (element.length > 0 && Validator.isRadioOrCheckbox(element[0].type)) {
      for (let i = 0, l = element.length; i < l; i += 1) {
        if (element[i].checked) {
          return element[i][attr];
        }
      }
      return false;
    }
    return element[attr];
  }

  // check if element is 'radio' or 'checkbox'
  static isRadioOrCheckbox(type) {
    return type === 'radio' || type === 'checkbox';
  }

  /**
   * @method
   * @param {Array} fields
   * [{
   *   name,   // element [name]
   *   rules,  // valid rule
   *   msgs    // error message
   * }]
   * */
  addFields(fields) {
    const { validClass } = this.settings;
    for (let i = 0, l = fields.length; i < l; i += 1) {
      const field = fields[i];
      const name = field.name;
      const rules = Validator.rulesToObject(field.rules, field.msgs);
      const element = this.form[name];
      const type = element.length > 0 ? (element.type || element[0].type) : element.type;
      const tip = this.createErrorTip(element);
      const fieldItem = {
        element,
        name,
        type,
        rules,
        tip,
        value: null,
        checked: null,
        fn: field.fn || null
      };

      this.fields[name] = fieldItem;

      if (!Util.hasClass(element, validClass.replace('.', ''))) {
        this.addBlurEvent(fieldItem);
        this.addFocusEvent(fieldItem);
      }
    }
  }

  /**
   * @method
   * create error tip element
   * @param  {Node|NodeList} [node] - elements
   * @returns {Node}
   * */
  createErrorTip(node) {
    let element = node.length > 1 ? node[0] : node;
    const { tipElement, wrapClass, tipClass } = this.settings;
    const parent = element.closest(wrapClass);
    const addedClass = element.id ? ` v-tip-${element.id}` : '';

    let tip;

    if (element.getAttribute('data-tip')) {
      tip = document.querySelector(element.getAttribute('data-tip'));

      return tip;
    } else if (parent.querySelector(`.${tipClass}`)) {
      tip = parent.querySelector(`.${tipClass}`);

      return tip;
    }

    // create new tip element
    tip = doc.createElement(tipElement);
    tip.className = `${tipClass}${addedClass}`;

    return parent.appendChild(tip);
  }

  /**
   * @method
   * get rule and msg from element node
   * @param  {NodeList} items nodeList of form item
   * */
  addItems(items) {
    const fields = [];

    [].slice.call(items).forEach(element => {
      if (!(element.name in this.fields)) {
        const filed = this.addItem(element);
        if (filed) {
          fields.push(filed);
        }
      }
    });

    this.addFields(fields);
  }

  /**
   * @static
   * get name & rules & error messages from form element
   * @param {HTMLFormElement} element
   * @returns {Object|Boolean} field or nothing
   * */
  addItem(element) {
    const name = element.name;
    const elements = this.form[name];
    let ele = elements;

    if (elements.length > 0) {
      // select radio checkbox
      if (Validator.isRadioOrCheckbox(elements[0].type)) {
        ele = elements[0];
      }
    }

    const rules = ele.getAttribute('data-rules');
    const msgs = ele.getAttribute('data-msgs') || '';

    return (name && rules) ? { name, rules, msgs } : false;
  }

  /**
   * @method
   * @param {string} rules [form item valid rule]
   * @param {string} msgs  [error message]
   * @returns {object}
   * */
  static rulesToObject(rules, msgs) {
    const rulesArray = rules.split('|');
    const rulesObject = {};
    const msgArray = msgs ? msgs.split('|') : '';

    rulesArray.forEach((item, index) => {
      const r = item.match(regs.rule);
      let ruleName;
      let ruleValue;
      let ruleMsg;

      if (r) {
        ruleName = r[1];
        ruleValue = r[2];
      } else {
        ruleName = item;
      }

      ruleMsg = msgArray[index] || defaultSettings[ruleName] || '';

      rulesObject[ruleName] = {
        value: ruleValue,
        msg: ruleMsg
      };
    });

    return rulesObject;
  }

  // trigger verify when element loose focus
  addBlurEvent(field) {
    if (!Validator.isRadioOrCheckbox(field.type)) {
      field.element.addEventListener('blur', () => {
        this.validField(field);
      });
    }
  }

  // remove error class when element get focus
  addFocusEvent(field) {
    const { element, tip, type } = field;
    if (Validator.isRadioOrCheckbox(type) && element.length > 1) {
      [].slice.call(element).forEach(item => this.addFocus(item, tip));
    } else {
      this.addFocus(element, tip);
    }
  }

  addFocus(element, tip) {
    const self = this;
    element.addEventListener('focus', function () {
      self.removeErrorClass(this, tip);
    });
  }

  /**
   * @method
   * delegate event
   * - focusin for normal form elements
   * - change for hidden form elements
   * */
  delegateFocus() {
    const { validClass } = this.settings;
    const form = this.form;
    Util.on(form, 'focusin change', validClass, e => {
      const target = e.target;
      const name = target.name;
      // if (_.has(this.fields, name)) {
      if (name in this.fields) {
        const field = this.fields[name];
        this.removeErrorClass(target, field.tip);
      }
    });
  }

  /**
   * @method
   * remove error style class
   * @param {HTMLElement} target - form element
   * @param {HTMLElement} tip - error tip element
   * */
  removeErrorClass(target, tip) {
    const { showClass, errorClass } = this.settings;
    const tipEle = tip;

    Util.removeClass(target, errorClass);
    Util.removeClass(tip, showClass);
    tipEle.innerText = '';
  }

  // delegate focusout event
  delegateBlur() {
    Util.on(this.form, 'focusout', this.settings.validClass, (e) => {
      const target = e.target;
      const name = target.name;
      // if (!_.has(this.fields, name)) {
      if (!(name in this.fields)) {
        const item = this.addItem(target);
        this.addFields([item]);
      }
      const field = this.fields[name];
      if (!Validator.isRadioOrCheckbox(field.type)) {
        this.validField(field);
      }
    });
  }

  validForm() {
    for (let i in this.fields) {
      if (Object.hasOwnProperty.call(this.fields, i)) {
        const field = this.fields[i];
        this.validField(field, 'final');
      }
    }
    // this.fields.forEach((field) => {
    //   this.validField(field, 'final');
    // });
  }

  /**
   * @method
   * verify single filed
   * @param {object} fieldItem
   * @param {String} type
   * {
        element,
        name,
        type,
        rules,
        tip,
        value,
        checked
      }
   * */
  validField(fieldItem, type = '') {
    const field = fieldItem;
    const { element, rules, tip } = field;
    const loadClass = this.settings.loadClass;

    // for 'checkbox' and 'radio'
    field.checked = Validator.getAttrChecked(element, 'checked');
    field.value = Validator.isRadioOrCheckbox(field.type) ? field.checked : element.value;

    Object.keys(rules).every((key) => {
      const rule = rules[key];
      const value = field.value.trim ? field.value.trim() : field.value;

      if ((key === 'remote') && (type === 'final')) {
        return false;
      }

      const validResult = testReg[`is_${key}`](value, rule, key, field);

      if (typeof validResult === 'boolean') {
        if (!validResult) {
          this.showErrorTip(element, tip, rule.msg);
          field.valid = false;
          return false;
        }
      } else if (key === 'remote') {
        Util.addClass(element, loadClass);

        field.valid = false;

        validResult.then(res => {
          Util.removeClass(element, loadClass);
          if (res.status) {
            field.valid = true;
          } else {
            this.showErrorTip(element, tip, rule.msg || res.msg);
          }
        });

        return false;
      }

      field.valid = true;
      return true;
    });

    // _.forEach(rules, (rule, key) => {
    //   const value = field.value.trim ? field.value.trim() : field.value;

    //   if ((key === 'remote') && (type === 'final')) {
    //     return false;
    //   }

    //   const validResult = testReg[`is_${key}`](value, rule, key, field);

    //   if (typeof validResult === 'boolean') {
    //     if (!validResult) {
    //       this.showErrorTip(element, tip, rule.msg);
    //       field.valid = false;
    //       return false;
    //     }
    //   } else if (key === 'remote') {
    //     Util.addClass(element, loadClass);

    //     field.valid = false;

    //     validResult.then(res => {
    //       Util.removeClass(element, loadClass);
    //       if (res.status) {
    //         field.valid = true;
    //       } else {
    //         this.showErrorTip(element, tip, rule.msg || res.msg);
    //       }
    //     });

    //     return false;
    //   }

    //   field.valid = true;
    //   return true;
    // });

    if (field.fn && (typeof field.fn === 'function')) {
      field.fn(this, field);
    }
  }

  /**
   * @method
   * show error tip element
   * @param {HTMLFormElement} element - form element
   * @param {HTMLElement} tip - error tip element
   * @param {String} message - error message
   * */
  showErrorTip(element, tip, message) {
    const tipElement = tip;
    tipElement.innerHTML = message;
    Util.addClass(tipElement, 'show');
    Util.addClass(element, this.settings.errorClass);
  }
}

export default Validator;

