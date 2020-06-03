import u from '../base/util.es6';

// const demo = {
//   // pagination in dialog
//   // pagination in page
//   page(wrap) {
//     const self = this;
//     const _wrap = wrap || $('.ui-pagination');

//     if (!_wrap.length) return;

//     const selectNum = $('.js-select', _wrap);
//     const pageNum = $('input', _wrap);

//     selectNum.on('change', function () {
//       const value = this.value;
//       location.href = self.dealPageUrl('limit', value);
//     });

//     pageNum.on('keyup', function (e) {
//       if (e.keyCode === 13) {
//         const value = this.value;
//         location.href = self.dealPageUrl('page', value);
//       }
//     });
//   }

// };

class Pagination {
  constructor(options) {
    const defaultSettings = {
      total: 0,
      current: 1,
      size: 5, // data number per page
      page: 5 // page number
    };

    this.settings = Object.assign({}, defaultSettings, options);
    this.init();
  }

  init() {
    const { total, current, size, page } = this.settings;
  }

  static createNormalPage(number) {
    return `<a href="javascript:;" class="page" data-page="${number}">${number}</a>`;
  }

  static createCurrentPage(number) {
    return `<span class="page active" data-page="${number}">${number}</span>`;
  }

  static createPageMenu(className, pageNum, icon) {
    return `<a href="javascript:;" class="page ${className}" data-page="${pageNum}"><i class="iconfont icon-arrow-${icon}"></i></a>`;
  }

  static createMenu(current, max, type) {
    
  }

  static createPrev(current) {
    const disableClass = current === 1 ? 'disabled' : '';
    const pageNum = current - 1;
    const icon = 'left';
    return Pagination.createPageMenu(disableClass, pageNum, icon);
  }

  static createNext(current, max) {
    let disableClass = current === max ? 'disabled' : '';
    const pageNum = current + 1;
    const icon = 'right';
    return Pagination.createPageMenu(disableClass, pageNum, icon);
  }

  createPageDom(current) {
    const { total, size, page } = this.settings; 

    if (total <= size) return '';

    const pageArr = Pagination.createPageArray(total, current, page, size);

    let pageHtml = pageArr.reduce((pre, cur) => cur === current 
      ? pre + Pagination.createCurrentPage(cur) 
      : pre + Pagination.createNormalPage(cur), '');

    pageHtml = Pagination.createPrev(current)
       + pageHtml
       + Pagination.createNext(current, pageArr.length)
       + '<span class="text">跳至</span><input class="ui-form-control js-jump-page" type="number" name="page" autocomplete="off"><span class="text">页</span>';

    return pageHtml;
  }


  static createPageArray(total, current, pageShowNum, count = 5) {
    const pageTotal = Math.ceil(total / count);
    const middle = Math.ceil(pageShowNum / 2);
    const half = Math.floor(pageShowNum / 2);

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
