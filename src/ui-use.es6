import './polyfill/promise-polyfill.js';
import './polyfill/fetch-polyfill.js';
import './polyfill/array.js';

import './script/base/polyfill.js';
import util from './script/base/util.js';
import Modal from './script/modal/Modal.js';
import Toast from './script/modal/Toast.js';
import Validator from './script/validator/Validator.js';
import Tab from './script/menu/Tab.js';

const ui = {
  util,
  
  Modal,
  Validator,
  
  Toast,
  Tab
};

// @ts-ignore
window.ui = ui;


export default ui;
