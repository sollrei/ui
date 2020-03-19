function isObject(obj) {
  return ((typeof obj === 'object') && (obj !== null));
}

let errorMessage = {
  InternalError: '上传错误',
  InvalidFileExtensionError: '文件格式不正确',
  InvalidFileTypeError: '文件格式不正确',
  MaxFileSizeError: '文件过大',
  RequestError: '上传失败',
  UnsupportedError: '浏览器不支持此种上传',
  MultipleUnsupportedError: '不支持多文件上传'
};

class Upload {
  constructor(url, input, options) {
    const defaultSettings = {
      files: null,
      limit: 0, // 一次能同时添加的数量
      maxSize: 0,
      data: {},

      fileType: [], // 例 ['.jpeg', '.png', '.gif']

      fileName: 'file', // upload key

      dataType: 'json',

      maxUploads: 1000, // 假定系统能支持的上传数量

      
      init: null,
      start() { return true; },
      beforeUploadStart: null,
      beforeUpload: null,
      progress: null,
      success: null,
      error: null,
      cancel: null,
      complete: null,
      finish: null
    };

    this.settings = Object.assign({}, defaultSettings, options);

    this.uploads = [];
    this.uploadContexts = []; // 保存的所有添加进来的文件
    this._uploadData = [];
    this.queuedFilesCount = 0;
    this.activeUploads = 0;
    this.ajaxUrl = url;

    this.create(input);
  }

  create(element) {
    const { files, fileName } = this.settings;
    let input = element;
    
    if (!isObject(input) && !files) return;

    if (isObject(input) && input.length > 1) {
      input = input[0];
    }

    let name = (input && input.name) || fileName;
    let _files = files || input.files;

    this.fileName = name;
    this.files = _files;
    this.input = input;
    
    let fileNum = this.countFileNum();
    this.fileNum = fileNum;

    if (fileNum > 0) {
      // 初始化保存上传文件信息
      this.initUploadContext(fileNum, _files, input);

      // 考虑是否需要init回调限制上传数量

      const remaining = this.initRemaining();
      this.remaining = remaining; // array of file index

      if (remaining.length) {
        this.queuedFilesCount = remaining.length;
        this.activeUploads = remaining.length;

        this.queueUpload(remaining);

        this.beforeUploadStart();
      } else {
        this.uploadContexts.forEach((item, index) => {
          this.setUploadState(index, 4);
        });
        this.finish();
      }
    } else {
      this.finish();
    }
  }

  countFileNum() {
    const { files, input } = this;
    const { limit } = this.settings;

    if (files && files.length) {
      return (limit <= 0) ? files.length : Math.min(limit, files.length);
    }

    if (input.value) return 1;
    return 0;
  }

  static createId() {
    return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
  }

  initUploadContext(fileNum, files, input) {
    const { uploadContexts, _uploadData } = this;

    [...Array(fileNum)].forEach((itm, i) => {
      const id = Upload.createId();
      _uploadData[i] = {
        state: 0,
        id,
        xhr: null
      };
      
      uploadContexts[i] = {
        index: i,
        id,
        state: 'init',
        file: (files !== null ? files[i] : {
          name: input.value.split(/(\\|\/)/g).pop()
        }),
        cancel() {
          const state = this.getUploadState(i);
          if (state === 0) {
            this.setUploadState(i, 4);
          } else if (state === 1) {
            this.setUploadState(i, 4);
            const data = _uploadData[i];

            if (data.xhr !== null) {
              data.xhr.abort();
              data.xhr = null;
            }

            this.cancel(i);
          } else {
            return false;
          }

          return true;
        }
      };
    });
  }

  getUploadState(num) {
    return this._uploadData[num].state;
  }

  /**
   * 
   * @param num {number} file index
   * @param state {number} file state
   */ 
  setUploadState(num, state) {
    const stateText = {
      0: 'init',
      1: 'uploading',
      2: 'success',
      3: 'error',
      4: 'cancel'
    };

    this._uploadData[num].state = state;
    this.uploadContexts[num].state = stateText[state];
  }

  initRemaining() {
    const fileNum = this.fileNum;
    let remaining = [];

    for (let i = 0; i < fileNum; i += 1) {
      if (this.init(i) !== false) {
        remaining.push(i);
      }
    }

    return remaining;
  }

  /**
   * 
   * @param remaining {array} file index array
   */ 
  queueUpload(remaining) {
    let result = []; // 文件类型和大小合法的文件index
    remaining.forEach((item) => {
      if (this.validFile(item)) {
        if (this.start(item)) {
          result.push(item);
        }
      }
    });

    if (result.length) {
      this.uploads.push(result); // [1,3,4,5...]
    }
  }

  static getFileExtension(filename) {
    let dotPos = filename.lastIndexOf('.');
    return (dotPos !== -1) ? filename.substr(dotPos).toLowerCase() : '';
  }

  static validateFileSize(maxSize, file) {
    if (file) {
      let { size } = file;
      if (size && typeof size === 'number') {
        return size <= maxSize;
      }
    }

    return true;
  }

  validateFileExtension(file) {
    const validExtension = this.settings.fileType;
    const input = this.input;
    
    if (file && file.name) {
      const name = Upload.getFileExtension(file.name);
      return validExtension.lastIndexOf(name) > -1;
    }
    
    if (isObject(input) && input.value) {
      const _name = Upload.getFileExtension(input.value);
      return validExtension.lastIndexOf(_name) > -1;
    } 

    return true; // can't valid // or return false ?
  }

