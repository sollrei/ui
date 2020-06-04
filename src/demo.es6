import Page from './script/data/Pagination.es6';

window.Page = Page;

const page = new Page('#test', {
  total: 120,
  page: 9,
  size: 10,
  pages: 5
});

console.log(page);
