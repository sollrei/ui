import Page from './script/data/Pagination.es6';

window.Page = Page;

new Page('#test', {
  total: 120,
  page: 1,
  size: 10,
  pages: 5
});

