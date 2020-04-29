import '../../../../lib/promise-polyfill/8.0.0/src/promise-polyfill.js';
import '../../../../lib/fetch-polyfill/2.0.4/src/fetch-polyfill.js';

import './script/base/polyfill.es6';
import util from './script/base/util.es6';

import InputCount from './script/form/InputCount.es6';
import PikaEx from './script/form/PikaEx.es6';
import CheckAll from './script/form/CheckAll.es6';
import Transfer from './script/form/Transfer.es6';

import Select from './script/select/Select.es6';
import Cascader from './script/select/Cascader.es6';

import Modal from './script/modal/Modal.es6';
import Message from './script/modal/Message.es6';
import Tooltip from './script/modal/Tooltip.es6';
import Popper from './script/modal/Popper.es6';
import Layer from './script/modal/Layer.es6';
import Position from './script/modal/Position.es6';

import Tag from './script/tag/Tag.es6';

import Validator from './script/validator/Validator.es6';

import Upload from './script/upload/Upload.es6';
import UploadHelper from './script/upload/UploadHelper.es6';
  
window.ui = {
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
  Position
};

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

