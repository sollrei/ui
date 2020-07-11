---
layout: default
---

# Checkbox

## Checkbox

{% example html %}
<label class="ui-checkbox">
  <input type="checkbox"><i class="iconfont"></i><span>选项</span>
</label>
{% endexample %}

{% example html %}
<label class="ui-checkbox">
  <input type="checkbox" disabled><i class="iconfont"></i><span>禁用</span>
</label>
{% endexample %}

{% example html %}
<label class="ui-checkbox">
  <input type="checkbox" checked><i class="iconfont"></i><span>选中</span>
</label>
{% endexample %}

{% example html %}
<label class="ui-checkbox">
  <input type="checkbox" checked disabled><i class="iconfont"></i><span>选中禁用</span>
</label>
{% endexample %}


## Radio

{% example html %}
<label class="ui-radio">
  <input type="radio" name="d2" value="1"><i class="iconfont"></i><span>选项</span>
</label>
{% endexample %}

{% example html %}
<label class="ui-radio">
  <input type="radio" name="d2" value="3" checked><i class="iconfont"></i><span>选中</span>
</label>
{% endexample %}

{% example html %}
<label class="ui-radio">
  <input type="radio" name="d3" value="2" disabled><i class="iconfont"></i><span>禁用</span>
</label>
{% endexample %}

{% example html %}
<label class="ui-radio">
  <input type="radio" name="d3" value="4" checked disabled><i class="iconfont"></i><span>选中禁用</span>
</label>
{% endexample %}


{% example html %}
<div class="ui-radio-group">
  <input type="radio" name="type" checked id="type1" value="1">
  <label for="type1">选项1</label>
  <input type="radio" name="type" id="type2" value="2">
  <label for="type2">选项2</label>
</div>
{% endexample %}

## Switch

{% example html %}
<label class="ui-switch">
  <input type="checkbox" name="name" value="1" role="switch">
  <span class="switch"></span>
  <span class="open">开</span>
  <span class="close">关</span>
</label>
{% endexample %}

{% example html %}
<label class="ui-switch">
  <input type="checkbox" name="name" value="2" role="switch" disabled>
  <span class="switch"></span>
  <span class="open">开</span>
  <span class="close">禁用</span>
</label>
{% endexample %}

{% example html %}
<label class="ui-switch">
  <input type="checkbox" name="name" value="3" role="switch" disabled checked>
  <span class="switch"></span>
  <span class="open">禁用</span>
  <span class="close">关</span>
</label>
{% endexample %}
