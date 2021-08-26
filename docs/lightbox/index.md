---
layout: default
---

# Lightbox

<style>
  .demo-wrapper {
    display: flex;
  }

  .demo-wrapper .item {
    margin-right: 10px;
  }

  .item img {
    height: 100px;
    width: 100px;
    object-fit: cover;
  }
</style>

<div class="demo-wrapper">
  <div class="item" data-src="https://picsum.photos/id/227/400/300">
    <img src="https://img-i.westarcloud.com/2021/0824/k37azdst7byb4e22014503.png" alt="">
  </div>
  <div class="item" data-src="https://img-i.westarcloud.com/2021/0824/e33s3yb6486i7r9j014503.png">
    <img src="https://img-i.westarcloud.com/2021/0824/e33s3yb6486i7r9j014503.png" alt="">
  </div>
  <div class="item" data-src="https://picsum.photos/id/137/1000/1000">
    <img src="https://img-i.westarcloud.com/2021/0824/k37azdst7byb4e22014503.png" alt="">
  </div>
</div>

{% example html %}
<script>
  var Lightbox = ui.Lightbox;
  
  new Lightbox('.demo-wrapper', {
    selector: '.item'
  })
</script>  
{% endexample %}