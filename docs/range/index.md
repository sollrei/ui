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

## Simple
> 主要是修改input的默认样式的实现方式

{% example html %}
<input id="input" class="ui-range" type="range" min="0" value="40" max="100">

<script>
  var Range = window.ui.Range;
  
  Range.simpleRange('.ui-range');
</script>
{% endexample %}

## Section Range

{% example html %}
<div class="js-section-range" style="width: 480px"></div>
<script>
  var SectionRange = window.ui.SectionRange;
   new SectionRange(document.querySelector('.js-section-range'), {
    width: 480,
    max: 500,
    section: [{
      label: '10',
      value: 10
    },{
      label: '50',
      value: 50
    },{
      label: '100',
      value: 100
    },{
      label: '200',
      value: 200
    },{
      label: '500',
      value: 500
    }],
    onSelect: function(val) {
      console.log('select', val)
    },
    onChange: function(val) {
      // console.log('change', val);
    }
  });
</script>
{% endexample %}