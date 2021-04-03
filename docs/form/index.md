---
layout: default
need_js: true
---

# Form

<form action="https://api.cooode.xyz/api2/star-success-demo" method="post" class="ui-form js-form" autocomplete="off">
  <div class="form-group">
    <div class="form-label">required：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="required"  name="required" placeholder="required">
      </div>
    </div>
  </div>
  <div class="form-group">
      <div class="form-label">Select：</div>
      <div class="form-con">
        <div class="ui-control-wrap">
          <select name="select" class="js-select ui-select ui-form-control v-item" data-rules="required">
            <option value="">请选择</option>
            <option value="1">选项1</option>
            <option value="2">选项2</option>
          </select>
        </div>
      </div>
    </div>
  <div class="form-group">
    <div class="form-label">邮箱：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="email"  name="email" placeholder="email">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">相同：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="same(email)"  name="same" placeholder="same(email)">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">相异：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="diff(email)"  name="diff" placeholder="diff(email)">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">手机：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="mobile"  name="mobile" placeholder="mobile">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">中文：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="chinese" name="chinese" placeholder="chinese">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">数字：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="number" name="number" placeholder="number">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">大于某个数：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="gtnum(10)" name="gtnum" placeholder="gtnum(10)">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">大于等于某数：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="gtenum(10)" name="gtenum" placeholder="gtenum(10)">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">小于某数：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="ltnum(10)" name="ltnum" placeholder="ltnum(10)">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">小于等于某数：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="ltenum(10)" name="ltenum" placeholder="ltenum(10)">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">English：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="english" data-msgs="" name="english" placeholder="english">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">idCard：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="idCard" data-msgs="" name="idCard" placeholder="idCard">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">price：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="price" data-msgs="" name="price" placeholder="price">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">qq：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="qq" data-msgs="" name="qq" placeholder="qq">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">weChat：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="weChat" data-msgs="" name="weChat" placeholder="weChat">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">tel：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="tel" data-msgs="" name="tel" placeholder="tel">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">time：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="time" data-msgs="" name="time" placeholder="time">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">passport：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="passport" data-msgs="" name="passport" placeholder="passport">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">url：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="url" data-msgs="" name="url" placeholder="url">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">password：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="password" data-msgs="" name="password" placeholder="password">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">not：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control v-item" data-rules="not(1)" data-msgs="" name="not" placeholder="not(1)">
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">限制数量多选：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <label class="ui-checkbox"><input type="checkbox" name="checkmin" value="1" class="v-item" data-rules="min(2)" data-msgs="最少选两项"><i class="iconfont"></i><span>选项1</span></label>
        <label class="ui-checkbox"><input type="checkbox" name="checkmin" value="2" class="v-item"><i class="iconfont"></i><span>选项2</span></label>
        <label class="ui-checkbox"><input type="checkbox" name="checkmin" value="3" class="v-item"><i class="iconfont"></i><span>选项3</span></label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label">限制数量多选：</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <label class="ui-checkbox"><input type="checkbox" name="check" value="1" class="v-item" data-rules="max(2)" data-msgs="最多选两项"><i class="iconfont"></i><span>选项1</span></label>
        <label class="ui-checkbox"><input type="checkbox" name="check" value="2" class="v-item"><i class="iconfont"></i><span>选项2</span></label>
        <label class="ui-checkbox"><input type="checkbox" name="check" value="3" class="v-item"><i class="iconfont"></i><span>选项3</span></label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="form-label"></div>
    <div class="form-con ui-row">
      <button class="ui-button primary" type="submit">保存</button>
    </div>
  </div>
</form>

## Usage

{% example html %}
<script>
var Validator = ui.Validator;
var Select = ui.Select;

new Select('.js-select');

new Validator('.js-form', function () {
  alert('success');
});
</script>
{% endexample %}


```javascript
new Validator(form, successCallback[, errorCallback]);
new Validator(form, option, successCallback[, errorCallback]);
new Validator(form, fields, option, successCallback[, errorCallback]);
```



## Parameters

### form

Type: `HTMLElement | Selector`

表单元素或者表单选择器，如果同一个页面有多个表单需要验证，需要对每个表单单独调用

```javascript
new Validator('.js-form', successCallback);
// 等于
new Validator(document.querySelector('.js-form'), successCallback);
```

### option

Type: `Object`

配置，可选参数，可以传null，详见 <a href="#option-1" class="ft-primary">option</a>

### fields

Type: `Array`

验证项，可选参数，详见 <a href="#fields-1" class="ft-primary">fields</a>

### successCallback

Type: `Function`

验证通过的回调函数

### errorCallback

Type: `Function`

验证失败的回调函数，可选参数

## option

```javascript
new Validator(form, {
  wrapSelector: '.ui-control-wrap'
  // ... 
}, successCallback);
```

<div id="option-1"></div>

