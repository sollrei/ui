export default {
  getObjectUrl(file) {
    let URL = window.URL || window.webkitURL;
    if (!URL) return '';
    return URL.createObjectURL(file);
  },

  createImage(data) {
    const isImage = data.file.type.indexOf('image') > -1;
    const url = isImage ? this.getObjectUrl(data.file) : '';
    
    const img = `<div class="image uploading">
        <img src="${url}">
        <div class="opt">
          <div class="del">&times;</div>
          <div class="pro">上传中</div>
          <input type="hidden" name="image[]">
        </div>
      </div>`;
    const div = document.createElement('div');
    div.className = 'ui-upload-img';
    div.id = data.id;
    div.innerHTML = img;

    document.querySelector('#wrap').appendChild(div);
  },

  changeImage(id, url) {
    const wrap = document.getElementById(id);

    if (wrap) {
      wrap.querySelector('.image').classList.remove('uploading');
      wrap.querySelector('img').setAttribute('src', url);
      wrap.querySelector('input').value = url;
    }
  }
};
