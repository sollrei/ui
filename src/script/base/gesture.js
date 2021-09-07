export class Dispatcher {
  constructor(element) {
    this.element = element;
  }

  dispatch(type, properties) {
    if (window.Event) {
      this.eventDispatch(type, properties);
    } else if (window.CustomEvent) {
      this.customEventDispatch(type, properties);
    }
  }

  eventDispatch(type, properties) {
    let event = new Event(type);
    event.detail = properties;

    this.element.dispatchEvent(event);
  }

  customEventDispatch(type, properties) {
    let event = new CustomEvent(type, {
      detail: properties
    });

    this.element.dispatchEvent(event);
  }
}

export class Listener {
  constructor(element, recognize) {
    let isListeningMouse = false;
    let contexts = new Map();

    // e.button 0 left 1 middle 2 right
    element.addEventListener('mousedown', e => {
      let context = Object.create(null);
      contexts.set('mouse' + (1 << e.button), context); // 0,1,2 -> 1,2,4
      recognize.start(e, context);
    
      let mousemove = event => {
        // e.buttons 1 left 2 right 4 middle
        let button = 1;
        while (button <= event.buttons) {
          if (button & event.buttons) {
            let key;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button;
            }
    
            let _context = contexts.get('mouse' + key);
            recognize.move(event, _context);
          }
          
          button <<= 1; // 1 2 4
        }
      };

      let mouseup = event => {
        let _context = contexts.get('mouse' + (1 << event.button));
        recognize.end(event, _context);

        contexts.delete(contexts.get('mouse' + (1 << event.button)));
    
        if (event.buttons === 0) {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
          isListeningMouse = false;
        }
      };
    
      if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
      }
    });


    element.addEventListener('touchstart', e => {
      for (let touch of e.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognize.start(touch, context);
      }
    });

    element.addEventListener('touchmove', e => {
      for (let touch of e.changedTouches) {
        const context = contexts.get(touch.identifier);
        recognize.move(touch, context);
      }
    });

    element.addEventListener('touchend', e=> {
      for (let touch of e.changedTouches) {
        const context = contexts.get(touch.identifier);
        recognize.end(touch, context);
        contexts.delete(touch.identifier);
      }
    });

    // 比如alert打断
    element.addEventListener('touchcancel', e => {
      for (let touch of e.changedTouches) {
        const context = contexts.get(touch.identifier);
        recognize.cancel(touch, context);
        contexts.delete(touch.identifier);
      }
    });
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  start(point, context) {
    context.startX = point.clientX;
    context.startY = point.clientY;
  
    this.dispatcher.dispatch('start', {
      clientX: point.clientX,
      clientY: point.clientY,
      startX: context.startX,
      startY: context.startY,
      origin: point
    });

    context.points = [{
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    }];
  
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
  
    context.handler = setTimeout(() => {
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      context.handler = null;
  
      this.dispatcher.dispatch('press', {});
    }, 500);
  }
  
  move(point, context) {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
  
    if (!context.isPan && (((dx ** 2) + (dy ** 2)) > 100)) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);

      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        origin: point
      });

      clearTimeout(context.handler);
    }
  
    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      });
    }
  
    context.points = context.points.filter(item => Date.now() - item.t < 500);
  
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    });
  }
  
  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch('tap', {});
      clearTimeout(context.handler);
    }
    if (context.isPress) {
      this.dispatcher.dispatch('pressend', {});
    }
    
    context.points = context.points.filter(item => Date.now() - item.t < 500);
  
    let d;
    let v;
  
    if (!context.points.length) {
      v = 0;
    } else {
      d = (Math.sqrt((point.clientX - context.points[0].x) ** 2) 
        + ((point.clientY - context.points[0].y) ** 2));
      v = d / (Date.now() - context.points[0].t);
    }
  
    if (v > 1.5) { // 像素每毫秒
      context.isFlick = true;
    } else {
      context.isFlick = false;
    }

    if (context.isFlick) {
      this.dispatcher.dispatch('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v
      });
    }

    if (context.isPan) {
      this.dispatcher.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v
      });
    }
    
    this.dispatcher.dispatch('end', {
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY,
      isVertical: context.isVertical,
      isFlick: context.isFlick,
      velocity: v
    });
  }
  
  cancel(point, context) {
    clearTimeout(context.handler);
    this.dispatcher.dispatch('cancel', {});
  }
}

export const enableGesture = (element) => {
  new Listener(element, new Recognizer(new Dispatcher(element)));
};
