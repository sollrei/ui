---
layout: default
need_js: true
---

# Range

## Normal

{% example html %}
<div class="ui-row middle">
  <div class="ui-slider-wrap mr-20 js-range">
    <input type="range" max="100" min="0" value="0"/>
  </div>
  <div class="ui-icon-input" style="width: 80px">
    <input class="ui-form-control js-value" type="text" value="0" name="yourInputName"/>
    <span class="suffix">%</span>
  </div>
</div>
{% endexample %}

#### JavaScript

{% example html %}
<script>
  var Range = window.ui.Range;
  var input = document.querySelector('.js-value');
  var wrap = document.querySelector('.js-range');
  
  var range = new Range(wrap, {
    onChange: function (data) {
      input.value = data;
    }
  });
  
  input.addEventListener('change', function () {
    range.changeValue(this.value);
  })
</script>
{% endexample %}

## Negative

{% example html %}
<div class="ui-slider-wrap js-range2">
  <input type="range" max="100" min="-100" value="0"/>
</div>
{% endexample %}

#### JavaScript

{% example html %}
<script>
  var Range = window.ui.Range;
  var wrap = document.querySelector('.js-range2');
  
  new Range(wrap);
</script>
{% endexample %}