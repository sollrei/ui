import u from '../base/util.js';
// https://javascript.info/selection-range
class Editor {
  constructor(options) {
    const defaultSettings = {
      selector: '#editor',
      toolbar: ['undo', 'redo', 'font', 'size', 'bold', 'italic', 'alignLeft', 'alignRight', 'underline', 'ul', 'ol'] 
    };

    const settings = Object.assign({}, defaultSettings, options);

    this.settings = settings;
    this.init();
  }

  init() {
    const { selector } = this.settings;
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!element) return;

    this.wrap = element;

    this.initToolbar();
  }

  static createContent() {
    const div = document.createElement('div');

    div.contentEditable = true;
    div.className = 'editor-content';

    return div; 
  }

  static boldMenu() {
    return '<button type="button" class="btn bold" data-command="bold"><i class="iconfont icon-blod"></i></button>';
  }

  static undoMenu() {
    return '<div class="btn undo"><i class="iconfont icon-undo"></i></div>';
  }

  static fontMenu() {
    return '<div class="btn font"><i class="iconfont icon-font"></i></div>';
  }

  static sizeMenu() {
    return '<button class="btn size" type="button"><i class="iconfont icon-fontsize"></i></button>';
  }

  static italicMenu() {
    return '<button type="button" data-command="italic" class="btn italic"><i class="iconfont icon-italic"></i></button>';
  }

  static underlineMenu() {
    return '<button type="button" data-command="underline" class="btn underline"><i class="iconfont icon-underline"></i></button>';
  }

  static alignLeftMenu() {
    return '<button class="btn align-left" data-command="justifyLeft"><i class="iconfont icon-align-left"></i></button>';
  }

  static alignRightMenu() {
    return '<button class="btn align-right" data-command="justifyRight"><i class="iconfont icon-align-right"></i></button>';
  }

  static ulMenu() {
    return '<button class="btn ul" data-command="insertUnorderedList"><i class="iconfont icon-list-dot"></i></button>';
  }

  static olMenu() {
    return '<button class="btn ol" data-command="insertOrderedList"><i class="iconfont icon-list-number"></i></button>';
  }

  static quoteMenu() {
    return '<button class="btn quote" data-command="formatBlock"><i class="iconfont icon-ol"></i></button>';
  }

  initToolbar() {
    const { wrap } = this;
    const { toolbar } = this.settings;

    if (!Array.isArray(toolbar)) {
      console.warn('error toolbar type');
      return;
    }

    const str = toolbar.reduce((pre, cur) => {
      let item = cur + 'Menu';

      if (Editor[item] && typeof Editor[item] === 'function') {
        return pre + Editor[item]();
      }

      return pre;
    }, '');

    const toolbarElement = document.createElement('div');
    const contentElement = Editor.createContent();

    toolbarElement.className = 'toolbar';
    toolbarElement.innerHTML = str;
    
    this.toolbar = wrap.appendChild(toolbarElement);
    this.content = wrap.appendChild(contentElement);

    this.addMenuEvents();
  }

  handleMenuClick(btn) {
    const command = btn.getAttribute('data-command');
    const self = this;

    if (command) {
      document.execCommand(command, false);
    } else {
      const selection = document.getSelection();
      this.selection = selection.getRangeAt(0);
      this.txt = selection.toString();
      console.log(selection.getRangeAt(0))
    }
  }

  addMenuEvents() {
    const self = this;

    u.on(this.toolbar, 'click', '.btn', function () {
      self.handleMenuClick(this);
    });

    document.getElementById('sub').addEventListener('click', function (e) {
      e.preventDefault();
      
      const value = document.getElementById('input').value;
      const oldSelection = self.selection;

      // window.getSelection().removeAllRanges();

      const range = document.createRange(oldSelection);
      console.log(range, this.txt)

      const dom = `<a href="${value}">${self.txt}</a>`;
      document.execCommand('insertHTML', false, dom);
    });
  }

  // redo() {

  // }

  // undo() {

  // }

  // fullscreen() {

  // }

  // unFullscreen() {

  // }
}

new Editor({
  selector: '#editor'
});

export default Editor;
