---
layout: default
need_js: true
---

# Upload

<div class="ui-upload-img" style="width: 98px;height: 98px;">
  <label class="trigger"><i class="iconfont icon-plus"></i><input type="file"></label>
  <div class="image hidden"></div>
</div>

```html
<div class="ui-upload-img" style="width: 98px;height: 98px;">
  <label class="trigger"><i class="iconfont icon-plus"></i><input type="file"></label>
  <div class="image hidden"></div>
</div>
```

 <div class="ui-upload-img" style="width: 98px;height: 98px;">
  <label class="trigger hidden"><i class="iconfont icon-plus"></i><input type="file"></label>
  <div class="image">
    <input type="hidden" name="file" value="https://picsum.photos/id/237/300/300">
    <img src="https://picsum.photos/id/237/300/300">
    <div class="option">
      <a href="javascript:;" class="js-change">替换</a><a href="javascript:;" class="js-clean">清除</a>
    </div>
  </div>
</div>

```html
<div class="ui-upload-img" style="width: 98px;height: 98px;">
  <label class="trigger hidden"><i class="iconfont icon-plus"></i><input type="file"></label>
  <div class="image">
    <input type="hidden" name="file" value="https://picsum.photos/id/237/300/300">
    <img src="https://picsum.photos/id/237/300/300">
    <div class="option">
      <a href="javascript:;" class="js-change">替换</a><a href="javascript:;" class="js-clean">清除</a>
    </div>
  </div>
</div>
```

<div class="ui-upload-multiple" data-drag>
  <label class="trigger">
    <input type="file" multiple accept=".csv">
    <i class="iconfont icon-upload"></i>
    <div class="mt-20">点击或将文件拖拽到这里上传，最大支持20MB文件，支持扩展名：.csv</div>
  </label>
</div>

```html
<div class="ui-upload-multiple" data-drag>
  <label class="trigger">
    <input type="file" multiple accept=".csv">
    <i class="iconfont icon-upload"></i>
    <div class="mt-20">点击或将文件拖拽到这里上传，最大支持20MB文件，支持扩展名：.csv</div>
  </label>
</div>
```