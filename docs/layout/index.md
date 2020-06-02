---
layout: default
---

# Layout

> ui-mod不是必须样式

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