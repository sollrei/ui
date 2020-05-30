window.onload = function () {
  var ui = window.ui;
  var InputCount = ui.InputCount;
  var Select = ui.Select;
  var Tooltip = ui.Tooltip;
  var Popper = ui.Popper;
  var Validator = ui.Validator;

  var btn = document.querySelector('.js-popper');

  new InputCount('.ui-enter-count');
  new Select('.js-select');
  new Tooltip('[data-tooltip]');
  new Validator('.ui-form', function () {
    console.log('success');
  });
  
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
