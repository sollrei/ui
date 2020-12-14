---
layout: default
need_js: true
---

# Form

<form class="ui-form" style="width: 500px">
  <div class="form-group line">
    <div class="form-label">email</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control transparent" placeholder="email">
      </div>
    </div>
  </div>
  <div class="form-group line">
    <div class="form-label">name</div>
    <div class="form-con">
      <div class="ui-control-wrap">
        <input type="text" class="ui-form-control transparent" placeholder="name">
      </div>
    </div>
  </div>
  
</form>

## Validator

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

## JavaScript

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

| 参数      | Description |
| ----------- | ----------- |
| **form** | 表单元素 |
| **option** | 配置，可选参数 |
| **fields** | 验证项，数组，可选参数 |
| **successCallback** | 表单验证通过回调 |
| **errorCallback** | 验证没通过的回调，可选参数 |

| 配置项      | default | Description |
| ----------- | ----------- | ----------- |
| **wrapSelector** | .ui-control-wrap | 相对定位元素，用于添加error样式和提示元素（绝对定位） |
| **validSelector** | .v-item | 对该selector查找到的字段添加验证 |
| **errorClass** | error | 错误样式（添加到input和warpClass元素） |
| **successClass** | success | 验证成功 |
| **loadClass** | loading | 远程验证中样式（添加到input和warpClass元素） |
| **separator** | `|` | rules和msgs分隔符 |
| **realTime** | true | 字段失去焦点时验证，如果是false就只在提交时验证 |
| **shouldFresh** | false | 如果表单项会动态修改，可以设为true，提交时会清空之前的数据并重新验证 |
| **remoteLoading** | false | 远程验证中显示loading样式 |
| **scrollToError** | false | 滚动到错误位置 |
| **fetchSuccess** | `res => res.code === 200` | 判断远程验证通过 |

| 验证项     | Type | Description |
| ----------- | ----------- |----------- |
| **name** | string | 字段name |
| **rules** | string | 规则，例如 `rules: 'required|email'` |
| **msgs** | string | 错误提示信息，例如 `msgs: '请填写邮箱|邮箱格式不正确'` |
| **fn** | function | 非必须，字段验证后执行，但是不会中断验证过程，参数为1.validator实例 |

| Method      | Description |
| ----------- | ----------- |
| **cleanTips** | 清除错误提示样式 |

### 在表单元素上添加验证规则

<ul class="page-ul">
  <li>data-rules上有remote(远程验证)时需要把remote放在最后</li>
  <li>对checkbox和radio类型的需要在每个input上加v-item，但是rules和msg只用写第一个上面</li>
  <li>远程验证inputName值为form中指定字段的name，远程验证会带上该字段的值，请求中的name为ajaxName</li>
</ul>

```html
<input class="v-item" data-rules="rule1|rule2|..." data-msgs="msg1|msg2|..." />
```

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
| **reg(regRule)** | 正则，因为用了竖线做了分隔符，所以规则中不能用竖线 |
| **gt(name)** | 大于指定字段值（数字） |
| **gte(name)** | 大于等于指定字段值（数字） |
| **gtnum(number)** | 大于number值 |
| **gtenum(number)** | 大于等于number值 |
| **ltnum(number)** | 小于number值 |
| **ltenum(number)** | 小于等于number值 |


