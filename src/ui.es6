import './polyfill/promise-polyfill.js';
import './polyfill/fetch-polyfill.js';
import './polyfill/array.js';

import './script/base/polyfill.js';
import util from './script/base/util.js';

import InputCount from './script/form/InputCount.js';

import PikaEx from './script/form/PikaEx.js';

import CheckAll from './script/form/CheckAll.js';

import Transfer from './script/form/Transfer.js';

import Range from './script/form/Range.js';


import Select from './script/select/Select.js';

import Cascader from './script/select/Cascader.js';


import Modal from './script/modal/Modal.js';

import Message from './script/modal/Message.js';

import Tooltip from './script/modal/Tooltip.js';

import Popper from './script/modal/Popper.js';

import Layer from './script/modal/Layer.js';

import Position from './script/modal/Position.js';


import Tag from './script/tag/Tag.js';


import Validator from './script/validator/Validator.js';


import Upload from './script/upload/Upload.js';

import UploadHelper from './script/upload/UploadHelper.js';

import Pagination from './script/data/Pagination';
import Table from './script/data/Table';


import Tab from './script/menu/Tab.js';

import ColorPicker from './script/color/ColorPicker.js';

import Tree from './script/tree/Tree.js';

const ui = {
  util,
  Select,
  Cascader,
  CheckAll,
  Modal,
  Message,
  Tooltip,
  InputCount,
  Tag,
  Validator,
  Upload,
  Popper,
  Layer,
  PikaEx,
  UploadHelper,
  Transfer,
  Position,

  Pagination,
  Table,
  Tab,
  Range,
  ColorPicker,
  Tree
};

// @ts-ignore
window.ui = ui;

util.on(document, 'click', '[data-closeable]', function (e) {
  const node = this;
  if (util.hasClass(e.target, 'icon-times')) {
    node.parentNode.removeChild(node);
  }
});

util.on(document, 'click', '.node-trigger', function () {
  util.toggleClass(this, 'expend');
});  

if (!util.supportPseudo(':focus-within')) {
  util.on(document, 'focusin', '.ui-icon-input input', function () {
    util.addClass(this.closest('.ui-icon-input'), 'active');
  }); 
  
  util.on(document, 'focusout', '.ui-icon-input input', function () {
    util.removeClass(this.closest('.ui-icon-input'), 'active');
  });
} 

window.addEventListener('load', function () {
  document.body.addEventListener('click', function () {
    const pika = document.querySelectorAll('.ui-pika');
  
    util.forEach(pika, item => {
      item.hide();
    });
  });
});

export default ui;
