class Scroll {
  constructor(selector, option) {
    const defaultSettings = {
      duration: 2000,
      speed: 0.3
    };

    this.settings = Object.assign({}, defaultSettings, option);
    this.init(selector);
  }

  init(selector) {
    let element = selector;
    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }
    
    if (!element) return;

    const row = element.children[0];

    this.rowHeight = Scroll.getRowHeight(row);
    this.fullHeight = element.offsetHeight;
    this.parent = element.parentNode;
    this.cloneElement = this.createCloneNode(element);
    
    this.parent.style.transition = `transform ${this.settings.speed}s`;
    this.top = 0;

    this.scroll();
    this.events();
  }

  static getRowHeight(ele) {
    const height = ele.offsetHeight;
    const styles = window.getComputedStyle(ele);
    const marginTop = parseFloat(styles.marginTop);
    const marginBottom = parseFloat(styles.marginBottom);
    const fullHeight = height + marginTop + marginBottom;

    return fullHeight;
  }

  createCloneNode(element) {
    const { rowHeight, parent } = this;
    const clientHeight = parent.parentNode.clientHeight;
    const num = Math.ceil(clientHeight / rowHeight);
    const copyNode = element.cloneNode();
    const range = new Range();
    range.selectNodeContents(element);

    let fragment = range.cloneContents();
    const newFrag = document.createDocumentFragment();

    for (let i = num - 1; i >= 0; i -= 1) {
      newFrag.insertBefore(fragment.children[i], newFrag.children[0]);
    }

    copyNode.appendChild(newFrag);
    copyNode.classList.add('ele--copy');
    return element.parentNode.appendChild(copyNode);
  }

  scroll() {
    const { rowHeight, fullHeight, parent } = this;
    const { duration, speed } = this.settings;

    this.timer = setInterval(() => {
      this.top += rowHeight;
      let top = this.top;

      if (top === rowHeight) {
        parent.style.transition = `transform ${speed}s`;
      }
      parent.style.transform = `translateY(-${top}px)`;
      
      if (top >= fullHeight) {
        this.top = 0;
      }
    }, duration);
  }

  events() {
    const { parent } = this;

    parent.addEventListener('transitionend', () => {
      if (this.top === 0) {
        parent.style.transition = 'none';
        parent.style.transform = 'translateY(0)';
      }
    });

    parent.addEventListener('mouseenter', () => {
      clearInterval(this.timer);
    });

    parent.addEventListener('mouseleave', () => {
      this.scroll();
    });
  }
}

export default Scroll;
