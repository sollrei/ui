---
layout: default
need_js: true
---

# Interaction

<style>
.interaction-demo {
  font-size: 18px;
}

.interaction-demo .bd-example,
.interaction-demo .highlight {
}

.interaction-demo .demo3 a {
  display: inline-block;
  line-height: 2;
}

.demo-box {
  padding: 30px 0;
}

.demo-wrap {
  display: flex;
  padding: 20px;
  background: #fafcfd;
}
.demo {
  width: 30%;
  padding: 10px;
  background: #fff;
  transition: .4s;
  margin-right: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  font-family: lato;
  font-weight: 300;
}

.demo img {
  width: 100%;
  display: block;
  margin: 0 auto;
  transition: .4s;
  object-fit: contain;
}

.demo h4 {
  /* font-weight: 300; */
  padding-top: 5px;
  font-size: 16px;
}

.card-img {
  overflow: hidden;
}

.card-hover1:hover {
  box-shadow: 5px 8.66px 30px 0 rgba(31, 35, 37, 0.08);
}

.card-hover2:hover {
  transform: translate3d(0, -5px, 0);
  box-shadow: 5px 8.66px 30px 0 rgba(31, 35, 37, 0.08);
}

.card-hover3:hover img {
  transform: scale(1.2);
}
</style>

## Link 
<div class="interaction-demo">
  {% example html %}
  <div class="demo-box">
    <a href="#" class="link-hover1 mr-8">HOME</a>
    <a href="#" class="link-hover1 mr-8">PRODUCT</a>
    <a href="#" class="link-hover1 mr-8">NEWS</a>
    <a href="#" class="link-hover1 mr-8">CONTACT</a>
  </div>
  {% endexample %}

{% example html %}
  <div class="demo-box bg">
    <a href="#" class="link-hover2 mr-8">HOME</a>
    <a href="#" class="link-hover2 mr-8">PRODUCT</a>
    <a href="#" class="link-hover2 mr-8">NEWS</a>
    <a href="#" class="link-hover2 mr-8">CONTACT</a>
  </div>
{% endexample %}
{% example html %}
  <div class="demo-box demo3 bg">
    <a href="#" class="link-hover3 plr-8 mr-8"><span class="inner-box">HOME</span></a>
    <a href="#" class="link-hover3 plr-8 mr-8"><span class="inner-box">PRODUCT</span></a>
    <a href="#" class="link-hover3 plr-8 mr-8"><span class="inner-box">NEWS</span></a>
    <a href="#" class="link-hover3 plr-8 mr-8"><span class="inner-box">CONTACT</span></a>
  </div>
{% endexample %}
{% example html %}
  <div class="demo-box">
    <a href="#" class="link-hover4 mr-8">HOME</a>
    <a href="#" class="link-hover4 mr-8">PRODUCT</a>
    <a href="#" class="link-hover4 mr-8">NEWS</a>
    <a href="#" class="link-hover4 mr-8">CONTACT</a>
  </div>
  {% endexample %}
</div>

## Card

<div class="demo-wrap">
  <div class="demo card-hover1">
    <div class="card-box">
      <div class='card-img'>
        <img src="https://picsum.photos/id/1029/400/300" alt="img" />
      </div>
      <h4>WHAT WE OFFER</h4>
      <p>Amet minim mollit non deserunt ullamco est sit </p>
    </div>
  </div>
  <div class="demo card-hover2">
    <div class="card-box">
      <div class='card-img'>
        <img src="https://picsum.photos/id/1029/400/300" alt="img" />
      </div>
      <h4>WHAT WE OFFER</h4>
      <p>Amet minim mollit non deserunt ullamco est sit </p>
    </div>
  </div>
  <div class="demo card-hover3">
    <div class="card-box">
      <div class='card-img'>
        <img src="https://picsum.photos/id/1029/400/300" alt="img" />
      </div>
      <h4>WHAT WE OFFER</h4>
      <p>Amet minim mollit non deserunt ullamco est sit </p>
    </div>
  </div>
  <div class="demo link-hover3">
    <div class="card-box inner-box">
      <div class="card-img">
        <img src="https://picsum.photos/id/1029/400/300" alt="img" />
      </div>
      <h4>WHAT WE OFFER</h4>
      <p>Amet minim mollit non deserunt ullamco est sit </p>
    </div>
  </div>
</div>


