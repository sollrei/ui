window.onload = function () {
  var ui = window.ui;
  var InputCount = ui.InputCount;
  var Select = ui.Select;
  var Tooltip = ui.Tooltip;

  new InputCount('.ui-enter-count');
  new Select('.js-select');
  new Tooltip('[data-tooltip]');
};
