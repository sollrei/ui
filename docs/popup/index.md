---
layout: default
need_js: true
---

# Popup

## Popper

<button class="ui-button js-popper">Click Me</button>

```html
<button class="ui-button js-popper">Click Me</button>
```

#### JavaScript

```javascript
var btn = document.querySelector('.js-popper');
btn.addEventListener('click', function (e) {
  e.stopPropagation();
  
  new Popper(btn, {
    position: 'center top',
    content: '内容部分'
  });
}, false);
```

## Tooltip

<a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="right top" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="right bottom" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="right middle" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="left top" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="left middle" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="center top" data-text="内容区域"></a><a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="center bottom" data-text="内容区域"></a>


```html
<a class="iconfont icon-info ft-gray ft-link" data-tooltip data-position="right top" data-text="内容"></a>
```

#### JavaScript

```javascript
new Tooltip('[data-tooltip]');
```