---
layout: default
---

# Progress

## Progress Bar
{% example html %}
<div class="ui-progress" style="width: 360px;">
  <div class="bar" style="width: 50%;"></div>
</div>
{% endexample %}

## Steps

### Fixed Gap
{% example html %}
<div class="ui-steps">
  <ul class="steps">
    <li class="step active"><span>Step1</span></li>
    <li class="step"><span>Step2</span></li>
    <li class="step"><span>Step3</span></li>
  </ul>
</div>
{% endexample %}

{% example html %}
<div class="ui-steps">
  <ul class="steps">
    <li class="step pass"><span>Step1</span></li>
    <li class="step pass"><span>Step2</span></li>
    <li class="step active"><span>Step3</span></li>
  </ul>
</div>
{% endexample %}

### Auto Width 
{% example html %}
<div class="ui-steps auto">
  <ul class="steps">
    <li class="step pass"><span class="step-text">Step1</span></li>
    <li class="step pass"><span class="step-text">Step2</span></li>
    <li class="step active"><span class="step-text">Step3</span></li>
    <li class="step"><span class="step-text">Step4</span></li>
    <li class="step"><span class="step-text">Step5</span></li>
    <li class="step"><span class="step-text">Step6</span></li>
  </ul>
</div>
{% endexample %}