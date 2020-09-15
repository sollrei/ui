---
layout: default
need_js: true
---

# Tab

## Normal

{% example html %}
<div class="ui-mod">
  <div class="ui-path mb-12">
    <a class="link" href="#">一级页面</a><span class="line">/</span><span>二级页面</span>
  </div>
  <div class="ui-tab">
    <ul class="tab-list">
      <li class="tab-itm"><a href="#">Tab1</a></li>
      <li class="tab-itm active"><a href="#">Tab2</a></li>
      <li class="tab-itm"><a href="#">Tab3</a></li>
      <li class="tab-itm"><a href="#">Tab4</a></li>
    </ul>
  </div>
</div>
{% endexample %}

## Small

{% example html %}
<div class="ui-tab small">
  <ul class="tab-list">
    <li class="tab-itm"><a href="#" class="itm">Tab1</a></li>
    <li class="tab-itm active"><a href="#" class="itm">Tab2</a></li>
    <li class="tab-itm"><a href="#" class="itm">Tab3</a></li>
    <li class="tab-itm"><a href="#" class="itm">Tab4</a></li>
  </ul>
</div>
{% endexample %}

## Line 
{% example html %}
<div class="ui-tab line">
  <ul class="tab-list">
    <li class="tab-itm active"><a href="#">Tab1</a></li>
    <li class="tab-itm"><a href="#">Tab2</a></li>
    <li class="tab-itm"><a href="#">Tab3</a></li>
    <li class="tab-itm"><a href="#">Tab4</a></li>
  </ul>
</div>
{% endexample %}

## JavaScript

{% example html %}
<div class="ui-tab-wrap">
  <div class="ui-tab small">
    <ul class="tab-list">
      <li class="tab-itm active"><a href="javascript:;" class="itm">Tab1</a></li>
      <li class="tab-itm"><a href="javascript:;" class="itm">Tab2</a></li>
      <li class="tab-itm"><a href="javascript:;" class="itm">Tab3</a></li>
    </ul>
  </div>
  <div class="ui-tab-content">
    <div class="tab-content show">content1</div>
    <div class="tab-content">content2</div>
    <div class="tab-content">content3</div>
  </div>
</div>
{% endexample %}

{% example html %}
<script>
  var Tab = ui.Tab;
  Tab('.ui-tab-wrap', {
    navSelector: '.tab-itm',
    conSelector: '.tab-content',
    navActive: 'active',
    conActive: 'show',
    // 以上是默认配置

    onChange: function(index, cb) {
      console.log(index)
      cb();
    }
  });
</script>
{% endexample %}
