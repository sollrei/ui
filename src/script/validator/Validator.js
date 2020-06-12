import Util from '../base/util.js';

const doc = document;
const docEle = doc.documentElement;
const body = doc.body;

const defaultSettings = {
  chinese: '请填写中文',
  date: '日期格式不正确',
  email: '邮箱格式不正确',
  english: '请填写字母',
  idCard: '身份证号格式不正确',
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
  date: /^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$/,
  /**
   * @description 邮箱规则
   * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
   * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
   * 3.@符号是必填项
   * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
   * 5.邮件提供商域可以包含特殊字符-、_、.
   */
  email: /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/,
  english: /^[A-Za-z]+$/,
  idCard: /^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/,
  int: /^[1-9][0-9]*$/,
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
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
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
   * 防止跟不上运营商开新数字，可以考虑使用mobile验证
   */
  phone: /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[579]|15[0-3,5-9]|16[67]|17[0135678]|18[0-9]|19[189])\d{8}$/,
  passport: /^((E|K)[0-9]{8})|(((SE)|(DE)|(PE)|(MA))[0-9]{7})$/
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

  is_idCard(value) {
    return value ? regs.idCard.test(value) : true;
  },

  is_int(value, rule, key, field) {
    if (field.element.validity && field.element.validity.badInput) {
      return false;
    }
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

  is_passport(value) {
    return value ? regs.passport.test(value) : true;
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

  is_password(value) {
    return value ? regs.password.test(value) : true;
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

  is_max(value, rule, name, field) {
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

  is_min(value, rule, name, field) {
    const { type, element } = field;

    if (type === 'checkbox') {
      let l = this.getCheckedCheckbox(element);

      return l >= rule.value;
    }

    return value ? (value.length >= rule.value) : true;
  },

  is_phone(value) {
    return value ? regs.phone.test(value) : true;
  },

  is_remote(value, rule, name, field, form) {
    let url = rule.value;
    let urlArr = url.split(',');
    let data = {};

    if (urlArr.length > 1) {
      url = urlArr.shift();
      let hasValue = true;
      urlArr.forEach(item => {
        const [itm, itemName, inputName] = item.replace(' ', '').match(/^(\S*)\[(\S*)\]$/);
        const _value = form.querySelector(`[name="${inputName}"]`).value;
        data[itemName] = _value;
        if (!_value.length) {
          hasValue = false;
        }
      });

      if (!hasValue) {
        return false;
      }
    }
    
    const last = url.charAt(url.length - 1);

    if (value) {
      if (last === '=') {
        return Util.fetchData(url + value, data);
      }
      return Util.fetchData(url, Object.assign({}, data, {
        [field.element.name]: value
      }));
    }
    return false;
  },

  is_same(value, rule) {
    const ele = doc.querySelector(`[name="${rule.value}"]`);
    const eleValue = ele.value.trim();
    return value === eleValue;
  },

  is_diff(value, rule, key, field, form) {
    const ele = form.querySelector(`[name="${rule.value}"]`);
    const eleValue = ele.value.trim();
    return value !== eleValue;
  },

  is_gt(value, rule) {
    const ele = doc.querySelector(`[name="${rule.value}"]`);
    return Number(value) > Number(ele.value);
  },

  is_gte(value, rule) {
    const ele = doc.querySelector(`[name="${rule.value}"]`);
    return Number(value) >= Number(ele.value);
  },

  is_gtnum(value, rule) { // great than number
    if (value !== '') {
      return Number(value) > Number(rule.value);
    }
    return true;
  },

  is_gtenum(value, rule) { // great than or equal
    if (value !== '') {
      return Number(value) >= Number(rule.value);
    }
    return true;
  },

  is_ltnum(value, rule) { // less than number
    if (value !== '') {
      return Number(value) < Number(rule.value);
    }
    return true;
  },

  is_ltenum(value, rule) { // less than or equal
    if (value !== '') {
      return Number(value) <= Number(rule.value);
    }
    return true;
  }
};

class Validator {
  constructor(_selector, _fields, _settings, _callback, _errorCallback) {
    let selector = _selector;
    let fields = _fields;
    let settings = _settings;
    let callback = _callback;
    let errorCallback = _errorCallback;

    if (typeof _fields === 'function') { // (selector, callback, ..)
      callback = _fields;
      errorCallback = _settings;
      fields = null;
      settings = null;
    } else if (typeof _settings === 'function') { // (selector, setting, callback, ..)
      callback = _settings;
      errorCallback = _callback;
      fields = null;
      settings = _fields;
    }

    let form = selector;

    if (typeof selector === 'string') {
      form = doc.querySelector(selector);
    }

    if (!form) {
      return;
    }

    const options = {
      wrapClass: '.ui-control-wrap',

      validClass: '.v-item',

      errorClass: 'error',
      successClass: 'success',
      loadClass: 'loading',

      tipElement: 'span',
      tipClass: 'v-error-tip',

      showClass: 'show',

      realTime: true,

      shouldFresh: false,

      scrollToError: false
    };

    this.settings = Object.assign({}, options, settings);

    this.fields = {};

    this.form = form;

    if (fields) {
      this.addFields(fields);
    }

    if (this.settings.realTime) {
      this.delegateBlur();
    }
    
    this.delegateFocus();

    this.form.addEventListener('submit', e => {
      e.preventDefault();

      this.validAllFiles(callback, errorCallback);

      return false;
    });
  }

  validAllFiles(callback, errorCallback) {
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
    let arr = [];

    Object.keys(this.fields).every(key => {
      arr.push(key);
      let item = this.fields[key];
      if (!item.valid) {
        valid = false;
      }
      return item.valid;
    });

    const { fields: __fields, form: __form, settings: __settings } = this;

    /**
     *
     */
    function cb() {
      if (valid) {
        if (typeof callback === 'function') {
          callback(__form, __fields);
        }
      } else {
        if (__settings.scrollToError) {
          const tipElement = doc.querySelector('.' + tipClass + '.' + showClass);

          if (tipElement) {
            const top = (tipElement.getBoundingClientRect().top - 80)
              + (docEle.scrollTop + body.scrollTop);
            const left = docEle.scrollLeft + body.scrollLeft;

            // scroll to error tip position
            window.scrollTo(left, top);
          }
        }

        if (typeof errorCallback === 'function') {
          errorCallback(__form, __fields);
        }
      }
    }
    
    /**
     * @param index
     */
    function checkValid(index) {
      if (index >= arr.length) {
        valid = true;
        cb();
        return;
      }
      const item = __fields[arr[index]];
      if (item.remote) {
        item.remote.then(res => {
          if (res.code === 200) {
            checkValid(index + 1);
          } else {
            valid = false;
            cb();
          }
        });
      } else if (!item.valid) {
        valid = false;
        cb();
      } else {
        checkValid(index + 1);
      }
    }
    
    checkValid(0);
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
   * @function
   * @param {Array} fields
   * [{
   *   name,   // element [name]
   *   rules,  // valid rule
   *   msgs    // error message
   * }]
   * */
  addFields(fields) {
    const { validClass, realTime } = this.settings;
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
        if (realTime) {
          this.addBlurEvent(fieldItem);
          this.addFocusEvent(fieldItem);
        }
      }
    }
  }

  /**
   * @function
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
   * @function
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
   * @param {HTMLFormElement} element
   * @returns {object|boolean} field or nothing
   */
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
   * @function
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
   * @function
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
   * @function
   * remove error style class
   * @param {HTMLElement} target - form element
   * @param {HTMLElement} tip - error tip element
   * */
  removeErrorClass(target, tip) {
    const { showClass, errorClass, wrapClass, successClass } = this.settings;
    const tipEle = tip;

    Util.removeClass(target, errorClass);
    Util.removeClass(tip, showClass);
    tipEle.innerText = '';

    if (target.closest && target.closest(wrapClass)) {
      Util.removeClass(target.closest(wrapClass), errorClass);
      Util.removeClass(target.closest(wrapClass), successClass);
    }
  }

  /**
   * @function
   * add loading class for remote item
   * @param {HTMLElement} target - form element
   * */
  addLoadClass(target) {
    const { loadClass, wrapClass } = this.settings;

    Util.addClass(target, loadClass);

    if (target.closest && target.closest(wrapClass)) {
      Util.addClass(target.closest(wrapClass), loadClass);
    }
  }

  /**
   * @function
   * remove loading class for remote item
   * @param {HTMLElement} target - form element
   * */
  removeLoadClass(target) {
    const { loadClass, wrapClass } = this.settings;

    Util.removeClass(target, loadClass);

    if (target.closest && target.closest(wrapClass)) {
      Util.removeClass(target.closest(wrapClass), loadClass);
    }
  }

  // delegate focusout event
  delegateBlur() {
    Util.on(this.form, 'focusout', this.settings.validClass, (e) => {
      if (this.fields === null) return;
      const target = e.target;
      const name = target.name;
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
    const arr = [];
    for (let i in this.fields) {
      if (Object.hasOwnProperty.call(this.fields, i)) {
        arr.push(i);
        const field = this.fields[i];
        this.validField(field, 'final');
      }
    }
  }

  /**
   * @function
   * verify single filed
   * @param {object} fieldItem
   * @param {string} type
   * {
        element,
        name,
        type,
        rules,
        tip,
        value,
        checked,
        remote,
        remoteOk
      }
   * */
  validField(fieldItem, type = '') {
    const field = fieldItem;
    const { element, rules, tip } = field;

    // for 'checkbox' and 'radio'
    field.checked = Validator.getAttrChecked(element, 'checked');
    field.value = Validator.isRadioOrCheckbox(field.type) ? field.checked : element.value;

    Object.keys(rules).every((key) => {
      const rule = rules[key];
      const value = field.value.trim ? field.value.trim() : field.value;

      if ((key === 'remote') && (type === 'final') && (field.remote && field.remoteOk)) {
        return false;
      }

      const validResult = testReg[`is_${key}`](value, rule, key, field, this.form);

      if (typeof validResult === 'boolean') {
        if (!validResult) {
          this.showErrorTip(element, tip, rule.msg);
          field.valid = false;
          return false;
        }
      } else if (key === 'remote') {
        // self.addLoadClass(element);

        field.valid = true;
        field.remote = validResult;
        field.remoteOk = false;

        validResult.then(res => {
          // self.removeLoadClass(element);

          if (res.code === 200) {
            field.valid = true;
            this.showSuccessTip(element);
          } else {
            field.valid = false;
            this.showErrorTip(element, tip, res.msg || rule.msg);
          }
          
          field.remoteOk = true;
        });

        return true;
      }

      field.valid = true;
      return true;
    });

    if (field.fn && (typeof field.fn === 'function')) {
      field.fn(this, field);
    }
  }

  /**
   * @function
   * show error tip element
   * @param {HTMLFormElement} element - form element
   * @param {HTMLElement} tip - error tip element
   * @param {string} message - error message
   * */
  showErrorTip(element, tip, message) {
    const { errorClass, wrapClass } = this.settings;
    const tipElement = tip;
    tipElement.innerHTML = message;
    Util.addClass(tipElement, 'show');
    Util.addClass(element, errorClass);

    if (element.closest && element.closest(wrapClass)) {
      Util.addClass(element.closest(wrapClass), errorClass);
    }
  }

  showSuccessTip(element) {
    const { successClass, wrapClass } = this.settings;
    if (element.closest && element.closest(wrapClass)) {
      Util.addClass(element.closest(wrapClass), successClass);
    }
  }

  destroy() {
    this.form = null;
    this.fields = null;
  }
}

export default Validator;

