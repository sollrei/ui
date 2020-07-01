---
layout: default
need_js: true
---

# Upload

{% example html %}
<div class="ui-upload-img" id="upload-demo" style="width: 98px;height: 98px;">
  <label class="trigger"><i class="iconfont icon-plus"></i><input type="file"></label>
  <div class="image hidden"></div>
</div>
{% endexample %}

<script>
var UploadHelper = ui.UploadHelper;
var up = UploadHelper('#upload-demo', {
  url: 'https://api.cooode.xyz/api/upload',
  success(data) {
    up.createSingleDom(data.data);
  }
});
console.log(up)
</script>

{% example html %}
<div class="ui-upload-img" style="width: 98px;height: 98px;">
  <label class="trigger hidden"><i class="iconfont icon-plus"></i><input type="file"></label>
  <div class="image">
    <input type="hidden" name="file" value="https://picsum.photos/id/237/300/300">
    <img src="https://picsum.photos/id/217/300/300">
    <div class="option">
      <a href="javascript:;" class="js-change">替换</a><a href="javascript:;" class="js-clean">清除</a>
    </div>
  </div>
</div>
{% endexample %}



{% example html %}
<div class="ui-upload-multiple" data-drag>
  <label class="trigger">
    <input type="file" multiple accept=".csv">
    <i class="iconfont icon-upload"></i>
    <div class="mt-20">点击或将文件拖拽到这里上传，最大支持20MB文件，支持扩展名：.csv</div>
  </label>
</div>
{% endexample %}
