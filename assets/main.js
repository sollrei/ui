window.onload = function () {
  var arr = '';
  
  // create side index
  [].slice.call(document.querySelectorAll('.page-code h2')).forEach(function (item) {
    var name = item.innerText;
    var id = item.id;
    arr += '<li><a href="#' + id + '">' + name + '</a></li>';
  });

  document.querySelector('.page-menu-list').innerHTML = '<ul>' + arr + '</ul>';
};
