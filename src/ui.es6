import './polyfill/promise-polyfill.js';
import './polyfill/fetch-polyfill.js';
import './polyfill/array.js';

import './script/base/polyfill.es6';
// @ts-ignore
import util from './script/base/util.es6';

// @ts-ignore
import InputCount from './script/form/InputCount.es6';
// @ts-ignore
import PikaEx from './script/form/PikaEx.es6';
// @ts-ignore
import CheckAll from './script/form/CheckAll.es6';
// @ts-ignore
import Transfer from './script/form/Transfer.es6';

// @ts-ignore
import Select from './script/select/Select.es6';
// @ts-ignore
import Cascader from './script/select/Cascader.es6';

// @ts-ignore
import Modal from './script/modal/Modal.es6';
// @ts-ignore
import Message from './script/modal/Message.es6';
// @ts-ignore
import Tooltip from './script/modal/Tooltip.es6';
// @ts-ignore
import Popper from './script/modal/Popper.es6';
// @ts-ignore
import Layer from './script/modal/Layer.es6';
// @ts-ignore
import Position from './script/modal/Position.es6';

// @ts-ignore
import Tag from './script/tag/Tag.es6';

// @ts-ignore
import Validator from './script/validator/Validator.es6';

// @ts-ignore
import Upload from './script/upload/Upload.es6';
// @ts-ignore
import UploadHelper from './script/upload/UploadHelper.es6';

// @ts-ignore
import Pagination from './script/data/Pagination.es6';

// @ts-ignore
import Tab from './script/menu/Tab.es6';

// @ts-ignore
import Table from './script/data/Table.es6';

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
  Tab
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

export default ui;
