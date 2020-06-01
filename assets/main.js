window.onload = function () {
  var arr = '';
  
  var ui = window.ui;
  var InputCount = ui.InputCount;
  var Select = ui.Select;
  var Tooltip = ui.Tooltip;
  var Popper = ui.Popper;
  var Validator = ui.Validator;

  var btn = document.querySelector('.js-popper');


  [].slice.call(document.querySelectorAll('.page-code h2')).forEach(item => {
    var name = item.innerText;
    var id = item.id;
    arr += '<li><a href="#' + id + '">' + name + '</a></li>';
  });
  document.querySelector('.page-menu-list').innerHTML = '<ul>' + arr + '</ul>';


  new InputCount('.ui-enter-count');
  window.s = new Select('.js-select');
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
