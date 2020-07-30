---
layout: default
need_js: true
---

# Modal

## Standard

<button class="ui-button primary js-modal-btn">Modal</button>

{% example html %}
<script>
  var Modal = ui.Modal;

  var m = new Modal({
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
      title: 'Modal',
      content: '<div class="modal-main">Modal Content Text .... ...Modal Content Text ....</div>'
    });
  });
</script>
{% endexample %}

## Message

<button class="ui-button primary js-alert-btn mr-20">Alert</button> <button class="ui-button primary js-alert-warn">Alert warn</button>

{% example html %}
<script>
  var Message = ui.Message;

  var m2 = new Message();
  document.querySelector('.js-alert-btn').addEventListener('click', function () {
    m2.success('这里是信息提示');
  });

  document.querySelector('.js-alert-warn').addEventListener('click', function () {
    m2.warn('这里是信息提示');
  });
</script>
{% endexample %}

## Confirm

<button class="ui-button primary js-confirm-btn">Confirm</button>

{% example html %}
<script>
  var Modal = ui.Modal;

  m3 = new Modal({
    type: 'confirm'
  });

  document.querySelector('.js-confirm-btn').addEventListener('click', function () {
    m3.confirm({
      content: '提醒',
      desc: '当前积分余额为1，完成当前操作需要消耗20积分'
    });
  });
</script>
{% endexample %}