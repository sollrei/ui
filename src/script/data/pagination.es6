import u from '../base/util.es6';

class Pagination {
  constructor(selector, options) {
    const defaultSettings = {
      total: 0,
      page: 1,
      size: 5,  // data length per page
      pages: 5  // page number
    };

    this.settings = Object.assign({}, defaultSettings, options);
    this.init(selector);
  }

  init(selector) {
    let element = selector;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    }

    if (!element) return;
    
    this.wrapper = element;
    
    this.page = this.settings.page;
    
    
  }

  static createNormalPageItem(number) {
    return `<a href="javascript:;" class="page" data-page="${number}">${number}</a>`;
  }

  static createCurrentPageItem(number) {
    return `<span class="page active" data-page="${number}">${number}</span>`;
  }
  
  static createInput() {
    return '<span class="text">跳至</span><input class="ui-form-control js-jump-page" type="number" name="page" autocomplete="off"><span class="text">页</span>';
  }
  
  static createArray(start, length) {
    return Array.from({ length }).map((item, index) => index + start);
  }
  
  static createPageArray({total, page: current, pages: pageShowNum, size: count}) {
    const pageTotal = Math.ceil(total / count);
    const middle = Math.ceil(pageShowNum / 2);
    const half = Math.floor(pageShowNum / 2);
    const { createArray } = Pagination;

    let pageArr = [];

    if (pageTotal <= pageShowNum) {
      for (let i = 0; i < pageTotal; i += 1) {
        pageArr.push(i + 1);
      }
    } else if (current <= middle) {
      for (let i = 0; i < pageShowNum; i += 1) {
        pageArr.push(i + 1);
      }
    } else if (current >= pageTotal - half) {
      for (let i = 0; i < pageShowNum; i += 1) {
        pageArr.push((pageTotal - pageShowNum) + 1 + i);
      }
    } else {
      for (let i = 0; i < pageShowNum; i += 1) {
        pageArr.push((current - half) + i);
      }
    }

    return pageArr;
  }
  
  createPageNav(type, limit) {
    const className = (this.page === limit) ? 'disabled' : '';
    
    return `<a href="javascript:;" class="page ${className}" data-page="${page}">
      <i class="iconfont icon-arrow-${type}"></i>
    </a>`;
  }
  
  createPageButton(str, cur) {
    if (cur === this.page) {
      return str + `<span class="page active" data-page="${number}">${number}</span>`;
    }
    
    return str + `<a href="javascript:;" class="page" data-page="${number}">${number}</a>`;
  }

  createPageDom(page) {
    const { total, size, pages } = this.settings; 

    if (total <= size) {
      return '';
    }

    const pageArr = Pagination.createPageArray({total, pages, page, size});
    const pageHtml = pageArr.reduce(this.createPageButton, '');
    const prevButton = this.createPageNav('prev', 0);
    const nextButton = this.createPageNav('next', pageArr.length);

    return prevButton + pageHtml + nextButton + Pagination.createInput();
  }









  static dealPageUrl(name, value) {
    const url = location.href;

    if (!location.search) {
      return url + '?' + name + '=' + encodeURI(value);
    }

    const base = url.split('?')[0];
    const search = location.search.substring(1);
    let params = [];
    let hasIt = false;
    
    search.split('&').forEach(item => {
      let [_name, _value] = item.split('=');
      if (_name === name) {
        _value = value;
        hasIt = true;
      }

      params.push(_name + '=' + encodeURI(_value));
    });

    if (!hasIt) {
      return url + '&' + name + '=' + value;
    }

    return base + '?' + params.join('&');
  }
}

export default Pagination;
