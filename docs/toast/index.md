---
layout: default
need_js: true
---

# Toast


{% example html %}
<button class="ui-button primary js-toast-trigger">click me</button>
{% endexample %}


{% example html %}
<script>
  var Toast = ui.Toast;
  var toast = new Toast();
  document.querySelector('.js-toast-trigger').addEventListener('click', function() {
    toast.success('hello world')
  })
</script>
{% endexample %}