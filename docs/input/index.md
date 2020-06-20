---
layout: default
need_js: true
---

# Input

## 默认

{% example html %}
<input type="text" class="ui-form-control" placeholder="请输入">
{% endexample %}


## 禁用

{% example html %}
<input type="text" class="ui-form-control disabled" disabled value="输入完成">
{% endexample %}


## 错误

{% example html %}
<div class="ui-control-wrap">
  <input type="text" class="ui-form-control error" value="输入完成">
</div>
{% endexample %}


## Icon

{% example html %}
<div class="ui-icon-input">
  <input type="text" class="ui-form-control">
  <span class="suffix"><i class="iconfont icon-eye"></i></span>
</div>
{% endexample %}

{% example html %}
<div class="ui-icon-input">
  <span class="prefix"><i class="iconfont icon-search"></i></span>
  <input type="text" class="ui-form-control">
</div>
{% endexample %}

## 字数限制

> 需要有`maxlenth`属性

{% example html %}
<div class="ui-enter-count">
  <input type="text" class="ui-form-control" maxlength="20">
  <span class="count">0/20</span>
</div>
{% endexample %}

#### JavaScript

{% example html %}
<script>
  var InputCount = ui.InputCount;
  new InputCount('.ui-enter-count');
</script>
{% endexample %}
