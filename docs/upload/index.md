---
layout: default
need_js: true
---

# Upload

{% example html %}
<div class="ui-upload-img" id="upload-demo">
  <label class="trigger"><i class="iconfont icon-plus"></i><input type="file"></label>
  <div class="image hidden"></div>
</div>
{% endexample %}

### javascript

{% example html %}
<script>
var UploadHelper = ui.UploadHelper;
var up = UploadHelper('#upload-demo', {
  url: 'https://api.cooode.xyz/api/upload',
  success(data) {
    up.createSingleDom(data.data);
  }
});
</script>
{% endexample %}

> 默认有已上传的图片时的html结构 

```html
<div class="ui-upload-img">
  <label class="trigger hidden"><i class="iconfont icon-plus"></i><input type="file"></label>
  <div class="image">
    <input type="hidden" name="file" value="https://picsum.photos/id/237/300/300">
    <img src="https://picsum.photos/id/217/300/300">
    <div class="option">
      <a href="javascript:;" class="js-change">替换</a><a href="javascript:;" class="js-clean">清除</a>
    </div>
  </div>
</div>
```

{% example html %}
<div class="ui-upload-multiple" data-drag id="upload-multi">
  <label class="trigger">
    <input type="file" multiple>
    <i class="iconfont icon-upload"></i>
    <div class="mt-20">点击或将文件拖拽到这里上传，最大支持20MB文件</div>
  </label>
</div>
{% endexample %}

<script>
var UploadHelper = ui.UploadHelper;
var up = UploadHelper('#upload-multi', {
  url: 'https://api.cooode.xyz/api/upload',
  success(data) {
    // up.createSingleDom(data.data);
  }
});
</script>


## Config

```javascript
var Upload = ui.Upload;

new Upload(uploadUrl, input, {
  limit: 0, // 多文件上传一次添加的数量，0为无限制
  fileType: [], // ['.jpeg', '.png', '.gif']
  fileName: 'file', // 请求url时的文件name值
  dataType: 'json',
  
  // 回调函数：
  beforeInit: null,
  init: null,
  start() { return true; },
  beforeUploadStart: null,
  beforeUpload: null,
  progress: null, 
  success: null,
  error: null,
  cancel: null,
  complete: null, 
  finish: null 
})
```

| 函数      | 默认值 | 参数 | 描述 |
| ----------- | ----------- | ----------- | ----------- |
| **beforeInit** | null | callback | 整个上传初始化之前，函数中调用callback(true)会继续上传流程，否则结束 |
| **init** | null | uploadContext | 初始化上传文件数组，state变为0: init |
| **start** | function(){ return true; } | uploadContext | 文件通过类型和大小的验证 |
| **beforeUploadStart**  | null | callback | 文件上传开始前，函数中调用callback(true)会继续上传，否则结束|
| **beforeUpload** | null | uploadContext, uploadFileIndex, callback(next, data) | 单个文件上传开始前, 函数中调用callback(true)会继续上传，data会添加到当前文件上传的ajax请求中 |
| **progress** | null | uploadContext, progress | 上传进度 |
| **success** | null | uploadContext, responseData | ajax上传有返回数据 |
| **error** | null | uploadContext, errorObject | 错误, 例如文件不存在等内部错误，文件扩展名不符，ajax请求错误，返回数据错误（例如dataType:json,但是格式不是json） |
| **cancel** | null | uploadContext | 取消上传 |
| **complete** | null | uploadContext, status | 单个文件的上传流程结束，success，error，cancel后都会触发 |
| **finish** | null | uploadContexts | 所有文件的上传流程结束（多文件上传） |

<div class="mt-20"></div>

### uploadContext对象属性

> uploadContexts为所有uploadContext对象组成的数组

| name      | value |
| ----------- | ----------- |
| **index** | 文件index |
| **id** | 文件唯一性标识 |
| **state** | 状态，可能的值：init/uploading/success/error/cancel |
| **file** | file对象 |
| **cancel** | 函数，调用可取消该文件的上传 |

