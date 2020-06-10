window.onload = function () {
  var arr = '';
  
  var ui = window.ui;
  var InputCount = ui.InputCount;
  var Select = ui.Select;
  var Tooltip = ui.Tooltip;
  var Popper = ui.Popper;
  var Validator = ui.Validator;
  var Modal = ui.Modal;
  var Message = ui.Message;
  var Page = ui.Pagination;
  var Tab = ui.Tab;
  var Table = ui.Table;

  var btnModal = document.querySelector('.js-modal-btn');
  var btn = document.querySelector('.js-popper');
  var m; 
  var m2; 
  var m3;

  [].slice.call(document.querySelectorAll('.page-code h2')).forEach(function (item) {
    var name = item.innerText;
    var id = item.id;
    arr += '<li><a href="#' + id + '">' + name + '</a></li>';
  });
  document.querySelector('.page-menu-list').innerHTML = '<ul>' + arr + '</ul>';


  new InputCount('.ui-enter-count');

  new Select('.js-select');

  new Tooltip('[data-tooltip]');

  new Validator('.ui-form', function () {
    console.log('success');
  });
 

  if (btnModal) {
    m2 = new Message();
    m = new Modal({
      resize: true,
      onOpen: function () {
        console.log('open');
      },
      onConfirm: function (e, modal) {
        console.log('ok');
        modal.hide();
      }
    });
    
    document.querySelector('.js-modal-btn').addEventListener('click', function () {
      m.show({
        content: '<div class="modal-main">Modal Content Text .... ... ....</div>',
        title: 'Modal'
      });
    });

    document.querySelector('.js-alert-btn').addEventListener('click', function () {
      m2.success('这里是信息提示');
    });
  
    document.querySelector('.js-alert-warn').addEventListener('click', function () {
      m2.warn('这里是信息提示');
    });
    
    m3 = new Modal({
      type: 'confirm'
    });
  
    document.querySelector('.js-confirm-btn').addEventListener('click', function () {
      m3.confirm({
        content: '提醒',
        desc: '当前积分余额为1，完成当前操作需要消耗20积分'
      });
    });
  }
  
  new Page('#test', {
    total: 120,
    page: 1,
    size: 10,
    pages: 5
  });

  new Table('#table');

  Tab('.ui-tab-wrap');

  if (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      
      new Popper(btn, {
        position: 'center top',
        content: '内容部分'
      });
    }, false);
  }
};
