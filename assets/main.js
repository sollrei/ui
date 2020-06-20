window.onload = function () {
  var arr = '';
  
  var ui = window.ui;
  
  var Table = ui.Table;

  
  var demo;
  
  // create side index
  [].slice.call(document.querySelectorAll('.page-code h2')).forEach(function (item) {
    var name = item.innerText;
    var id = item.id;
    arr += '<li><a href="#' + id + '">' + name + '</a></li>';
  });

  document.querySelector('.page-menu-list').innerHTML = '<ul>' + arr + '</ul>';

  // demo 
  demo = {
    initTable() {
      if (document.querySelector('#js-table')) {
        fetch('https://api.cooode.xyz/api/ui-demo-table').then(res => res.json()).then(res => {
          if (res.code === 200) {
            const table = new Table('#js-table', {
              header: [{
                name: 'type',
                label: '类型',
                width: 100
              }, {
                name: 'name',
                label: '名称',
                width: 200
              }],
              total: res.data.total,
              page: res.data.current,
              data: res.data.table,
              onChangePage(page, cb) {
                fetch('https://api.cooode.xyz/api/ui-demo-table?page=' + page)
                  .then(_res => _res.json())
                  .then(_res => {
                    if (_res.code === 200) {
                      table.updateList(_res.data.table);
                      cb(true);
                    }
                  });
              }
            });
          }
        });
      }
    }
  };

  demo.initTable();
};
