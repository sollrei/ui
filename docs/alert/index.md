---
layout: default
---

# Alert

## Types

{% example html %}
<div class="ui-notice">
  <p>这里是一般警示、警告信息提示</p>
</div>
{% endexample %}

{% example html %}
<div class="ui-notice warn">
  <p>这里是一般警示、警告信息提示</p>
</div>
{% endexample %}

{% example html %}
<div class="ui-notice error">
  <p>这里是一般严重警告、禁止信息提示</p>
</div>
{% endexample %}

## Close

{% example html %}
<div class="ui-notice" data-closeable>
  <p>这里是一般信息提示——单行，可手动“关闭”</p>
  <i class="iconfont icon-times"></i>
</div>
{% endexample %}

<div class="ui-notice" data-closeable>
  <p>这里是一般信息提示——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提• 其它提示类信息不再略举多行样式和关闭样式</p>
  <i class="iconfont icon-times"></i>
</div>

```html
<div class="ui-notice" data-closeable>
  <p>这里是一般信息提示——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提示信息——多行，这里是一般提• 其它提示类信息不再略举多行样式和关闭样式</p>
  <i class="iconfont icon-times"></i>
</div>
```
## Sizes

{% example html %}
<div class="ui-notice small">这里是一般信息提示</div>
{% endexample %}


{% example html %}
<div class="ui-notice line">弹窗里的那个提示</div>
{% endexample %}
