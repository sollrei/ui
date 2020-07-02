---
layout: default
need_js: true
---

# Range

## Normal

{% example html %}
<div class="ui-row middle">
  <div class="ui-slider-wrap mr-20 js-range">
    <input type="range" max="10" min="0" value="0" name="yourInputName"/>
  </div>
</div>
{% endexample %}

#### JavaScript

{% example html %}
<script>
  var Range = window.ui.Range;
  var wrap = document.querySelector('.js-range');
  
  var range = new Range(wrap, {
    onChange: function (data) {
      console.log(data)
    }
  });
</script>
{% endexample %}

## Negative

{% example html %}

<div class="ui-row middle">
  <div class="ui-slider-wrap js-range2">
    <input type="range" max="100" min="-100" value="10" name="yourInputName"/>
  </div>
</div>
{% endexample %}

#### JavaScript

{% example html %}
<script>
  var Range = window.ui.Range;
  new Range(document.querySelector('.js-range2'));
</script>
{% endexample %}

## With Input

{% example html %}

<div class="ui-row middle">
  <div class="ui-slider-wrap js-range3">
    <input type="range" max="100" min="0" value="0" name="yourInputName"/>
  </div>
</div>
{% endexample %}

#### JavaScript

{% example html %}
<script>
  var Range = window.ui.Range;
  var wrap = document.querySelector('.js-range3');
  
  new Range(wrap, {
    withInput: true,
    inputUnit: '%'
  });
</script>
{% endexample %}


### Config

```javascript
new Range(wrapElement, {
  delay: 30,
  width: 180, // bar width
  
  withInput: false, // render value input
  inputWidth: 80,
  inputUnit: '%',
  
  onChange: null // change callback
});
```