import Util from '../base/util.js';

const doc = document;
const docEle = doc.documentElement;

const defaultMsgs = {
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

const regRule = {
  _rule: /^(.+?)\((.+)\)$/,
  chinese: /^[\u0391-\uFFE5]+$/,
  date: /^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$/,
  email: /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/,
  english: /^[A-Za-z]+$/,
  idCard: /^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/,
  int: /^[1-9][0-9]*$/,
  mobile: /^1[3-9]\d{9}$/,
  number: /^[0-9]+$/,
  qq: /^[1-9]\d{4,}$/,
  weChat: /^[-_a-zA-Z0-9]{4,24}$/,
  url: /[a-zA-z]+:\/\/[^\s]/,
  tel: /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/,
  time: /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/,
  price: /^-?(([1-9]+\d*)|([1-9]\d*.\d{0,2})|(0.\d{0,2})|(0))$/,
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
  phone: /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[579]|15[0-3,5-9]|16[67]|17[0135678]|18[0-9]|19[189])\d{8}$/,
  passport: /^((E|K)[0-9]{8})|(((SE)|(DE)|(PE)|(MA))[0-9]{7})$/,
  ip: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
};

const testReg = {
  is_or({ value, rule }) {
    const rules = rule.value.split(',');
    let valid = false;

    if (value === '') return true;

    rules.forEach(key => {
      if (regRule[key] && regRule[key].test(value)) {
        valid = true;
      }
    });

    return valid;
  },
  
  is_email({ value }) {
    return value ? regRule.email.test(value) : true;
  },

  is_english({ value }) {
    return value ? regRule.english.test(value) : true;
  },

  is_chinese({ value }) {
    return value ? regRule.chinese.test(value) : true;
  },

  is_number({ value }) {
    return value ? regRule.number.test(value) : true;
  },

  is_idCard({ value }) {
    return value ? regRule.idCard.test(value) : true;
  },

  is_int({ value, field }) {
    const { validity } = field.element;
    
    if (validity && validity.badInput) {
      return false;
    }
    
    return value ? regRule.int.test(value) : true;
  },

  is_mobile({ value }) {
    return value ? regRule.mobile.test(value) : true;
  },

  is_price({ value }) {
    return value ? regRule.price.test(value) : true;
  },

  is_qq({ value }) {
    return value ? regRule.qq.test(value) : true;
  },

  is_weChat({ value }) {
    return value ? regRule.weChat.test(value) : true;
  },

  is_tel({ value }) {
    return value ? regRule.tel.test(value) : true;
  },

  is_time({ value }) {
    return value ? regRule.time.test(value) : true;
  },

  is_passport({ value }) {
    return value ? regRule.passport.test(value) : true;
  },

  is_url({ value }) {
    return value ? regRule.url.test(value) : true;
  },

  is_required({ value }) {
    return !!(value && (value !== '') && (value !== undefined));
  },

  is_reg({ value, rule }) {
    const reg = new RegExp(rule.value);
    return value ? reg.test(value) : true;
  },

  is_password({ value }) {
    return value ? regRule.password.test(value) : true;
  },

  is_not({ value, rule }) {
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

  is_max({ value, rule, field }) {
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

  is_min({ value, rule, field }) {
    const { type, element } = field;

    if (type === 'checkbox') {
      let l = this.getCheckedCheckbox(element);

      return l >= rule.value;
    }

    return value ? (value.length >= rule.value) : true;
  },

  is_phone({ value }) {
    return value ? regRule.phone.test(value) : true;
  },

  is_ip({ value }) {
    return value ? regRule.ip.test(value) : true;
  },

  is_remote({ value, rule, field, form }) {
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

  is_same({ value, rule }) {
    /** @type {HTMLInputElement} */
    const ele = doc.querySelector(`[name="${rule.value}"]`);
    const eleValue = ele.value.trim();
    return value === eleValue;
  },

  is_diff({ value, rule, form }) {
    const ele = form.querySelector(`[name="${rule.value}"]`);
    const eleValue = ele.value.trim();

    if (!eleValue.length) {
      return true;
    }

    return value !== eleValue;
  },

  is_gt({ value, rule }) {
    /** @type {HTMLInputElement} */
    const ele = doc.querySelector(`[name="${rule.value}"]`);
    return Number(value) > Number(ele.value);
  },

  is_gte({ value, rule }) {
    /** @type {HTMLInputElement} */
    const ele = doc.querySelector(`[name="${rule.value}"]`);
    return Number(value) >= Number(ele.value);
  },

  // great than number
  is_gtnum({ value, rule }) { 
    if (value !== '') {
      return Number(value) > Number(rule.value);
    }
    return true;
  },

  // great than or equal
  is_gtenum({ value, rule }) { 
    if (value !== '') {
      return Number(value) >= Number(rule.value);
    }
    return true;
  },

  // less than number
  is_ltnum({ value, rule }) { 
    if (value !== '') {
      return Number(value) < Number(rule.value);
    }
    return true;
  },

  // less than or equal
  is_ltenum({ value, rule }) { 
    if (value !== '') {
      return Number(value) <= Number(rule.value);
    }
    return true;
  }
};

class Validator {
  /**
   * @param {*} _selector 
   * @param {*} _fields [{ name, rules, msgs }]
   * @param {*} _settings 
   * @param {*} _callback 
   * @param {*} _errorCallback 
   * 
   * _selector, _callback[, _errorCallback]
   * _selector, _settings, _callback[, _errorCallback]
   * _selector, _fields, _settings, _callback[, _errorCallback]
   */
  constructor(_selector, _fields, _settings, _callback, _errorCallback) {
    let selector = _selector;
    let fields = _fields;
    let settings = _settings;
    let callback = _callback;
    let errorCallback = _errorCallback;

    if (typeof _fields === 'function') {
      callback = _fields;
      errorCallback = _settings;
      fields = null;
      settings = null;
    } else if (typeof _settings === 'function') {
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
      wrapSelector: '.ui-control-wrap',
      validSelector: '.v-item',

      errorClass: 'error',
      successClass: 'success',
      loadClass: 'loading',

      tipElement: 'span',
      tipClass: 'v-error-tip',

      showClass: 'show',

      separator: '|',

      realTime: true,

      shouldFresh: false,

      remoteLoading: false,

      scrollToError: false,

      fetchSuccess(res) {
        return res.code === 200;
      }
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

      this.validAllFields(callback, errorCallback);

      return false;
    });
  }

  /**
   * @param {Function=} callback 
   * @param {Function=} errorCallback 
   */
  validAllFields(callback, errorCallback) {
    const { validSelector, shouldFresh } = this.settings;
    const self = this;
    const elements = this.form.querySelectorAll(validSelector);
    const fieldNameArray = [];

    if (elements) {
      if (shouldFresh) {
        this.fields = {};
      }

      this.initFields(elements);
    }

    this.addResultToFields();
    
    this.valid = true;

    Object.keys(this.fields).every(key => {
      const { valid } = this.fields[key];
      fieldNameArray.push(key);
      if (!valid) {
        this.valid = false;
      }

      return valid;
    });

    this.checkValidResult(0, fieldNameArray, () => {
      self.validCallback(callback, errorCallback);
    });
  }

  /**
   * add valid result to field item
   */
  addResultToFields() {
    const { fields } = this;

    Object.keys(fields).forEach(key => {
      const field = fields[key];
      this.validField(field, 'final');
    });
  }

  /**
   * @param {number} index 
   * @param {Array} arr 
   * @param {Function=} cb 
   */
  checkValidResult(index, arr, cb) {
    const { fields, settings } = this;
    const { fetchSuccess } = settings;
    const self = this;

    if (index >= arr.length) {
      self.valid = true;
      cb();
      return;
    }
    
    const item = fields[arr[index]];

    if (item.remote) {
      item.remote.then(res => {
        if (fetchSuccess(res)) {
          self.checkValidResult(index + 1, arr, cb);
        } else {
          self.valid = false;
          cb();
        }
      });
    } else if (!item.valid) {
      self.valid = false;
      cb();
    } else {
      self.checkValidResult(index + 1, arr, cb);
    }
  }

  /**
   * @param {Function=} callback 
   * @param {Function=} errorCallback 
   */
  validCallback(callback, errorCallback) {
    const { tipClass, showClass, scrollToError } = this.settings;
    const { fields, form } = this;
    const self = this;

    if (self.valid) {
      if (typeof callback === 'function') {
        callback(form, fields);
      }
    } else {
      if (scrollToError) {
        // !!!!!!!!! need rewrite
        const tipElement = doc.querySelector('.' + tipClass + '.' + showClass);

        if (tipElement) {
          const top = (tipElement.getBoundingClientRect().top - 80)
            + (docEle.scrollTop + (document.body.scrollTop || document.documentElement.scrollTop));
          const left = docEle.scrollLeft
            + (document.body.scrollLeft || document.documentElement.scrollLeft);

          // scroll to error tip position
          window.scrollTo(left, top);
        }
      }

      if (typeof errorCallback === 'function') {
        errorCallback(form, fields);
      }
    }
  }

  /**
   * @param {HTMLInputElement|object} element 
   * @param {*} attr 
   * @returns {*} -
   */
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
   * @param {[{name: string, rules: string, msgs: string, fn: *}]} fields
   * */
  addFields(fields) {
    const { validSelector, realTime } = this.settings;
    const { form } = this;

    for (let i = 0, l = fields.length; i < l; i += 1) {
      const field = fields[i];
      const { name, rules: _rules, msgs } = field;
      const element = form[name];

      const fieldItem = {
        /** @type {HTMLElement} */
        element,
        /** @type {string} */
        name,
        /** @type {string} */
        type: element.length > 0 ? (element.type || element[0].type) : element.type,
        /** @type {object} */
        rules: this.rulesToObject(_rules, msgs),
        /** @type {HTMLElement} */
        tip: this.createErrorTip(element),

        value: null,
        checked: null,
        fn: field.fn || null
      };

      this.fields[name] = fieldItem;

      if (!Util.hasClass(element, validSelector.replace('.', ''))) {
        if (realTime) {
          this.addBlurEvent(fieldItem);
          this.addFocusEvent(fieldItem);
        }
      }
    }
  }

  /**
   * create error tip element
   *
   * @param  {*} node - elements
   * @returns {HTMLElement} -
   * */
  createErrorTip(node) {
    let element = (node.length && node.length > 0) ? node[0] : node;
    const { tipElement, wrapSelector, tipClass } = this.settings;
    const parent = element.closest(wrapSelector);
    const addedClass = element.id ? ` v-tip-${element.id}` : '';
    const dataTip = element.getAttribute('data-tip');
    let tip;

    if (dataTip) {
      tip = this.form.querySelector(dataTip);
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
   * @param {NodeList} elements
   */
  initFields(elements) {
    const fields = [];

    [].slice.call(elements).forEach(element => {
      if (!(element.name in this.fields)) {
        /** @type {[{name: string, rules: string, msgs: string }]} */
        const filed = this.addItem(element);
        if (filed) {
          fields.push(filed);
        }
      }
    });

    // @ts-ignore
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
   * @returns {object} result object
   * */
  rulesToObject(rules, msgs) {
    const { separator } = this.settings;
    const rulesArray = rules.split(separator);
    const rulesObject = {};
    const msgArray = msgs ? msgs.split(separator) : '';

    rulesArray.forEach((item, index) => {
      const r = item.match(regRule._rule);
      let ruleName;
      let ruleValue;
      let ruleMsg;

      if (r) {
        ruleName = r[1];
        ruleValue = r[2];
      } else {
        ruleName = item;
      }

      ruleMsg = msgArray[index] || defaultMsgs[ruleName] || 'error';

      rulesObject[ruleName] = {
        value: ruleValue,
        msg: ruleMsg
      };
    });

    return rulesObject;
  }

  /**
   * trigger verify when element loose focus
   *
   * @param {object} field 
   */
  addBlurEvent(field) {
    if (!Validator.isRadioOrCheckbox(field.type)) {
      field.element.addEventListener('blur', () => {
        this.validField(field);
      });
    }
  }

  /**
   * remove error class when element get focus
   *
   * @param {object} field 
   */
  addFocusEvent(field) {
    const { element, tip, type } = field;
    if (Validator.isRadioOrCheckbox(type) && element.length > 1) {
      [].slice.call(element).forEach(item => this.addFocus(item, tip));
    } else {
      this.addFocus(element, tip);
    }
  }

  /**
   * @param {HTMLElement} element 
   * @param {HTMLElement} tip 
   */
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
    const { validSelector } = this.settings;
    const form = this.form;

    Util.on(form, 'focusin change', validSelector, e => {
      const target = e.target;
      const name = target.name;

      if (name in this.fields) {
        const field = this.fields[name];
        this.removeErrorClass(target, field.tip);
      }
    });
  }

  delegateBlur() {
    Util.on(this.form, 'focusout', this.settings.validSelector, (e) => {
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

  /**
   * @function
   * remove error style class
   * @param {HTMLElement} target - form control
   * @param {HTMLElement} tip - error tip element
   * */
  removeErrorClass(target, tip) {
    const { showClass, errorClass, wrapSelector, successClass } = this.settings;
    const tipEle = tip;

    Util.removeClass(target, errorClass);
    Util.removeClass(tip, showClass);

    tipEle.innerText = '';

    if (target.closest && target.closest(wrapSelector)) {
      Util.removeClass(target.closest(wrapSelector), errorClass);
      Util.removeClass(target.closest(wrapSelector), successClass);
    }
  }

  /**
   * @function
   * add loading class [remote]
   * @param {HTMLElement} target - form element
   * */
  addLoadClass(target) {
    const { loadClass, wrapSelector } = this.settings;

    Util.addClass(target, loadClass);

    if (target.closest && target.closest(wrapSelector)) {
      Util.addClass(target.closest(wrapSelector), loadClass);
    }
  }

  /**
   * @function
   * remove loading class [remote]
   * @param {HTMLElement} target - form element
   * */
  removeLoadClass(target) {
    const { loadClass, wrapSelector } = this.settings;

    Util.removeClass(target, loadClass);

    if (target.closest && target.closest(wrapSelector)) {
      Util.removeClass(target.closest(wrapSelector), loadClass);
    }
  }

  /**
   * @function
   * verify single filed [单个表单元素可能含有多个验证项]
   * @param {{
   *  element: HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement,  
   *  tip: HTMLElement,
   *  rules: object, name: string, type: string, value: string|boolean, 
   *  checked: boolean|string, remote: *, remoteOk: boolean, valid: boolean,
   *  fn: *
   * }} fieldItem
   * @param {string=} state
   * */
  validField(fieldItem, state = '') {
    const field = fieldItem;
    const { form, settings } = this;
    const { element, rules, tip, type } = field;
    const { remoteLoading, fetchSuccess } = settings;

    field.checked = Validator.getAttrChecked(element, 'checked');
    field.value = Validator.isRadioOrCheckbox(type) ? field.checked : element.value;
    let _value = field.value;

    Object.keys(rules).every((key) => {
      const rule = rules[key];
      let value = typeof _value === 'string' ? _value.trim() : _value;
      
      if ((key === 'remote') && (state === 'final') && (field.remote && field.remoteOk)) {
        return false;
      }

      if (element.hasAttribute('disabled')) {
        field.valid = true;
        return false;
      }

      const validResult = testReg[`is_${key}`]({ value, rule, key, field, form });

      if (typeof validResult === 'boolean') {
        if (!validResult) {
          this.showErrorTip(element, rule.msg, tip);
          field.valid = false;
          this.removeSuccessTip(element);
          return false;
        }

        this.showSuccessTip(element);
      } else if (key === 'remote') {
        if (remoteLoading) {
          this.addLoadClass(element);
        }

        field.valid = true;
        field.remote = validResult;
        field.remoteOk = false;

        validResult.then(res => {
          if (remoteLoading) {
            this.removeLoadClass(element);
          }

          if (fetchSuccess(res)) {
            field.valid = true;
            this.showSuccessTip(element);
          } else {
            field.valid = false;
            this.showErrorTip(element, res.msg || rule.msg, tip);
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
   * @param {HTMLElement} element - form element
   * @param {string} message - error message
   * @param {HTMLElement=} tip - error tip element
   * */
  showErrorTip(element, message, tip) {
    const { errorClass, wrapSelector, tipClass } = this.settings;
    let tipElement = tip;
    let _ele = element;

    if (typeof element === 'string') {
      /** @type {HTMLElement} */
      _ele = this.form[element];
    }

    if (!tip && _ele.closest) {
      tipElement = _ele.closest(wrapSelector).querySelector('.' + tipClass);
    }

    tipElement.innerHTML = message;
    Util.addClass(tipElement, 'show');
    Util.addClass(_ele, errorClass);

    if (_ele.closest && _ele.closest(wrapSelector)) {
      Util.addClass(_ele.closest(wrapSelector), errorClass);
    }
  }

  showSuccessTip(element) {
    const { successClass, wrapSelector } = this.settings;
    if (element.closest && element.closest(wrapSelector)) {
      Util.addClass(element.closest(wrapSelector), successClass);
    }
  }

  removeSuccessTip(element) {
    const { successClass, wrapSelector } = this.settings;
    if (element.closest && element.closest(wrapSelector)) {
      Util.removeClass(element.closest(wrapSelector), successClass);
    }
  }

  destroy() {
    this.form = null;
    this.fields = null;
  }

  /**
   * @param {string} fieldName 
   */
  cleanTip(fieldName) {
    const field = this.fields[fieldName];
    if (field) {
      let element = field.element;
      if (element.length) {
        element = field.element[0];
      }
      this.removeErrorClass(element, field.tip);
    }
  }

  /**
   * @param {string=} fieldName 
   */
  cleanTips(fieldName) {
    const { fields } = this;

    if (fieldName) {
      this.cleanTip(fieldName);
      return;
    }
    
    Object.keys(fields).forEach(name => {
      this.cleanTip(name);
    });
  }
}

export default Validator;