### wrapSelector

Type: `String`

Default: `.ui-control-wrap`

相对定位元素，用于添加error样式和提示元素（绝对定位）


### validSelector

Type: `String`

Default: `.v-item`

对该selector查找到的字段添加验证

### errorClass

Type: `String`

Default: `error`

错误样式（添加到input和warpClass元素）

### successClass

Type: `String`

Default: `success`

成功样式

### loadClass

Type: `String`

Default: `loading`

远程验证中样式（添加到input和warpClass元素）

### separator

Type: `String`

Default: `|`

rules和msgs分隔符，如果影响添加的正则规则可以进行修改

### realTime

Type: `Boolean`

Default: `true`

字段失去焦点时验证，如果是false就只在提交时验证

### shouldFresh

Type: `Boolean`

Default: `false`

如果表单项会动态修改，可以设为`true`，提交时会重新验证

### remoteLoading

Type: `Boolean`

Default: `false`

远程验证中显示loading样式

### scrollToError

Type: `Boolean`

Default: `false`

出现错误项时，滚动定位到错误位置

### fetchSuccess

Type: `Function`

Default: `res => res.code === 200`

判断远程验证通过


## fields

```javascript
new Validator(
  // form
  document.getElementById('form'), 
  // fields
  [{
    name: 'email',
    rules: 'required|email',
    msgs: '请填写邮箱|邮箱格式不正确',
    fn(valid, filed) {
      // do ...
    }
  }],
  // option
  { wrapSelector: '.ui-control-wrap' }, 
  // successCallback
  () => {
    console.log('success')
  });
```

### name

Type: `String`

字段name

### rules

Type: `String`

规则，用`|`分隔，需要修改分隔符号可以使用 <a href="#separator" class="ft-primary">separator</a>

### msgs

Type: `String`

错误提示信息，使用`|`分隔，需要和rules一一对应；rules和msgs的分隔符保持一致

### fn

Type: `Function`

非必须，字段验证后执行，<span class="ft-warn">不会中断验证过程</span> ；参数为 1.validator实例 2.验证项


## Methods

### cleanTips

Type: `Function`

清除错误提示样式


### showErrorTip

显示某一项的错误提示【提示的项目是需要验证的项目】

```javascript
valid.showErrorTip(element, message[, tipElement])
```

参数：

**element**  `String | HTMLElement`  错误项的name值，或者错误项的html元素

**message**  `String` 错误信息

**tipElement** `HTMLElement` 可选参数，提示元素


## 直接在表单元素上添加验证规则

<ul class="page-ul">
  <li>data-rules上有remote(远程验证)时需要把remote放在最后</li>
  <li>对checkbox和radio类型的需要在每个input上加v-item，但是rules和msg只用写第一个上面</li>
  <li>远程验证inputName值为form中指定字段的name，远程验证会带上该字段的值，请求中的name为ajaxName</li>
  <li>需要在特定的元素位置显示错误提示，可以使用data-tip，可能需要修改相应的样式</li>
  <li>如果验证元素有id，错误提示会增加<code class="highlighter-rouge">v-tip-${element.id}</code>的样式，可以对特定项错误提示做修改</li>
</ul>

```html
<span class="v-error-tip error-span"></span>
<input class="v-item" data-rules="rule1|rule2|..." data-msgs="msg1|msg2|..." data-tip=".error-span"/>
```

## Valid Rules

| Rule      | Description |
| ----------- | ----------- |
| **required** | 必填 |
| **email**      | 邮箱       |
| **chinese** | 中文 |
| **english** | 英文 |
| **url** | 地址 |
| **mobile** | 手机号 |
| **phone** | 手机号，建议用mobile |
| **tel** | 座机 |
| **qq** | qq |
| **ip** | ip |
| **idCard** | 身份证 |
| **passport** | 护照 |
| **int** | 正整数 |
| **number** | 数字 |
| **not** | 非 |
| **or** | 或,例or(email,mobile) |
| **max** | 对复选框是最多选中个数，其他类似maxlength |
| **min** | 对复选框是最少选中个数，其他类似minlength |
| **remote(url, ajaxName[inputName])** | 远程验证 `remote(post:xxxx?xx=xx, mobile[newmobile])`，不写`post:`默认使用get方法 |
| **same(name)** | 相同，和表单中name字段相同值，例如重复密码 |
| **reg(regRule)** | 正则，因为用了竖线做了分隔符，所以规则中不能用竖线，或者需要改<a href="#separator" class="ft-primary">separator</a> |
| **gt(name)** | 大于指定字段值（数字） |
| **gte(name)** | 大于等于指定字段值（数字） |
| **gtnum(number)** | 大于number值 |
| **gtenum(number)** | 大于等于number值 |
| **ltnum(number)** | 小于number值 |
| **ltenum(number)** | 小于等于number值 |


