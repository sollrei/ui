document.querySelector('.btn').addEventListener('click', function () {
  let selObj = window.getSelection();

  console.log(selObj.toString());
}, false);
