---
layout: default
---

# Tree

{% example html %}
<div class="ui-tree w320">
  <div class="tree-group">
    <div class="node-label node-trigger expend">默认模版</div>
    <div class="tree-node active">
      <a class="node-label pl-24" href="#">main.html</a>
    </div>
    <div class="tree-node">
      <a class="node-label pl-24" href="#">main.html</a>
    </div>
  </div>
  <div class="tree-group">
    <div class="node-label node-trigger expend">自定义模版</div>
    <div class="tree-node">
      <a class="node-label pl-24" href="#">main.html</a>
    </div>
  </div>
</div>
{% endexample %}


## Check

> 全选组件可能会重写

{% example html %}
<div class="ui-tree" id="tree-demo"></div>
{% endexample %}

{% example html %}
<script>
  var Tree = ui.Tree;
  var CheckAll = ui.CheckAll;

  new Tree('#tree-demo', {
    data: [{
      id: 1,
      name: 'test',
      children: [{
        id: 3,
        name: 'hello'
      }, {
        id: 4,
        name: 'world'
      }, {
        id: 5,
        name: 'aoe',
        children: [{
          id: 6,
          name: 'dps',
          children: [{
            id: 7,
            name: '7'
          }]
        }]
      }]
    }, {
      id: 2,
      name: 'test2'
    }],
    callback() {
      new CheckAll('#tree-demo');
    }
  });
</script>
{% endexample %}