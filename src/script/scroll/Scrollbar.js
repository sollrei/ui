// 参考： https://www.bennadel.com/blog/3864-copying-slacks-brilliant-virtual-scrollbar-and-overflow-container-in-angular-9-1-12.htm

class Scrollbar {
  constructor(element) {
    this.contentHeight = 0;

    this.draggingStateViewportTop = 0;
    this.draggingStateViewportBottom = 0;
    this.draggingStateViewportHeight = 0;

    this.scrollbarHeight = 0;
    this.scrollbarThumbHeight = 0;
    this.scrollHeight = 0;
    this.scrollPercentage = 0;
    this.scrollTop = 0;
    this.viewportHeight = 0;

    this.viewportElement = element.querySelector('.viewport');
    this.scrollbarElement = element.querySelector('.scrollbar');
    this.scrollbarThumbElement = element.querySelector('.scroll_thumb');

    let observer = new MutationObserver(() => {
      this.initState();
    });

    observer.observe(this.viewportElement, {
      childList: true,
      subtree: true,
      attributes: true
    });

    this.passiveStateSetup();
  }

  clamp(value, minValue, maxValue) {
    return (Math.min(Math.max(value, minValue), maxValue));
  }

  initState() {
    const { viewportElement, scrollbarElement, scrollbarThumbElement } = this;

    this.viewportHeight = viewportElement.clientHeight;
    this.contentHeight = viewportElement.scrollHeight;

    this.scrollHeight = (this.contentHeight - this.viewportHeight);
    this.scrollbarHeight = scrollbarElement.clientHeight;

    this.scrollbarThumbHeight = this.viewportHeight ** 2 / this.contentHeight;
    scrollbarThumbElement.style.height = this.scrollbarThumbHeight + 'px';
  }

  passiveStateSetup() {
    const { viewportElement, scrollbarElement } = this;

    this.initState();
    viewportElement.addEventListener( "scroll", this.freshScrollThumbStyle, { passive: true });
    scrollbarElement.addEventListener( "mousedown", this.passiveStateHandleScrollbarMousedown );
  }

  freshScrollThumbStyle = () => {
    this.calculateViewportScrollPercentage();
    this.updateThumbPositionToMatchScrollPercentage();
  }

  calculateViewportScrollPercentage() {
    if (this.scrollHeight) {
      this.scrollTop = this.viewportElement.scrollTop;
      this.scrollPercentage = (this.scrollTop / this.scrollHeight);
    } else {
      this.scrollTop = 0;
      this.scrollPercentage = 0;
    }
  }

  updateThumbPositionToMatchScrollPercentage() {
    const offset = ((this.scrollbarHeight - this.scrollbarThumbHeight) * this.scrollPercentage);
    this.scrollbarThumbElement.style.transform = `translateY( ${offset}px )`;
  }

  passiveStateHandleScrollbarMousedown = event => {
    event.preventDefault();

    if (event.target === this.scrollbarThumbElement) {
      this.passiveStateTeardown();
      this.draggingStateSetup(event);
    } else {
      this.passiveStateTeardown();
      this.pagingStateSetup(event);
    }
  }

  passiveStateTeardown() {
    const { viewportElement, scrollbarElement } = this;
    viewportElement.removeEventListener("scroll", this.freshScrollThumbStyle, { passive: true });
    scrollbarElement.removeEventListener("mousedown", this.passiveStateHandleScrollbarMousedown);
  }

  draggingStateSetup(event) {
    const { viewportElement, scrollbarThumbElement, scrollbarElement } = this;
    const viewportRect = viewportElement.getBoundingClientRect();
    const { top, height } = scrollbarThumbElement.getBoundingClientRect();
    const thumbLocalY = event.clientY - top;

    this.draggingStateViewportTop = (viewportRect.top + thumbLocalY);
    this.draggingStateViewportBottom = (viewportRect.bottom - height + thumbLocalY);
    this.draggingStateViewportHeight = (this.draggingStateViewportBottom - this.draggingStateViewportTop);

    scrollbarElement.classList.add("scrollbar--dragging");

    window.addEventListener("mousemove", this.draggingStateMousemove);
    window.addEventListener("mouseup", this.draggingStateMouseup);
  }

  draggingStateMousemove = (event) => {
    const clientY = this.clamp(event.clientY, this.draggingStateViewportTop, this.draggingStateViewportBottom);
    const localOffset = clientY - this.draggingStateViewportTop;
    const localOffsetPercentage = localOffset / this.draggingStateViewportHeight;

    this.viewportElement.scrollTop = localOffsetPercentage * this.scrollHeight;

    this.freshScrollThumbStyle();
  }

  draggingStateMouseup = () => {
    this.removeDraggingEvents();
    this.passiveStateSetup();
  }

  removeDraggingEvents() {
    this.scrollbarElement.classList.remove("scrollbar--dragging");
    window.removeEventListener("mousemove", this.draggingStateMousemove);
    window.removeEventListener("mouseup", this.draggingStateMouseup);
  }
  
  pagingStateSetup(event) {
    const { viewportElement, scrollbarThumbElement } = this;
    const scrollbarThumbRect = scrollbarThumbElement.getBoundingClientRect();

    if (event.clientY < scrollbarThumbRect.top) {
      viewportElement.scrollTop = Math.max(0, (this.scrollTop - this.viewportHeight));
    } else {
      viewportElement.scrollTop = Math.min(this.scrollHeight, (this.scrollTop + this.viewportHeight));
    }

    this.freshScrollThumbStyle();

    this.pagingStateTeardown();
    this.passiveStateSetup();
  }

  pagingStateTeardown() {}
}

export default Scrollbar;


