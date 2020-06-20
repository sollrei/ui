---
layout: default
---
# Test page

<div id="table" class="hidden"></div>
<!-- <div id="test" class="ui-pagination"></div> -->


<script>
var Page = ui.Pagination;
new Page('#test', {
  total: 120,
  page: 1,
  size: 10,
  pages: 5
});
</script>