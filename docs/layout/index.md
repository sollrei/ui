---
layout: default
---

# Layout

> ui-mod不是必须样式

## Margin

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

## Padding

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
  <div class="ui-mod flex1 mr-12">Main</div>
  <div class="ui-mod right">Right</div>
</div>
{% endexample %}

{% example html %}
<div class="ui-row between">
  <div class="col-3"><div class="ui-mod">Main</div></div>
  <div class="col-3"><div class="ui-mod">Main</div></div>
  <div class="col-3"><div class="ui-mod">Main</div></div>
</div>
{% endexample %}

{% example html %}
<div class="ui-row center">
  <div class="ui-mod">Main</div>
</div>
{% endexample %}

{% example html %}
<div class="ui-row right">
  <div class="ui-mod">Main</div>
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