---
layout: default
---

# Menu

## Menu list

{% example html %}
<ul class="ui-menu w320">
  <li class="menu-item">菜单</li>
  <li class="menu-item selected">菜单</li>
  <li class="menu-item">菜单</li>
</ul>
{% endexample %}

{% example html %}
<ul class="ui-menu w320">
  <li><a href="#" class="menu-item">菜单</a></li>
  <li><a href="#" class="menu-item selected">菜单</a></li>
  <li><a href="#" class="menu-item">菜单</a></li>
</ul>
{% endexample %}

## Dropdown

{% example html %}
<div class="ui-drop">
  <div class="drop-label">文字</div>
  <div class="drop-wrap">
    <ul class="drop ui-menu">
      <li><a href="#" class="menu-item">下拉菜单</a></li>
      <li><a href="#" class="menu-item">下拉菜单</a></li>
      <li><a href="#" class="menu-item">下拉菜单</a></li>
    </ul>
  </div>
</div>

{% endexample %}
