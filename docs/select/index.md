---
layout: default
need_js: true
---


# Select


## 单选
<div class="ui-control-wrap">
  <select name="select" class="ui-select ui-form-control js-select">
    <option value="">请选择</option>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
  </select>
</div>

```html
<div class="ui-control-wrap">
  <select name="select" class="ui-select ui-form-control js-select">
    <option value="">请选择</option>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
  </select>
</div>
```

## 多选

> 需要添加`multiple`属性，或者在option中增加`multiple: true`

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

```html
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
```

## 分组

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

```html
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
```

## 分组多选

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

```html
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
```

## JavaScript

```javascript
new Select(selector, {
  multiple: [boolean] // 多选
});

// e.g.
new Select('.js-select', {
  multiple: true
});
```