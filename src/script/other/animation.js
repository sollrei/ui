const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');


export class Timeline {
  constructor() {
    this.state = 'init'
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  start() {
    if (this.state !== 'init') return;

    this.state = 'started'

    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      let now = Date.now();
      for (let animation of this[ANIMATIONS]) {
        let t;

        if (this[START_TIME].get(animation) < startTime)
          t = now - startTime - this[PAUSE_TIME] - animation.delay;
        else 
          t = now - this[START_TIME].get(animation)  - this[PAUSE_TIME] - animation.delay;

        if (animation.duration < t) {
          console.log('animation end')
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }

        if (t > 0) {
           // 小于0说明还没开始
           animation.receiveTime(t)
        }
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    }

    this[TICK]();
  }

  // set rate() {}
  // get rate() {}

  pause() {
    if (this.state !== 'started') return;
    this.state = 'paused';

    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER])
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'started'

    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }

  reset() {
    this.pause();
    this.state = 'init'
    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[ANIMATIONS] = new Set();
    this[PAUSE_START] = 0;
    this[START_TIME] = new Map();
    this[TICK_HANDLER] = null;
  }

  add(animation, startTime = Date.now()) {
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
}

export class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction , template) {
    timingFunction = timingFunction || (v => v);
    template = template || (v => v);

    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
    this.delay = delay;
    this.template = template;
  }

  receiveTime(time) {
    let range = this.endValue - this.startValue;
    let progress = this.timingFunction(time / this.duration);
    this.object[this.property] = this.template(this.startValue + range * progress);
  }
}