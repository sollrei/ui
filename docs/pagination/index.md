---
layout: default
---

# Pagination

## Standard

{% example html %}
<div class="ui-pagination">
  <a href="#" class="page"><i class="iconfont icon-arrow-left"></i></a>
  <span class="page active">1</span>
  <a href="#" class="page">2</a>
  <a href="#" class="page">3</a>
  <a href="#" class="page">4</a>
  <a href="#" class="page">5</a>
  <a href="#" class="page"><i class="iconfont icon-arrow-right"></i></a>
  <div class="ui-control-wrap">
    <select class="ui-select js-select w94">
      <option value="1">10条/页</option>
      <option value="2">20条/页</option>
      <option value="3">30条/页</option>
    </select>
  </div>
  <span class="text">跳至</span>
  <input class="ui-form-control" type="text" name="page">
  <span class="text">页</span>
</div>
{% endexample %}

{% example html %}
<script>
  var Select = ui.Select;
  new Select('.js-select');
</script>
{% endexample %}

## Small

{% example html %}
<div class="ui-pagination small">
  <a href="#" class="page"><i class="iconfont icon-arrow-left"></i></a>
  <span class="page active">1</span>
  <a href="#" class="page">2</a>
  <a href="#" class="page">3</a>
  <a href="#" class="page">4</a>
  <a href="#" class="page">5</a>
  <a href="#" class="page"><i class="iconfont icon-arrow-right"></i></a>
  <span class="text">跳至</span>
  <input class="ui-form-control" type="text" name="page">
  <span class="text">页</span>
</div>
{% endexample %}


## JavaScript

<div id="js-table"></div>