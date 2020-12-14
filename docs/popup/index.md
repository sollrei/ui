---
layout: default
need_js: true
---

# Popup



## Popper

{% example html %}
<button class="ui-button js-popper">Click Me</button>
{% endexample %}

#### JavaScript

{% example html %}
<script>
  var Popper = ui.Popper;
  var btn = document.querySelector('.js-popper');

  if (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      
      new Popper(btn, {
        position: 'center top',
        content: '内容部分'
      });
    }, false);
  }
</script>
{% endexample %}

## Tooltip

<a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="right top" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="right bottom" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="right middle" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="left top" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="left middle" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="center top" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="center bottom" data-text="内容区域"></a>


```html
<a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="right top" data-text="内容"></a>
```

### can hover

{% example html %}
<span class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="center top" data-delay="300">
  <span class="data-tip hidden">content ... content ... <a href="#" class="ft-primary">link</a></span>
</span>
{% endexample %}

#### JavaScript

{% example html %}
<script>
  var Tooltip = ui.Tooltip;
  new Tooltip('[data-tooltip]');
</script>
{% endexample %}

## Pure Css Title

{% example html %}
<a href="#" data-title="this is my title" class="ui-title-tip">text</a>
{% endexample %}