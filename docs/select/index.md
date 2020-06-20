---
layout: default
need_js: true
---


# Select

> 需要调用js  `new Select('.js-select');`

> 部分配置可以写在初始元素上，也可以单独传参数设置

## Standard

{% example html %}
<div class="ui-control-wrap">
  <select name="select" class="ui-select ui-form-control js-select">
    <option value="">请选择</option>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
  </select>
</div>
{% endexample %}

## Clearable

{% example html %}
<div class="ui-control-wrap">
  <select name="select" class="ui-select ui-form-control js-select" data-clearable>
    <option value="">请选择</option>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
  </select>
</div>
{% endexample %}


## Multiple

> 需要添加`multiple`属性，或者在option中增加`multiple: true`

{% example html %}
<div class="ui-control-wrap">
  <select name="multi" class="ui-select ui-form-control js-select" multiple>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3" selected>选项3</option>
    <option value="4" selected>选项4</option>
    <option value="5" selected>选项5</option>
    <option value="6">选项6</option>
    <option value="7">选项7</option>
  </select>
</div>
{% endexample %}

## Group

{% example html %}
<div class="ui-control-wrap">
  <select name="group" class="js-select ui-select ui-form-control">
    <optgroup label="第一组">
      <option value="1">选项1</option>
      <option value="2">选项2</option>
      <option value="3">选项3</option>
    </optgroup>
    <option value="4">选项4</option>
    <option value="5">选项5</option>
    <optgroup label="第二组">
      <option selected value="6">选项6</option>
      <option value="7">选项7</option>
    </optgroup>
  </select>
</div>
{% endexample %}

## Group + Multiple

{% example html %}
<div class="ui-control-wrap">
  <select name="group2" class="ui-select ui-form-control js-select" multiple>
    <optgroup label="第一组">
      <option value="1">选项1</option>
      <option value="2">选项2</option>
      <option value="3">选项3</option>
    </optgroup>
    <option value="4">选项4</option>
    <option value="5">选项5</option>
    <optgroup label="第二组">
      <option selected value="6">选项6</option>
      <option value="7">选项7</option>
    </optgroup>
  </select>
</div>
{% endexample %}


## Enterable

{% example html %}
<div class="ui-control-wrap">
  <select name="group2" class="ui-select ui-form-control js-select" multiple data-enterable>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
    <option value="4">选项4</option>
    <option value="5">选项5</option>
    <option selected value="6">选项6</option>
    <option value="7">选项7</option>
  </select>
</div>
{% endexample %}

## JavaScript

{% example html %}
<script>
  var Select = ui.Select;
  new Select('.js-select');
</script>
{% endexample %}

#### Settings

```javascript
// selector可以是css选择器，可以是HTMLElement
// e.g.   .js-select
//        document.querySelector('.js-select')
//        document.querySelectorAll('.js-select')


new Select(selector, {
  placeholder: '',

  clearable: false, // 可清除
  multiple: false,  // 多选
  enterable: false, // 可输入
  max: null,        // 最多选几个选项
  checkable: false, // 输出checkbox

  selectFn: null,   // 选中回调，使用input或select的也可以监听change事件
});
```

> 可能会重构，或者整个重写，目前逻辑比较混乱