  validFile(num) {
    const { input, files } = this;
    const { fileType, maxSize } = this.settings;
    let file;
    if (this.getUploadState(num) !== 1) return false;

    if (files !== null) {
      if (files[num]) {
        file = files[num];
      } else {
        this.error(num, 'InternalError');
        return false;
      }
    } else if (!input.value) {
      this.error(num, 'InternalError');
      return false;
    }

    if (fileType.length && !this.validateFileExtension(file)) {
      this.error(num, 'InvalidFileExtensionError');
      return false;
    }
    
    if (maxSize > 0 && !Upload.validateFileSize(maxSize, file)) {
      this.error(num, 'InvalidFileExtensionError');
      return false;
    }

    return true;
  }

  init(num) {
    const { init } = this.settings;

    if (this.getUploadState(num) > 0) {
      return false;
    }

    if (init) {
      if (init.call(this.uploadContexts[num]) === false) {
        this.setUploadState(num, 4);
        return false;
      }
    }

    this.setUploadState(num, 1);

    return true;
  }

  start(num) {
    const { start } = this.settings;

    if (start) {
      if (start.call(this.uploadContexts[num]) === false) {
        this.setUploadState(num, 4);
        return false;
      }
    }

    return true;
  }

  beforeUploadStart() {
    const { beforeUploadStart } = this.settings;
    if (beforeUploadStart) {
      beforeUploadStart(this.uploadContexts, (next) => {
        if (next) {
          this.uploadNext();
        }
      });
    } else {
      this.uploadNext();
    }
  }

  uploadNext() {
    const { maxUploads, beforeUpload, data } = this.settings;
    const self = this;
    
    if (this.uploads.length && (this.activeUploads < maxUploads)) {
      let upload = this.uploads[0];
      let uploadNum = upload.shift();

      if (!upload.length) {
        this.uploads.shift();
      }

      if (beforeUpload) {
        beforeUpload.call(this.uploadContexts[uploadNum], uploadNum, (next, _data) => {
          if (next) {
            self.uploadFile(uploadNum, _data || data);
          }
        });
      } else {
        this.uploadFile(uploadNum, data);
      }

      if (this.uploads.length) {
        this.uploadNext();
      }
    }
  }

  objectToFormData(formData, obj, parent) {
    Object.keys(obj).forEach(key => {
      const item = obj[key];
      const k = !parent ? key : `${parent}[${key}]`;
    
      if (!item) {
        formData.append(k, '');
      } else if (typeof item === 'object') {
        this.objectToFormData(formData, item, k);
      } else {
        formData.append(k, item.toString());
      }
    });
  }

  uploadFile(num, data) {
    if (this.getUploadState(num) !== 1) return;
    const { files, fileName } = this;
    const self = this;

    if (files !== null) {
      let file = files[num];
      let formData = new FormData();

      this.objectToFormData(formData, data);

      formData.append(fileName, file);

      const _xhr = new XMLHttpRequest();

      _xhr.addEventListener('error', function (xhr) {
        self._uploadData[num].xhr = null;
        self.error(num, {
          name: 'RequestError',
          message: errorMessage.RequestError,
          xhr: xhr
        });
      }, false);

      _xhr.upload.addEventListener('progress', function (e) {
        if (e.lengthComputable) {
          self.progress(num, (e.loaded / e.total) * 100);
        }
      }, false);

      _xhr.addEventListener('load', function () {
        if (_xhr.status === 200) {
          self._uploadData[num].xhr = null;

          self.progress(num, 100);
          self.success(num, _xhr.responseText);
        }
      }, false);

      _xhr.open('POST', this.ajaxUrl, true);
      _xhr.send(formData);
    } else {
      this.error(num, 'InternalError');
    }
  }

  progress(num, pro) {
    const { progress } = this.settings;

    if (this.getUploadState(num) === 1) {
      if (progress) {
        progress.call(this.uploadContexts[num], pro);
      }
    }
  }

  success(num, data) {
    const { success, dataType } = this.settings;
    let _data = data;

    if (this.getUploadState(num) === 1) {
      this.setUploadState(num, 2);
    }

    if (success) {
      if (dataType === 'json') {
        try {
          _data = JSON.parse(data);
        } catch (e) {
          throw new Error(e);
        }
      }
      success.call(this.uploadContexts[num], _data);
    }

    this.fileComplete(num, 'success');
  }

  error(num, err) {
    const { error } = this.settings;
    let errObj = err;

    if (typeof err === 'string') {
      errObj = {
        name: err,
        message: errorMessage[err]
      };
    }

    if (this.getUploadState(num) === 1) {
      this.setUploadState(num, 3);

      if (error) {
        error.call(this.uploadContexts[num], errObj);
      }

      this.fileComplete(num, 'error');
    }
  }

  /**
   * 单个文件上传结束
   * @param num {number} file index
   * @param status {string} file status
   */
  complete(num, status) {
    const { complete } = this.settings;
    
    if (complete) {
      complete.call(this.uploadContexts[num], status);
      // status如果和uploadContexts里的一致可以删除
    }
  }

  /**
   * 单个文件取消上传 -> 文件上传结束
   * @param num {number} file index
   * */ 
  cancel(num) {
    const { cancel } = this.settings;

    if (cancel) {
      cancel.call(this.uploadContexts[num]);
    }

    this.fileComplete(num, 'cancel');
  }

  /**
   * @param num {number} file index
   * @param status {string}
   * */ 
  fileComplete(num, status) {
    this.complete(num, status);

    this.queuedFilesCount -= 1;

    if (this.queuedFilesCount === 0) {
      this.finish();
    }
    
    this.activeUploads -= 1;
  }
  
  // 整个上传结束
  finish() {
    const { finish } = this.settings;
    if (finish) {
      finish.call(this.uploadContexts);
    }
  }
}

export default Upload;
