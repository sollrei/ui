---
layout: default
need_js: true
---

# ColorPicker

> 依赖 [TinyColor](https://github.com/bgrins/TinyColor)，参考：[https://codepen.io/dariocorsi/pen/WwOWPE](https://codepen.io/dariocorsi/pen/WwOWPE)

{% example html %}
<button class="ui-color-trigger" id="color-trigger" type="button" data-color="#000000">
  <input type="hidden" name="color" value="#000000" />
</button>
{% endexample %}

<script src="{{ "./assets/tinycolor.js " | relative_url }}"></script>
{% example html %}
<script>
  var ColorPicker = ui.ColorPicker;
  var btn = document.querySelector('#color-trigger');
  
  new ColorPicker(btn, {
    onChange: function (data) {
      var color = '#' + data;
      btn.style.background = color;
      btn.setAttribute('data-color', color);
      btn.querySelector('input').value = color;
    }
  });
</script>
{% endexample %}