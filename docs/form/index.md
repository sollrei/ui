---
layout: default
need_js: true
---

# Form

## Form

<form action="https://api.cooode.xyz/api2/star-success-demo" method="post" class="ui-form" autocomplete="off">
    <div class="form-group">
      <div class="form-label">邮箱：</div>
      <div class="form-con">
        <div class="ui-control-wrap">
          <input type="text" class="ui-form-control v-item" data-rules="required|email" data-msgs="请填写|格式错误" name="name" placeholder="Enter">
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="form-label">多行输入：</div>
      <div class="form-con">
        <div class="ui-control-wrap">
          <div class="ui-enter-count">
            <textarea rows="4" class="ui-form-control" maxlength="200" placeholder="Enter"></textarea>
            <span class="count">0/200</span>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="form-label">下拉选择：</div>
      <div class="form-con">
        <div class="ui-control-wrap">
          <select name="direct" class="js-select ui-select ui-form-control">
            <option value="1">Option1</option>
            <option value="2">Option2</option>
          </select>
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="form-label">单选：</div>
      <div class="form-con">
        <div class="ui-control-wrap">
          <label class="ui-radio mr-24">
            <input type="radio" name="type" value="1" checked>
            <i class="iconfont"></i>
            <span>选项1</span>
          </label>
          <label class="ui-radio mr-24">
            <input type="radio" name="type" value="2">
            <i class="iconfont"></i>
            <span>选项2</span>
          </label>
          <label class="ui-radio mr-24">
            <input type="radio" name="type" value="3">
            <i class="iconfont"></i>
            <span>选项3</span>
          </label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="form-label"></div>
      <div class="form-con ui-row">
        <button class="ui-button primary mr-16" type="submit">保存</button>
        <button class="ui-button" type="reset">重置</button>
      </div>
    </div>
  </form>

## JavaScript

```javascript
new Validator('.ui-form');
```

## Validator

```html
<input class="v-item" data-rules="rule1|rule2|..." data-msgs="msg1|msg2|..." />
```
<div class="mb-20">name值为form中指定字段名称</div>

| Rule      | Description |
| ----------- | ----------- |
| email      | 邮箱       |
| chinese | 中文 |
| url | 地址 |
| mobile | 手机号 |
| phone | 手机号，建议用mobile |
| number | 数字 |
| not | 非 |
| remote(url, name[ajaxName]) | 远程验证 |
| same(name) | 相同 |
| reg(regRule) | 正则，因为用了竖线做了分隔符，所以规则中不能用竖线 |
| gt(name) | 大于指定字段值（数字） |
| gte(name) | 大于等于指定字段值（数字） |
| gtnum(number) | 大于number值 |
| gtenum(number) | 大于等于number值 |