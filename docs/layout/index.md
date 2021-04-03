---
layout: default
---

# Layout

> 使用flex，兼容性IE 10 +

## Page

[demo](/ui-pages/docs/pages/)

## Gap

通常元素之间的间距为4的倍数，例如4像素，8像素，12像素等

### Margin

> 4 8 12 16 20 24 28

* `ml-` margin-left
* `mr-` margin-right
* `mlr-` margin-left margin-right
* `mt-` margin-top
* `mb-` margin-bottom
* `mtb-` margin-top margin-bottom

```html
<div class="ml-4"></div>
```

### Padding

* `pl-` padding-left
* `pr-` padding-right
* `plr-` padding-left padding-right
* `pt-` padding-top
* `pb-` padding-bottom
* `ptb-` padding-top padding-bottom

```html
<div class="pl-4"></div>
```



## Rows
{% example html %}
<div class="ui-row">
  <div class="ui-mod">Main</div>
  <div class="ui-mod right">Right</div>
</div>
{% endexample %}

{% example html %}
<div class="ui-row">
  <div class="ui-mod flex1 mr-12">Content</div>
  <div class="ui-mod right">Right</div>
</div>
{% endexample %}

{% example html %}
<div class="ui-row center">
  <div class="ui-mod">Content</div>
</div>
{% endexample %}

{% example html %}
<div class="ui-row">
  <div class="col-1-2"><div class="ui-mod">content</div></div>
  <div class="col-1-2"><div class="ui-mod">content</div></div>
</div>
{% endexample %}

{% example html %}
<div class="ui-row">
  <div class="col-1-3"><div class="ui-mod">content</div></div>
  <div class="col-1-3"><div class="ui-mod">content</div></div>
  <div class="col-1-3"><div class="ui-mod">content</div></div>
</div>
{% endexample %}

{% example html %}
<div class="ui-row between">
  <div class="col-1-4"><div class="ui-mod">Content</div></div>
  <div class="col-1-4"><div class="ui-mod">Content</div></div>
  <div class="col-1-4"><div class="ui-mod">Content</div></div>
  <div class="col-1-4"><div class="ui-mod">Content</div></div>
</div>
{% endexample %}

{% example html %}
<div class="ui-row nowrap middle">
  <div class="ft-gray col">Name</div>
  <div class="ui-control-wrap flex1 col">
    <input class="ui-form-control" placeholder="First Name" />
  </div>
  <div class="ui-control-wrap flex1 col">
    <input class="ui-form-control" placeholder="Middle Name" />
  </div>
  <div class="ui-control-wrap flex1 col">
    <input class="ui-form-control" placeholder="Last Name"/>
  </div>
</div>
{% endexample %}

## Column

{% example html %}
<div class="ui-column" style="height: 300px;">
  <div class="ui-mod mb-12">Title</div>
  <div class="ui-mod flex1">Main</div>
  <div class="ui-mod mt-12">Footer</div>
</div>
{% endexample %}