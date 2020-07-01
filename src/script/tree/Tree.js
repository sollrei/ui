class Tree {
  /**
   * @param {*} selector 
   * @param {object=} options 
   */
  constructor(selector, options) {
    const defaultSettings = {
      padding: 24,
      data: [],
      check: true,
      callback: null
    };

    const settings = Object.assign({}, defaultSettings, options);

    this.settings = settings;
    this.init(selector);
  }

  /**
   * @param {*} selector 
   */
  init(selector) {
    let wrap = selector;

    if (typeof selector === 'string') {
      wrap = document.querySelector(selector);
    }

    if (!wrap) return;

    const { data, callback } = this.settings;

    this.wrap = wrap;

    
    this.wrap.innerHTML = this.createTreeDom(data);

    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  /**
   * @param {Array} data 
   * @param {number=} level 
   * @returns {string} tree html
   */
  createTreeDom(data, level = 0) {
    let str = '';
    
    data.forEach(item => {
      if (item.children) {
        let child = this.createTreeDom(item.children, level + 1);
        const label = this.createLabel(item, level);
        str += `<div class="tree-group">${label}${child}</div>`;
      } else {
        str += this.createNode(item, level);
      }
    });

    return str;
  }

  /**
   * @param {object} item
   * @param {number} level
   * @returns {string} trigger node html
   */
  createLabel(item, level) {
    const { padding } = this.settings;
    const { id, name } = item;
    return `<div class="node-label node-trigger expend" style="padding-left: ${level * padding}px">
    <label class="ui-checkbox"><input type="checkbox" class="check-all" value="${id}"><i class="iconfont"></i><span>${name}</span></label>
  </div>`;
  }

  /**
   * @param {object} item
   * @param {number} level
   * @returns {string} normal node html
   */
  createNode(item, level) {
    const { padding } = this.settings;
    const { id, name } = item;
    return `<div class="tree-node">
    <div class="node-label" style="padding-left: ${padding * (level + 1)}px">
      <label class="ui-checkbox"><input type="checkbox" value="${id}"><i class="iconfont"></i><span>${name}</span></label>
    </div>
  </div>`;
  }
}

export default Tree;
