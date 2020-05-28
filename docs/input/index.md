---
layout: default
need_js: true
---

# Input



## 默认

<input type="text" class="ui-form-control" placeholder="请输入">

```html
<input type="text" class="ui-form-control" placeholder="请输入">
```

## 禁用

<input type="text" class="ui-form-control disabled" disabled value="输入完成">

```html
<input type="text" class="ui-form-control disabled" disabled value="输入完成">
```

## 错误

<div class="ui-control-wrap">
  <input type="text" class="ui-form-control error" value="输入完成">
</div>


```html
<input type="text" class="ui-form-control error" value="输入完成">
```

## Icon

<div class="ui-icon-input">
  <input type="text" class="ui-form-control">
  <span class="suffix"><i class="iconfont icon-eye"></i></span>
</div>

```html
<div class="ui-icon-input">
  <input type="text" class="ui-form-control">
  <span class="suffix"><i class="iconfont icon-eye"></i></span>
</div>
```

<div class="ui-icon-input">
  <span class="prefix"><i class="iconfont icon-search"></i></span>
  <input type="text" class="ui-form-control">
</div>

```html
<div class="ui-icon-input">
  <span class="prefix"><i class="iconfont icon-search"></i></span>
  <input type="text" class="ui-form-control">
</div>
```

## 字数限制

> 需要有`maxlenth`属性

<div class="ui-enter-count">
  <input type="text" class="ui-form-control" maxlength="20">
  <span class="count">0/20</span>
</div>



```html
<div class="ui-enter-count">
  <input type="text" class="ui-form-control" maxlength="20">
  <span class="count">0/20</span>
</div>
```

```javascript
new InputCount('.ui-enter-count');
```