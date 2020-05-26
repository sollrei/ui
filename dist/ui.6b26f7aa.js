// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/polyfill/promise-polyfill.js":[function(require,module,exports) {
var define;
var global = arguments[3];
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : factory();
})(this, function () {
  'use strict';

  var promiseFinally = function promiseFinally(callback) {
    var constructor = this.constructor;
    return this.then(function (value) {
      return constructor.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return constructor.resolve(callback()).then(function () {
        return constructor.reject(reason);
      });
    });
  }; // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())


  var setTimeoutFunc = setTimeout;

  function noop() {} // Polyfill for Function.prototype.bind


  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];
    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }

    if (self._state === 0) {
      self._deferreds.push(deferred);

      return;
    }

    self._handled = true;

    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;

      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }

      var ret;

      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }

      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');

      if (newValue && (_typeof(newValue) === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;

        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }

      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function () {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }

    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }
  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */


  function doResolve(fn, self) {
    var done = false;

    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new this.constructor(noop);
    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.prototype['finally'] = promiseFinally;

  Promise.all = function (arr) {
    return new Promise(function (resolve, reject) {
      if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (_typeof(val) === 'object' || typeof val === 'function')) {
            var then = val.then;

            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }

          args[i] = val;

          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && _typeof(value) === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  }; // Use polyfill for setImmediate for performance gains


  Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
    setImmediate(fn);
  } || function (fn) {
    setTimeoutFunc(fn, 0);
  };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  var globalNS = function () {
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof self !== 'undefined') {
      return self;
    }

    if (typeof window !== 'undefined') {
      return window;
    }

    if (typeof global !== 'undefined') {
      return global;
    }

    throw new Error('unable to locate global object');
  }();

  if (!globalNS.Promise) {
    globalNS.Promise = Promise;
  } else if (!globalNS.Promise.prototype['finally']) {
    globalNS.Promise.prototype['finally'] = promiseFinally;
  }
});
},{}],"src/polyfill/fetch-polyfill.js":[function(require,module,exports) {
var support = {
  searchParams: 'URLSearchParams' in self,
  iterable: 'Symbol' in self && 'iterator' in Symbol,
  blob: 'FileReader' in self && 'Blob' in self && function () {
    try {
      new Blob();
      return true;
    } catch (e) {
      return false;
    }
  }(),
  formData: 'FormData' in self,
  arrayBuffer: 'ArrayBuffer' in self
};

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj);
}

if (support.arrayBuffer) {
  var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

  var isArrayBufferView = ArrayBuffer.isView || function (obj) {
    return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
  };
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }

  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name');
  }

  return name.toLowerCase();
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }

  return value;
} // Build a destructive iterator for the value list


function iteratorFor(items) {
  var iterator = {
    next: function next() {
      var value = items.shift();
      return {
        done: value === undefined,
        value: value
      };
    }
  };

  if (support.iterable) {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }

  return iterator;
}

function Headers(headers) {
  this.map = {};

  if (headers instanceof Headers) {
    headers.forEach(function (value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function (header) {
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function (name) {
      this.append(name, headers[name]);
    }, this);
  }
}

Headers.prototype.append = function (name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ', ' + value : value;
};

Headers.prototype['delete'] = function (name) {
  delete this.map[normalizeName(name)];
};

Headers.prototype.get = function (name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null;
};

Headers.prototype.has = function (name) {
  return this.map.hasOwnProperty(normalizeName(name));
};

Headers.prototype.set = function (name, value) {
  this.map[normalizeName(name)] = normalizeValue(value);
};

Headers.prototype.forEach = function (callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};

Headers.prototype.keys = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push(name);
  });
  return iteratorFor(items);
};

Headers.prototype.values = function () {
  var items = [];
  this.forEach(function (value) {
    items.push(value);
  });
  return iteratorFor(items);
};

Headers.prototype.entries = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items);
};

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'));
  }

  body.bodyUsed = true;
}

function fileReaderReady(reader) {
  return new Promise(function (resolve, reject) {
    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      reject(reader.error);
    };
  });
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise;
}

function readBlobAsText(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsText(blob);
  return promise;
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf);
  var chars = new Array(view.length);

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }

  return chars.join('');
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0);
  } else {
    var view = new Uint8Array(buf.byteLength);
    view.set(new Uint8Array(buf));
    return view.buffer;
  }
}

function Body() {
  this.bodyUsed = false;

  this._initBody = function (body) {
    this._bodyInit = body;

    if (!body) {
      this._bodyText = '';
    } else if (typeof body === 'string') {
      this._bodyText = body;
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body;
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body;
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString();
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer); // IE 10-11 can't handle a DataView body.

      this._bodyInit = new Blob([this._bodyArrayBuffer]);
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body);
    } else {
      throw new Error('unsupported BodyInit type');
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8');
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type);
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
      }
    }
  };

  if (support.blob) {
    this.blob = function () {
      var rejected = consumed(this);

      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob');
      } else {
        return Promise.resolve(new Blob([this._bodyText]));
      }
    };

    this.arrayBuffer = function () {
      if (this._bodyArrayBuffer) {
        return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
      } else {
        return this.blob().then(readBlobAsArrayBuffer);
      }
    };
  }

  this.text = function () {
    var rejected = consumed(this);

    if (rejected) {
      return rejected;
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob);
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text');
    } else {
      return Promise.resolve(this._bodyText);
    }
  };

  if (support.formData) {
    this.formData = function () {
      return this.text().then(decode);
    };
  }

  this.json = function () {
    return this.text().then(JSON.parse);
  };

  return this;
} // HTTP methods whose capitalization should be normalized


var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

function normalizeMethod(method) {
  var upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method;
}

function Request(input, options) {
  options = options || {};
  var body = options.body;

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read');
    }

    this.url = input.url;
    this.credentials = input.credentials;

    if (!options.headers) {
      this.headers = new Headers(input.headers);
    }

    this.method = input.method;
    this.mode = input.mode;
    this.signal = input.signal;

    if (!body && input._bodyInit != null) {
      body = input._bodyInit;
      input.bodyUsed = true;
    }
  } else {
    this.url = String(input);
  }

  this.credentials = options.credentials || this.credentials || 'omit';

  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers);
  }

  this.method = normalizeMethod(options.method || this.method || 'GET');
  this.mode = options.mode || this.mode || null;
  this.signal = options.signal || this.signal;
  this.referrer = null;

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests');
  }

  this._initBody(body);
}

Request.prototype.clone = function () {
  return new Request(this, {
    body: this._bodyInit
  });
};

function decode(body) {
  var form = new FormData();
  body.trim().split('&').forEach(function (bytes) {
    if (bytes) {
      var split = bytes.split('=');
      var name = split.shift().replace(/\+/g, ' ');
      var value = split.join('=').replace(/\+/g, ' ');
      form.append(decodeURIComponent(name), decodeURIComponent(value));
    }
  });
  return form;
}

function parseHeaders(rawHeaders) {
  var headers = new Headers(); // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2

  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
    var parts = line.split(':');
    var key = parts.shift().trim();

    if (key) {
      var value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers;
}

Body.call(Request.prototype);

function Response(bodyInit, options) {
  if (!options) {
    options = {};
  }

  this.type = 'default';
  this.status = options.status === undefined ? 200 : options.status;
  this.ok = this.status >= 200 && this.status < 300;
  this.statusText = 'statusText' in options ? options.statusText : 'OK';
  this.headers = new Headers(options.headers);
  this.url = options.url || '';

  this._initBody(bodyInit);
}

Body.call(Response.prototype);

Response.prototype.clone = function () {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  });
};

Response.error = function () {
  var response = new Response(null, {
    status: 0,
    statusText: ''
  });
  response.type = 'error';
  return response;
};

var redirectStatuses = [301, 302, 303, 307, 308];

Response.redirect = function (url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code');
  }

  return new Response(null, {
    status: status,
    headers: {
      location: url
    }
  });
};

var DOMException = self.DOMException;

try {
  new DOMException();
} catch (err) {
  DOMException = function DOMException(message, name) {
    this.message = message;
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  };

  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}

function fetch(input, init) {
  return new Promise(function (resolve, reject) {
    var request = new Request(input, init);

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    var xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }

    xhr.onload = function () {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      };
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
      var body = 'response' in xhr ? xhr.response : xhr.responseText;
      resolve(new Response(body, options));
    };

    xhr.onerror = function () {
      reject(new TypeError('Network request failed'));
    };

    xhr.ontimeout = function () {
      reject(new TypeError('Network request failed'));
    };

    xhr.onabort = function () {
      reject(new DOMException('Aborted', 'AbortError'));
    };

    xhr.open(request.method, request.url, true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob';
    }

    request.headers.forEach(function (value, name) {
      xhr.setRequestHeader(name, value);
    });

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function () {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
  });
}

fetch.polyfill = true;

if (!self.fetch) {
  self.fetch = fetch;
  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;
}
},{}],"src/script/base/polyfill.es6":[function(require,module,exports) {
// https://developer.mozilla.org/zh-CN/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;

    if (!Element.prototype.matches) {
      return el.parentNode;
    }

    do {
      if (el.matches(s)) return el;
      el = el.parentElement;
    } while (el !== null);

    return null;
  };
}

if (typeof Object.assign !== 'function') {
  // for IE
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    /* eslint-disable-next-line */
    value: function assign(target, varArgs) {
      // .length of function is 2 
      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index += 1) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }

      return to;
    },
    writable: true,
    configurable: true
  });
}

HTMLElement.prototype.trigger = function (type, data) {
  var event = document.createEvent('HTMLEvents');
  event.initEvent(type, true, true);
  event.data = data || {};
  event.eventName = type;
  this.dispatchEvent(event);
  return this;
};

window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}();

window.cancelAnimFrame = function () {
  return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (id) {
    window.clearTimeout(id);
  };
}();
},{}],"src/script/base/util.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var util = {
  IEVersion: function IEVersion() {
    var agent = window.navigator.userAgent;
    var index = agent.indexOf('MSIE');
    return index > 0 || agent.match(/Trident.*rv:11\./) ? parseInt(agent.substring(index + 5, agent.indexOf('.', index)), 10) : 999;
  },
  forEach: function forEach(arrLike, callback) {
    [].slice.call(arrLike).forEach(callback);
  },
  isEmpty: function isEmpty(value) {
    return value === undefined || value === null || _typeof(value) === 'object' && Object.keys(value).length === 0 || typeof value === 'string' && value.trim().length === 0;
  },
  hasClass: function hasClass(element, className) {
    if (!element) return false;
    if (!element.className) return false;
    return className.match(/(\w|-)+/g).every(function (item) {
      return element.classList.contains(item);
    });
  },
  // addClass removeClass toggleClass ie10+
  addClass: function addClass(element, className) {
    if (!element || !className) return;

    if (element.classList) {
      className.match(/(\w|-)+/g).forEach(function (item) {
        element.classList.add(item);
      });
    }
  },
  removeClass: function removeClass(element, className) {
    if (!element || !className) return;

    if (element.classList) {
      className.match(/(\w|-)+/g).forEach(function (item) {
        element.classList.remove(item);
      });
    }
  },
  toggleClass: function toggleClass(element, className) {
    if (!element || !className) return;

    if (element.classList) {
      className.match(/(\w|-)+/g).forEach(function (item) {
        element.classList.toggle(item);
      });
    }
  },
  addMultiEvent: function addMultiEvent(element, eventNames, listener) {
    var eventArray = eventNames.split(' ');

    for (var i = 0, l = eventArray.length; i < l; i += 1) {
      element.addEventListener(eventArray[i], listener, false);
    }
  },
  on: function on(element, eventName, selector, handler) {
    this.addMultiEvent(element, eventName, function (event) {
      for (var target = event.target; target && target !== element; target = target.parentNode) {
        if (target.matches(selector)) {
          handler.call(target, event);
          break;
        }
      }
    });
  },

  /**
   * @param {string} type - element type
   * @param {object} attribute - element attributes
   * @param {string} html - innerHTML
   * @returns {HTMLElement}
   * */
  createElement: function createElement(type) {
    var attribute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var html = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var dom = document.createElement(type);

    for (var i in attribute) {
      if (Object.prototype.hasOwnProperty.call(attribute, i)) {
        dom[i] = attribute[i];
      }
    }

    try {
      dom.innerHTML = html;
    } catch (e) {
      console.warn('innerHTML error');
    }

    return dom;
  },
  createId: function createId() {
    return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
  },
  supportPseudo: function supportPseudo(pseudoClass) {
    // from https://gomakethings.com/testing-for-css-pseudo-class-support-with-vanilla-javascript/
    // Get the document stylesheet
    var _pseudoClass = pseudoClass;
    var ss = document.styleSheets[0]; // Create a stylesheet if one doesn't exist

    if (!ss) {
      var el = document.createElement('style');
      document.head.appendChild(el);
      ss = document.styleSheets[0];
      document.head.removeChild(el);
    } // Test the pseudo-class by trying to style with it


    var testPseudo = function testPseudo() {
      try {
        if (!/^:/.test(pseudoClass)) {
          _pseudoClass = ':' + pseudoClass;
        }

        ss.insertRule('html' + _pseudoClass + '{}', 0);
        ss.deleteRule(0);
        return true;
      } catch (e) {
        return false;
      }
    }; // Run the test


    return testPseudo();
  },

  /**
   * @param {String} url - request url
   * @param {Object} data - request data
   * @param {String} method  - request method
   * @param {Object} header
   * @returns {Promise}
   * */
  fetchData: function fetchData(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var header = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    var dataArr = [];
    var dataStr = '';

    for (var i in data) {
      if (Object.prototype.hasOwnProperty.call(data, i)) {
        dataArr.push("".concat(i, "=").concat(data[i]));
      }
    }

    dataStr = dataArr.join('&');

    if (method === 'POST') {
      return fetch(url, {
        method: method,
        headers: header,
        body: dataStr // credentials: 'include'

      }).then(function (res) {
        if (res.status) {
          return res.json();
        }

        throw new Error('post data fetch error!');
      });
    }

    var getUrl = url;

    if (dataStr) {
      getUrl = url.indexOf('?') > 0 ? "".concat(url, "&").concat(dataStr) : "".concat(url, "?").concat(dataStr);
    }

    return fetch(getUrl, {// credentials: 'include'
    }).then(function (res) {
      if (res.status) {
        return res.json();
      }

      throw new Error('get data fetch error!');
    });
  }
};
var _default = util;
exports.default = _default;
},{}],"src/script/form/InputCount.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var InputCount =
/*#__PURE__*/
function () {
  function InputCount(selector, options) {
    _classCallCheck(this, InputCount);

    var defaultSetting = {
      countElementClass: '.count',
      inputElementSelector: '.ui-form-control'
    };
    var settings = Object.assign({}, defaultSetting, options);
    this.settings = settings;
    this.init(selector);
  }

  _createClass(InputCount, [{
    key: "init",
    value: function init(selector) {
      var _this$settings = this.settings,
          countElementClass = _this$settings.countElementClass,
          inputElementSelector = _this$settings.inputElementSelector;

      _util.default.on(document, 'input', selector + ' ' + inputElementSelector, function () {
        var _this = this;

        var input = this;
        var wrap = input.closest(selector);
        var max = input.getAttribute('maxlength');
        var countElement = wrap.querySelector(countElementClass);
        var timer = this.timer;
        clearTimeout(timer);
        timer = setTimeout(function () {
          var value = _this.value.trim();

          var length = value.length;
          countElement.innerHTML = length > max ? "<em class=\"ft-error\">".concat(length, "</em>/").concat(max) : "".concat(length, "/").concat(max);
        }, 500);
      });
    }
  }, {
    key: "createCountElement",
    value: function createCountElement(inner) {
      var countElementClass = this.settings.countElementClass;
      return _util.default.createElement('span', {
        className: countElementClass
      }, inner);
    }
  }]);

  return InputCount;
}();

var _default = InputCount;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6"}],"src/script/form/PikaEx.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PikaEx =
/*#__PURE__*/
function () {
  function PikaEx(selector, options, selectData, Pikaday) {
    var _this = this;

    _classCallCheck(this, PikaEx);

    var defaultSettings = {
      valueInput: '1',
      checkLabel: '到达时自动执行活动',
      checkValue: '2020-01-01'
    };
    this.selectData = selectData;
    this.settings = Object.assign({}, defaultSettings, options);
    this.pikaday = new Pikaday({
      i18n: {
        previousMonth: '<',
        nextMonth: '>',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weekdays: ['日', '一', '二', '三', '四', '五', '六'],
        weekdaysShort: ['日', '一', '二', '三', '四', '五', '六']
      },
      onSelect: function onSelect(date) {
        _this.changeValue(date);
      }
    });
    this.init(selector);
    this.events();
  }

  _createClass(PikaEx, [{
    key: "init",
    value: function init(selector) {
      if (typeof selector === 'string') {
        this.element = document.querySelector(selector);
      }

      if (_typeof(selector) === 'object') {
        this.element = selector;
      }

      if (!this.element) return;
      this.value = null;
      this.createDom();
    }
  }, {
    key: "createDom",
    value: function createDom() {
      var content = this.createContent();

      var div = _util.default.createElement('div', {
        className: 'ui-pika'
      }, content);

      var parent = this.element.closest('.ui-control-wrap');
      this.piker = parent.appendChild(div);
      this.piker.hide = this.hide.bind(this.piker, this.element);
      this.piker.querySelector('.pika-container').appendChild(this.pikaday.el);
      this.select = this.piker.querySelector('.option-select');
      this.empty = this.piker.querySelector('.option-empty');
      this.checkbox = this.piker.querySelector('input');
      this.resetSelectPosition();
    }
  }, {
    key: "createContent",
    value: function createContent() {
      var selectData = this.selectData;
      var _this$settings = this.settings,
          checkLabel = _this$settings.checkLabel,
          checkValue = _this$settings.checkValue;
      var check = PikaEx.createCheckRow(checkLabel, checkValue);
      var empty = PikaEx.createEmptyRow();
      var select = PikaEx.createSelect('指定活动结束后开始', selectData);
      return '<div class="pika-container"></div>' + check + select + empty;
    }
  }, {
    key: "resetSelectPosition",
    value: function resetSelectPosition() {
      var piker = this.piker,
          select = this.select;
      var drop = select.querySelector('.select-dropdown');
      var listHeight = drop.getBoundingClientRect().height;
      var pikerHeight = piker.getBoundingClientRect().height;
      var selectTop = select.offsetTop;
      var selectBottom = pikerHeight - selectTop;

      if (listHeight > pikerHeight) {
        drop.style.top = '0';
      } else if (listHeight <= selectBottom) {
        drop.style.top = selectTop + 'px';
      } else {
        drop.style.bottom = '0';
      }
    }
  }, {
    key: "hide",
    value: function hide(element) {
      _util.default.removeClass(this, 'show');

      _util.default.removeClass(element, 'active');
    }
  }, {
    key: "show",
    value: function show() {
      _util.default.addClass(this.element, 'active');

      _util.default.addClass(this.piker, 'show');

      var value = this.value;

      if (value) {
        this.pikaday.setDate(value, true);
      }
    }
  }, {
    key: "changeValue",
    value: function changeValue(element) {
      var checkbox = this.checkbox,
          piker = this.piker;

      _util.default.removeClass(piker.querySelector('.selected'), 'selected');

      if (element instanceof Date) {
        this.value = PikaEx.formatDate(element);
        checkbox.checked = false;
      } else if (element === checkbox) {
        this.value = element.checked ? PikaEx.getDateValue(element.value) : '';
      } else if (_util.default.hasClass(element, 'menu-item')) {
        _util.default.addClass(element, 'selected');

        checkbox.checked = false;
        this.value = element.getAttribute('data-value');
      }

      this.element.value = this.value;
      this.hide();
    }
  }, {
    key: "events",
    value: function events() {
      var self = this;
      var element = this.element,
          piker = this.piker,
          select = this.select;
      element.addEventListener('click', function (e) {
        if (_util.default.hasClass(piker, 'show')) {
          piker.hide();
        } else {
          self.show();
        }

        e.stopPropagation();
      });

      _util.default.on(piker, 'click', '.menu-item', function () {
        self.changeValue(this);
      });

      _util.default.on(piker, 'change', '.pika-check', function () {
        self.changeValue(this);
      });

      var timer = null;
      select.addEventListener('mouseenter', function () {
        clearTimeout(timer);

        _util.default.addClass(this, 'show');
      });
      select.querySelector('.select-label').addEventListener('click', function (e) {
        e.stopPropagation();
      });

      _util.default.on(piker, 'click', '.pika-container', function (e) {
        e.stopPropagation();
      });

      select.addEventListener('mouseleave', function () {
        var _this2 = this;

        timer = setTimeout(function () {
          _util.default.removeClass(_this2, 'show');
        }, 400);
      });
    }
  }], [{
    key: "createSelect",
    value: function createSelect(label, data) {
      return "<div class=\"option-row option-select\">\n              <div class=\"select-label\">".concat(label, "</div>\n              <div class=\"select-dropdown\">\n                <div class=\"ui-menu\">\n                  <ul>") + data.reduce(function (pre, cur) {
        var name = cur.label,
            value = cur.value;
        var date = PikaEx.getDateValue(value);
        return pre + "<li class=\"menu-item\" data-value=\"".concat(date, "\">").concat(name, "</li>");
      }, '') + '</ul></div></div></div>';
    }
  }, {
    key: "createCheckRow",
    value: function createCheckRow(label, value) {
      var date = PikaEx.getDateValue(value);
      return "<div class=\"option-row option-check\"><label class=\"ui-checkbox\"><input type=\"checkbox\" class=\"pika-check\" value=\"".concat(date, "\"/><i class=\"iconfont\"></i><span>").concat(label, "</span></label></div>");
    }
  }, {
    key: "createEmptyRow",
    value: function createEmptyRow() {
      return '<div class="option-row option-empty menu-item">无</div>';
    }
  }, {
    key: "formatDate",
    value: function formatDate(date) {
      return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().slice(0, 10);
    }
  }, {
    key: "getDateValue",
    value: function getDateValue(date) {
      if (date instanceof Date) {
        return PikaEx.formatDate(date);
      }

      if (typeof date === 'string') {
        return date;
      }

      if (typeof date === 'number') {
        return PikaEx.formatDate(date);
      }

      return '';
    }
  }]);

  return PikaEx;
}();

document.body.addEventListener('click', function () {
  var pika = document.querySelectorAll('.ui-pika');

  _util.default.forEach(pika, function (item) {
    item.hide();
  });
});
var _default = PikaEx;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6"}],"src/script/form/CheckAll.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CheckAll =
/*#__PURE__*/
function () {
  function CheckAll(selector, option) {
    _classCallCheck(this, CheckAll);

    var defaultSettings = {
      groupClass: 'tree-group',
      checkAllClass: 'check-all',
      nodeClass: 'tree-node',
      labelClass: 'node-label'
    };
    this.settings = Object.assign({}, defaultSettings, option);
    this.init(selector);
  }

  _createClass(CheckAll, [{
    key: "init",
    value: function init(selector) {
      var element = selector;

      if (typeof selector === 'string') {
        element = document.querySelector(selector);
      }

      if (!element) return;
      this.element = element;
      this.cache = {};
      this.data = [];
      this.value = [];
      this.events();
    }
  }, {
    key: "getDataFromDom",
    value: function getDataFromDom(element) {
      var _this = this;

      var _this$settings = this.settings,
          groupClass = _this$settings.groupClass,
          nodeClass = _this$settings.nodeClass,
          labelClass = _this$settings.labelClass;
      var elements = element;

      if (_typeof(elements) === 'object' && !elements.length) {
        elements = [element];
      }

      var elementArr = [].slice.call(elements);

      if (_util.default.hasClass(elementArr[0], labelClass)) {
        var input = elementArr[0].querySelector('input');
        var value = input.value;
        var label = input.parentNode.innerText || '';
        return {
          label: label,
          value: value || _util.default.createId(),
          checkbox: input,
          children: this.getDataFromDom(elementArr.splice(1))
        };
      }

      return elementArr.map(function (item) {
        if (_util.default.hasClass(item, groupClass)) {
          return _this.getDataFromDom(item.children);
        }

        if (_util.default.hasClass(item, nodeClass)) {
          var _input = item.querySelector('input');

          var _value = _input.value;

          var _label = _input.parentNode.innerText || '';

          return {
            label: _label,
            value: _value,
            checkbox: _input
          };
        }

        return null;
      });
    }
  }, {
    key: "createDataCache",
    value: function createDataCache(data, parent) {
      var _this2 = this;

      data.forEach(function (item) {
        var checkbox = item.checkbox,
            value = item.value,
            children = item.children,
            label = item.label;
        var _item = {
          label: label,
          value: value,
          checkbox: checkbox
        };

        if (parent) {
          _item.parent = parent;
        }

        if (children) {
          _item.children = children.map(function (itm) {
            return itm.value;
          });

          _this2.createDataCache(children, value);
        }

        _this2.cache[value] = _item;
      });
    }
  }, {
    key: "dealCheck",
    value: function dealCheck(item) {
      this.dealCheckChild(item);
      this.dealCheckParent(item);
    }
  }, {
    key: "dealCheckChild",
    value: function dealCheckChild(item) {
      var _this3 = this;

      var checked = item.checkbox.checked;
      var cache = this.cache;

      if (item.children) {
        item.children.forEach(function (val) {
          var _item = cache[val];
          var checkbox = _item.checkbox;

          if (checked) {
            checkbox.indeterminate = false;
          }

          if (checkbox.checked !== checked && !checkbox.disabled) {
            checkbox.checked = checked;

            _this3.dealCheckChild(_item);
          }
        });
      }
    }
  }, {
    key: "dealCheckParent",
    value: function dealCheckParent(item) {
      var cache = this.cache;

      if (item.parent) {
        var _item = cache[item.parent];
        var children = _item.children,
            checkbox = _item.checkbox;
        var originChecked = checkbox.checked;
        var originIndeterminate = checkbox.indeterminate;
        var check = true;
        var indeterminate = false;
        children.forEach(function (val) {
          var itm = cache[val];

          if (itm.checkbox.checked) {
            indeterminate = true;
          } else if (itm.checkbox.indeterminate) {
            indeterminate = true;
            check = false;
          } else {
            check = false;
          }
        });
        var newIndeterminate = !check && indeterminate;
        var newCheck = check && !newIndeterminate;
        checkbox.indeterminate = newIndeterminate;
        checkbox.checked = newCheck;

        if (originChecked !== newCheck || originIndeterminate !== newIndeterminate) {
          this.dealCheckParent(_item);
        }
      }
    }
  }, {
    key: "changeValue",
    value: function changeValue() {
      var _this4 = this;

      var cache = this.cache;
      this.value = [];
      Object.keys(cache).forEach(function (key) {
        var _cache$key = cache[key],
            label = _cache$key.label,
            value = _cache$key.value,
            checkbox = _cache$key.checkbox,
            children = _cache$key.children;

        if (checkbox.checked && !children) {
          _this4.value.push({
            label: label,
            value: value
          });
        }
      });
    }
  }, {
    key: "events",
    value: function events() {
      var element = this.element;
      var ele = element; // if (!u.hasClass(ele, 'ui-tree')) {
      //   ele = this.element.querySelector('.ui-tree');
      // }

      this.data = this.getDataFromDom(ele.children);
      this.createDataCache(this.data);
      var self = this;

      _util.default.on(element, 'change', 'input', function () {
        var value = this.value;
        var item = self.cache[value];
        self.dealCheck(item);
        self.changeValue();
        element.trigger('tree-change');
      });
    }
  }]);

  return CheckAll;
}();

var _default = CheckAll;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6"}],"src/script/form/Transfer.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

var _CheckAll = _interopRequireDefault(require("./CheckAll.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// need Sortable js
var Sortable;

var Transfer =
/*#__PURE__*/
function () {
  function Transfer(selector, options, sortable) {
    _classCallCheck(this, Transfer);

    var defaultSettings = {};
    this.settings = Object.assign({}, defaultSettings, options);
    Sortable = sortable;
    this.init(selector);
  }

  _createClass(Transfer, [{
    key: "init",
    value: function init(selector) {
      var element = selector;

      if (typeof selector === 'string') {
        element = document.querySelector(selector);
      }

      if (!(element && element instanceof HTMLElement)) {
        throw new Error('need element');
      }

      this.element = element;
      this.targetList = element.querySelector('.select-list');
      this.treeList = element.querySelector('.ui-tree');
      this.value = [];
      this.createTeeCheck();
    }
  }, {
    key: "createTeeCheck",
    value: function createTeeCheck() {
      var element = this.element;
      var tree = element.querySelector('.ui-tree');
      this.tree = new _CheckAll.default(tree);
      this.value = [];
      this.events();
    }
  }, {
    key: "changeValue",
    value: function changeValue(newValue) {
      var value = this.value;
      var _value = [];
      var addValue = [];

      if (!value.length) {
        this.value = newValue;
        this.changeSelectedList();
        return;
      }

      var valueIndex = [];
      newValue.forEach(function (item) {
        var hasIt = false;
        value.forEach(function (itm, index) {
          if (hasIt) return;

          if (item.value === itm.value) {
            hasIt = true;
            valueIndex.push(index);
          }
        });

        if (!hasIt) {
          addValue.push(item);
        }
      });
      value.forEach(function (item, index) {
        if (valueIndex.indexOf(index) > -1) {
          _value.push(item);
        }
      });
      this.value = _value.concat(addValue);
      this.changeSelectedList();
    }
  }, {
    key: "changeSelectedList",
    value: function changeSelectedList() {
      var targetList = this.targetList,
          value = this.value;
      var domString = value.reduce(function (pre, cur) {
        return pre + "<div class=\"transfer-item\" data-value=\"".concat(cur.value, "\"><span class=\"name\">").concat(cur.label, "</span><span class=\"delete iconfont icon-times\"></span></div>");
      }, '');
      targetList.innerHTML = domString;
    }
  }, {
    key: "removeSelectedItem",
    value: function removeSelectedItem(ele) {
      var item = ele.closest('.transfer-item');
      var value = item.getAttribute('data-value');
      var input = this.treeList.querySelector("input[value=\"".concat(value, "\"]"));
      input.checked = false;
      input.trigger('change');
    }
  }, {
    key: "changeSort",
    value: function changeSort(oldIndex, newIndex) {
      var value = this.value;
      value.splice(newIndex, 0, value.splice(oldIndex, 1)[0]);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.element = null;
      this.targetList = null;
      this.treeList = null;
      this.tree = null;
    }
  }, {
    key: "events",
    value: function events() {
      var self = this;
      var tree = this.tree,
          element = this.element,
          targetList = this.targetList;
      new Sortable(targetList, {
        onSort: function onSort(evt) {
          var oldIndex = evt.oldIndex,
              newIndex = evt.newIndex;
          self.changeSort(oldIndex, newIndex);
        }
      });

      _util.default.on(element, 'tree-change', '.ui-tree', function () {
        self.changeValue(tree.value);
      });

      _util.default.on(element, 'click', '.icon-times', function () {
        self.removeSelectedItem(this);
      });
    }
  }]);

  return Transfer;
}();

var _default = Transfer;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6","./CheckAll.es6":"src/script/form/CheckAll.es6"}],"src/script/select/SelectBase.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var doc = document;

var SelectBase =
/*#__PURE__*/
function () {
  function SelectBase(options) {
    _classCallCheck(this, SelectBase);

    var defaultSettings = {
      selectElement: 'div',
      selectedClass: 'selected',
      showClass: 'show',
      selectShowClass: 'ui-select-active',
      selectClass: 'ui-select ui-form-control',
      optionClass: 'ui-select-dropdown hide',
      bottomMargin: 0
    };
    this.settings = Object.assign({}, defaultSettings, options);
  }
  /**
   * @method
   * @param {Boolean} selected  - selected status
   * @param {String} value - option value
   * @param {String} label - option text
   * @returns {String}  new option html
   * */


  _createClass(SelectBase, [{
    key: "createOptionItem",
    value: function createOptionItem(_ref, option) {
      var selected = _ref.selected,
          value = _ref.value,
          label = _ref.label,
          disabled = _ref.disabled;
      var selectedClass = this.settings.selectedClass;
      var className = selected ? selectedClass : '';
      var opt = option || {};
      var last;
      var level = '';
      var str = label;
      var addClassName = '';

      if (opt.level) {
        last = level === this.max ? 'data-last' : '';
        level = opt.level;
      }

      if (opt.tpl) {
        str = opt.tpl;
      }

      if (opt.className) {
        addClassName = opt.className;
      }

      if (value === '') {
        return '';
      }

      if (disabled) {
        className += ' disabled';
      }

      var v = this.value;

      if (v && (v.indexOf(value + '') > -1 || v.indexOf(value) > -1)) {
        className = selectedClass;
      }

      return "<li class=\"menu-item ".concat(className, " ").concat(addClassName, "\" data-value=\"").concat(value, "\" data-level=\"").concat(level, "\" ").concat(last, ">").concat(str, "</li>");
    }
    /**
     * @method
     * change selected option     in Cascader ColorPicker
     * @param {HTMLElement} option
     * @param {HTMLElement} current
     * */

  }, {
    key: "changeSelectedClass",
    value: function changeSelectedClass(option, current) {
      var selectedClass = this.settings.selectedClass;
      var elements = option.querySelectorAll(".".concat(selectedClass));

      _util.default.forEach(elements, function (item) {
        _util.default.removeClass(item, selectedClass);
      });

      _util.default.addClass(current, selectedClass);
    }
  }, {
    key: "removeMultipleTag",
    value: function removeMultipleTag(element) {
      var value = element.getAttribute('data-value');
      this.changeCacheValue(value, false);
      this.changeMultiSelectValue(true);
    }
    /**
     * @method
     * bind click event
     * @param {HTMLElement|Node|Object} select
     * @param {function} [beforeShow = null]
     * */

  }, {
    key: "selectClickEvent",
    value: function selectClickEvent(select, beforeShow) {
      var self = this;
      select.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var target = e.target;

        if (self.multiple && _util.default.hasClass(target, 'js-del-selected')) {
          self.removeMultipleTag(target);
          return;
        }

        if (self.clearable && _util.default.hasClass(target, 'icon-clean')) {
          self.clearSelect();
          return;
        }

        if (this.show) {
          self.hideOption(select);
        } else {
          self.hideOther(select);

          if (beforeShow && typeof beforeShow === 'function') {
            beforeShow(select);
          }

          self.showOption(select);
        }
      }, false);
    }
    /**
     * @method
     * hide other select's option
     * @param {HTMLElement} select
     * */

  }, {
    key: "hideOther",
    value: function hideOther(select) {
      var _this = this;

      var selectShowClass = this.settings.selectShowClass;
      var selector = doc.querySelectorAll(".".concat(selectShowClass));

      _util.default.forEach(selector, function (item) {
        if (item !== select) _this.hideOption(item);
      });
    }
    /**
     * @method
     * display select option
     * @param {Object} select
     * */

  }, {
    key: "showOption",
    value: function showOption(select) {
      var _this$settings = this.settings,
          selectShowClass = _this$settings.selectShowClass,
          showClass = _this$settings.showClass,
          bottomMargin = _this$settings.bottomMargin;
      var element = select;
      var option = select.option;
      option.style.zIndex = '100';

      _util.default.addClass(option, showClass);

      _util.default.addClass(select, selectShowClass);

      var rect = select.getBoundingClientRect();
      var height = rect.height,
          top = rect.top;
      var optionHeight = option.children[0].clientHeight;

      if (top && top > optionHeight && top > doc.documentElement.clientHeight - optionHeight - height - bottomMargin) {
        option.style.top = 'auto';
        option.style.bottom = height + 3 + 'px';
      } else {
        option.style.bottom = 'auto';
      }

      if (this.search) {
        var search = select.option.querySelector('.ui-form-control');

        if (search && search.value !== '') {
          search.value = '';
          search.trigger('input');
        }
      }

      element.show = true;
    }
    /**
     * hide option
     * @param {Object} select
     * @param {String} className
     * */

  }, {
    key: "hideOption",
    value: function hideOption(select) {
      var _this$settings2 = this.settings,
          selectShowClass = _this$settings2.selectShowClass,
          showClass = _this$settings2.showClass;
      var element = select;
      var option = select.option;

      _util.default.removeClass(select, selectShowClass);

      _util.default.removeClass(option, showClass);

      element.show = false;
    }
    /**
     * change text and value
     * @param {Object} select
     * @param {String} value
     * @param {String} label
     * @param {Boolean} show
     * @param {String} type
     * */

  }, {
    key: "changeSelectValue",
    value: function changeSelectValue(select, value, label) {
      var show = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'change';
      var element = select;
      element.innerHTML = label;

      if (this.clearable && value) {
        element.innerHTML = label + '<i class="iconfont icon-clean"></i>';
      }

      element.originElement.value = value;
      element.originElement.trigger(type);

      if (!show) {
        this.hideOption(select);
      }
    }
  }, {
    key: "clearSelect",
    value: function clearSelect() {
      var select = this.select;
      select.innerHTML = this.settings.emptyLabel;
      select.originElement.value = '';
      select.originElement.trigger('change');
      this.value = [];

      _util.default.forEach(select.option.querySelectorAll('.selected'), function (item) {
        _util.default.removeClass(item, 'selected');
      });
    }
  }]);

  return SelectBase;
}();

doc.addEventListener('click', function () {
  var elements = doc.querySelectorAll('.ui-select-active');
  [].slice.call(elements).forEach(function (item) {
    var select = item;
    var option = select.option;

    _util.default.removeClass(select, 'ui-select-active');

    _util.default.removeClass(option, 'show');

    select.show = false;
    setTimeout(function () {
      option.style.zIndex = 0;
    }, 200);
  });
});
var _default = SelectBase;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6"}],"src/script/select/Select.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = _interopRequireDefault(require("../base/util.es6"));

var _SelectBase2 = _interopRequireDefault(require("./SelectBase.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Select =
/*#__PURE__*/
function (_SelectBase) {
  _inherits(Select, _SelectBase);

  function Select(elementSelector, options) {
    var _this;

    _classCallCheck(this, Select);

    var defaultSettings = {
      selectedClass: 'selected',
      showClass: 'show',
      selectClass: 'ui-select ui-form-control',
      optionClass: 'ui-select-dropdown hide',
      valueName: 'value',
      labelName: 'label',
      placeholder: '',
      emptyLabel: '<span class="ft-light select-empty">请选择</span>',
      emptyLi: '暂无选项',
      group: false,
      clearable: false,
      multiple: false,
      enterable: false,
      max: null,
      checkable: false,
      search: false,
      data: null,
      selectFn: null,
      optionTemplate: null,
      // function 
      tagClass: null // function or string

    };
    var settings = Object.assign({}, defaultSettings, options);

    if (settings.placeholder) {
      settings.emptyLabel = '<span class="ft-light select-empty">' + settings.placeholder + '</span>';
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Select).call(this, settings));

    _this.init(elementSelector);

    return _this;
  }
  /**
   * @method
   * @param {NodeList} element
   * 
   * 
   * this.data  [{label, value, selected[boolean]}]
   * this.cache {id: {label, value}}
   * */


  _createClass(Select, [{
    key: "init",
    value: function init(ele) {
      var element = ele;
      if (!element) return;
      var nodeName = element.nodeName.toLowerCase();
      if (nodeName !== 'select' && nodeName !== 'input') return;
      this.value = [];
      this.cache = {};
      this.nodeType = nodeName;
      var _this$settings = this.settings,
          data = _this$settings.data,
          group = _this$settings.group,
          max = _this$settings.max,
          search = _this$settings.search,
          checkable = _this$settings.checkable,
          clearable = _this$settings.clearable,
          enterable = _this$settings.enterable,
          multiple = _this$settings.multiple;
      this.data = data;
      this.multiple = multiple;
      this.max = max;
      this.group = group;
      this.search = search;
      this.checkable = checkable;
      this.clearable = clearable;
      this.enterable = enterable;

      if (element.multiple || element.hasAttribute('data-multiple')) {
        this.multiple = true;
      }

      if (element.hasAttribute('data-max')) {
        this.max = Number(element.getAttribute('data-max'));
      }

      if (element.querySelector('optgroup')) {
        this.group = true;
      }

      if (element.hasAttribute('data-search')) {
        this.search = true;
      }

      if (element.hasAttribute('data-checkable')) {
        this.checkable = true;
      }

      if (element.hasAttribute('data-clearable')) {
        this.clearable = true;
      }

      if (element.hasAttribute('data-enterable')) {
        this.enterable = true;
      }

      if (element.hasAttribute('data-placeholder')) {
        this.settings.placeholder = element.getAttribute('data-placeholder');
        this.settings.emptyLabel = '<span class="ft-light select-empty">' + this.settings.placeholder + '</span>';
      }

      if (!this.data) {
        this.data = this.getDataFromSelect(element);
      } else {
        this.createCacheFromData(this.data);
      }

      this.initSelect(element);
    }
  }, {
    key: "getDataFromSelect",
    value: function getDataFromSelect(element, parentId) {
      var _this2 = this;

      var elements = element.children;
      return [].slice.call(elements).map(function (item) {
        var nodeName = item.nodeName.toLowerCase();

        if (nodeName === 'option') {
          var label = item.label,
              value = item.value,
              selected = item.selected,
              disabled = item.disabled;
          var _data = {
            label: label,
            value: value,
            disabled: disabled
          }; // 去掉了selected

          if (selected) {
            _this2.value.push(item.value);
          }

          if (parentId) {
            _data.parent = parentId;
          }

          _this2.cache[value] = _data;
          return _data;
        }

        if (nodeName === 'optgroup') {
          var id = _util.default.createId();

          var child = [].slice.call(item.children).map(function (itm) {
            return itm.value;
          });
          _this2.cache[id] = child;
          return {
            id: id,
            child: child,
            // children id array
            label: item.label,
            options: _this2.getDataFromSelect(item, id),
            type: 'optgroup'
          };
        }

        return null;
      });
    }
  }, {
    key: "createCacheFromData",
    value: function createCacheFromData(data) {
      var _this3 = this;

      var _this$settings2 = this.settings,
          labelName = _this$settings2.labelName,
          valueName = _this$settings2.valueName;
      this.data = data.map(function (item) {
        var label = item[labelName];
        var value = item[valueName];
        var selected = item.selected;

        if (selected) {
          _this3.value.push(value);
        }

        return Object.assign({}, item, {
          label: label,
          value: value,
          selected: false
        });
      });
      data.forEach(function (item) {
        var type = item.type,
            child = item.child,
            options = item.options;
        var label = item[labelName];
        var value = item[valueName];

        if (type === 'optgroup' || child || options) {
          var id = value || item.id;
          var _child = item.child;

          if (!_child && options) {
            _child = options.map(function (itm) {
              return itm.value;
            });

            _this3.createCacheFromData(options);
          }

          _this3.cache[id] = _child;
          return;
        } // if (selected) {
        //   this.value.push(value);
        // }


        _this3.cache[value] = Object.assign({}, item, {
          label: label,
          value: value,
          selected: false
        });
      });
    }
    /**
     * @method
     * create new element to exchange select element
     * @param {HTMLElement} item
     * */

  }, {
    key: "initSelect",
    value: function initSelect(item) {
      var element = item;

      var _this$createSelectDom = this.createSelectDom(item),
          select = _this$createSelectDom.select,
          value = _this$createSelectDom.value,
          label = _this$createSelectDom.label; // hide original select element


      element.style.display = 'none';
      this.select = select;
      select.option = this.createOptionWrap(element); // select.option.innerHTML = this.createDropdown();

      this.createDropdown();
      select.options = select.option.querySelectorAll('.menu-item');
      var width = Math.max(select.clientWidth, select.option.clientWidth);
      select.option.style.width = width === 0 ? '100%' : width + 'px';
      select.originElement = element; // set default value
      // won't trigger 'change' event

      if (this.multiple) {
        this.changeMultiSelectValue(false, 'init');
      } else {
        this.changeSelectValue(select, value, label, false, 'init');
      } // bind event


      this.bindEvent();
      return select;
    }
    /**
     * @method
     * create new select element
     * @param {HTMLElement} element
     * @returns {Object}
     * */

  }, {
    key: "createSelectDom",
    value: function createSelectDom(element) {
      var _this$settings3 = this.settings,
          selectClass = _this$settings3.selectClass,
          emptyLabel = _this$settings3.emptyLabel;
      var dataClass = element.getAttribute('data-class') || '';
      var className = selectClass;

      if (dataClass) {
        className += ' ' + dataClass;
      }

      if (this.multiple) {
        className += ' multiple';
      }

      if (this.group) {
        className += ' group';
      }

      if (this.clearable) {
        className += ' clearable';
      }

      if (this.enterable) {
        className += ' enterable';
      }

      var selectUI = _util.default.createElement('div', {
        className: className
      });

      var value = this.value[0];
      var label = value ? this.cache[value].label : emptyLabel;
      var wrap = element.parentNode;
      return {
        select: wrap.appendChild(selectUI),
        value: value,
        label: label
      };
    } // to base

  }, {
    key: "createOptionWrap",
    value: function createOptionWrap(element) {
      var optionClass = this.settings.optionClass;

      if (this.group) {
        optionClass += ' group';
      }

      if (this.multiple) {
        optionClass += ' multiple';
      }

      if (this.checkable) {
        optionClass += ' checkable';
      }

      if (this.max && this.value.length >= this.max) {
        optionClass += ' no-add';
      }

      var optionUI = _util.default.createElement('div', {
        className: optionClass
      });

      var wrap = element.parentNode;
      return wrap.appendChild(optionUI);
    }
    /**
     * @method
     * create new 'option'
     * @param {HTMLElement} element
     * @returns {String}
     * */

  }, {
    key: "createDropdown",
    value: function createDropdown(match) {
      var domString = '<div class="select-ul">';
      var emptyLi = this.settings.emptyLi;

      if (this.search) {
        domString += Select.createSearch() + '<ul class="select-main">';
      }

      domString += '<ul class="select-main">' + (this.createOptionContent(this.data, match) || "<li class=\"li-empty\">".concat(emptyLi, "</li>"));
      this.select.option.innerHTML = domString + '</ul></div>';
    }
    /**
     * create main options list
     * @param element {HTMLElement} origin select
     * @param match {string|any} search content
     */

  }, {
    key: "createOptionContent",
    value: function createOptionContent(data, match, option) {
      var _this4 = this;

      return data.reduce(function (str, item) {
        if (item.type && item.type === 'optgroup') {
          return str + _this4.createOptionGroup(item, match);
        }

        return str + _this4.createOptionSingle(item, match, option);
      }, '');
    }
  }, {
    key: "createOptionGroup",
    value: function createOptionGroup(optgroup, match) {
      var options = optgroup.options,
          label = optgroup.label,
          id = optgroup.id;
      var str = this.createOptionContent(options, match);
      if (!str) return '';
      var className = ' expend';

      if (this.checkable) {
        label = "<label class=\"ui-checkbox\"><input type=\"checkbox\" class=\"check-group\" value=\"".concat(id, "\"><i class=\"iconfont\"></i>").concat(label, "</label>");
      }

      return "<li class=\"option-group\">\n              <div class=\"group-label".concat(className, "\">\n                <i class=\"iconfont icon-caret-right\"></i>\n                ").concat(label, "</div>\n              <ul class=\"group-ul\">\n              ").concat(str, "\n              </ul>\n            </li>");
    }
  }, {
    key: "createOptionSingle",
    value: function createOptionSingle(item, match) {
      var optionTemplate = this.settings.optionTemplate;
      if (match && item.label.indexOf(match) === -1) return '';

      if (this.checkable) {
        return Select.createOptionWithCheckbox(item);
      }

      if (optionTemplate) {
        var str = optionTemplate(item);
        var tpl = str;
        var className = '';

        if (_typeof(str) === 'object') {
          tpl = str.tpl || '';
          className = str.className || '';
        }

        return this.createOptionItem(item, {
          tpl: tpl,
          className: className
        });
      }

      return this.createOptionItem(item);
    }
  }, {
    key: "changeCheck",
    value: function changeCheck(checkbox) {
      if (_util.default.hasClass(checkbox, 'check-group')) {
        this.changeCheckParent(checkbox);
      } else {
        var checked = checkbox.checked;
        this.changeCacheValue(checkbox.value, checked);
        this.changeCheckAll(checkbox.value);
      }

      this.changeMultiSelectValue(true);
    }
  }, {
    key: "changeCheckParent",
    value: function changeCheckParent(checkbox) {
      var _this5 = this;

      var parent = checkbox.value;
      var checked = checkbox.checked;
      var child = this.cache[parent];
      child.forEach(function (id) {
        _this5.select.option.querySelector('[value="' + id + '"]').checked = checked;
      });
      this.changeCacheValue(child, checked);
    }
  }, {
    key: "changeCheckAll",
    value: function changeCheckAll(value) {
      var _this6 = this;

      var parent = this.cache[value].parent;
      if (!parent) return;
      var child = this.cache[parent];
      var checkbox = this.select.option.querySelector('[value="' + parent + '"]');
      var check = true;
      var indeterminate = false;
      child.forEach(function (itm) {
        var selected = _this6.cache[itm].selected;

        if (selected) {
          indeterminate = true;
        } else {
          check = false;
        }
      });
      checkbox.checked = check;
      checkbox.indeterminate = !check && indeterminate;
    }
  }, {
    key: "toggleItemSelected",
    value: function toggleItemSelected(value) {
      var add = this.value.indexOf(value) === -1;
      this.changeCacheValue(value, add);
    }
  }, {
    key: "changeCacheValue",
    value: function changeCacheValue(value, add) {
      var _this7 = this;

      if (!this.multiple) {
        this.value = [value];
      } else if (Array.isArray(value)) {
        value.forEach(function (item) {
          _this7.dealMultiValue(item, add);
        });
      } else {
        this.dealMultiValue(value, add);
      }
    }
  }, {
    key: "resetValue",
    value: function resetValue(value) {
      var self = this;

      if (Array.isArray(value)) {
        this.value = value;

        if (this.multiple) {
          this.changeMultiSelectValue(false, 'change');
        } else {
          var select = self.select;
          var label = self.cache[value].label;
          self.changeSelectValue(select, value, label);
          self.changeMultiSelectedClass();
        }
      }
    }
  }, {
    key: "dealMultiValue",
    value: function dealMultiValue(value, add) {
      var select = this.select,
          max = this.max;
      var index = this.value.indexOf(value);

      if (add) {
        if (index === -1) {
          this.value.push(value);
        }
      } else if (index > -1) {
        this.value.splice(index, 1);
      }

      if (max) {
        if (this.value.length >= max) {
          _util.default.addClass(select.option, 'no-add');
        } else {
          _util.default.removeClass(select.option, 'no-add');
        }
      }
    }
  }, {
    key: "changeMultiSelectedClass",
    value: function changeMultiSelectedClass() {
      var select = this.select,
          value = this.value;
      var selectedClass = this.settings.selectedClass;

      _util.default.forEach(select.option.querySelectorAll('.menu-item'), function (item) {
        var _value = item.getAttribute('data-value');

        if (value.indexOf(_value) > -1) {
          _util.default.addClass(item, selectedClass);
        } else {
          _util.default.removeClass(item, selectedClass);
        }
      });
    }
  }, {
    key: "changeOriginElementValue",
    value: function changeOriginElementValue(eventType) {
      var select = this.select,
          nodeType = this.nodeType,
          value = this.value;
      var originElement = select.originElement;

      if (nodeType === 'input') {
        originElement.value = this.value;
      }

      if (nodeType === 'select') {
        var options = originElement.options;

        if (Array.isArray(value)) {
          _util.default.forEach(options, function (item) {
            item.selected = value.indexOf(item.value) > -1;
          });
        }
      }

      originElement.trigger(eventType);
    }
    /**
     * @param {Boolean} show
     * @param {String} type
     * */

  }, {
    key: "changeMultiSelectValue",
    value: function changeMultiSelectValue() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'change';
      var select = this.select;
      this.changeOriginElementValue(type);

      if (!show) {
        this.hideOption(select);
      }

      this.changeMultiSelectLabel(type);
      this.changeMultiSelectedClass();
    }
  }, {
    key: "changeMultiSelectLabel",
    value: function changeMultiSelectLabel(type) {
      var select = this.select;
      select.innerHTML = this.createMultiTag() || this.settings.emptyLabel;

      if (this.enterable && type === 'change') {
        select.querySelector('.select-input').focus();
        this.createDropdown();
      }
    }
  }, {
    key: "createEnterInput",
    value: function createEnterInput() {
      var value = this.value,
          enterable = this.enterable;
      var placeholder = this.settings.placeholder;

      if (!enterable) {
        return '';
      }

      if (!value.length) {
        return "<input class=\"select-input\" placeholder=\"".concat(placeholder, "\" autocomplete=\"off\">");
      }

      return '<input class="select-input" autocomplete="off" >';
    }
  }, {
    key: "createMultiTag",
    value: function createMultiTag() {
      var _this8 = this;

      var values = this.value;
      var tagClass = this.settings.tagClass;
      var input = this.createEnterInput();

      if (!values.length) {
        return input || this.settings.emptyLabel;
      }

      var str = values.reduce(function (result, item) {
        var data = _this8.cache[item];
        var tagClassName = 'gray';
        var label;
        var value;

        if (_this8.enterable && !data) {
          label = item;
          value = item;
        }

        if (data) {
          label = data.label;
          value = data.value;
        }

        if (tagClass) {
          if (typeof tagClass === 'string') {
            tagClassName = tagClass;
          }

          if (typeof tagClass === 'function') {
            tagClassName = tagClass(data);
          }
        }

        return result + "<span class=\"ui-tag ".concat(tagClassName, " closeable\" data-tooltip data-position=\"center top\" data-title=\"").concat(label, "\">").concat(label, " <i data-value=\"").concat(value, "\" class=\"iconfont icon-times js-del-selected\"></i></span>");
      }, '');
      return str + input;
    }
  }, {
    key: "checkLabels",
    value: function checkLabels(val) {
      var cache = this.cache;

      var _v;

      Object.keys(cache).forEach(function (key) {
        var _cache$key = cache[key],
            value = _cache$key.value,
            label = _cache$key.label;

        if (label === val) {
          _v = value;
        }
      });

      if (typeof _v === 'undefined') {
        var id = 'cus-' + _util.default.createId();

        this.cache[id] = {
          label: val,
          value: id
        };
        this.changeCacheValue(id, true);
      } else {
        var bool = !(this.value.indexOf(_v) > -1);
        this.changeCacheValue(_v, bool);
      }

      this.changeMultiSelectLabel('change');
    }
  }, {
    key: "dealSelectEnter",
    value: function dealSelectEnter(e, input) {
      var self = this;
      clearTimeout(self.inputTimer);

      if (e.keyCode === 13) {
        e.preventDefault();
        var value = input.value;

        if (value.trim().length) {
          self.checkLabels(value);
        }
      }
    }
    /**
     * @method
     * @param {Object} select
     * */

  }, {
    key: "bindEvent",
    value: function bindEvent() {
      var select = this.select;
      var option = select.option;
      var self = this;
      var selectFn = this.settings.selectFn;
      this.selectClickEvent(select, function () {
        if (self.enterable) {
          // select.option.innerHTML = self.createDropdown();
          self.createDropdown();
        }
      });

      _util.default.on(select, 'keydown', '.select-input', function (e) {
        e.stopPropagation();
        self.dealSelectEnter(e, this);
      });

      _util.default.on(select, 'click', '.select-input', function (e) {
        e.stopPropagation();
        self.showOption(select);
      });

      _util.default.on(option, 'click', '.menu-item', function (e) {
        e.stopPropagation(); // group label

        if (_util.default.hasClass(this, 'label-item')) return; // disabled item

        if (_util.default.hasClass(this, 'disabled')) return; // max limit

        if (self.max && self.value.length >= self.max && !_util.default.hasClass(this, 'selected')) {
          return;
        } // single select [selected]


        if (!self.multiple && _util.default.hasClass(this, 'selected')) {
          self.hideOption(select);
          return;
        }

        var value = this.getAttribute('data-value');
        var label = self.cache[value].label;

        if (selectFn && typeof selectFn === 'function') {
          selectFn(value, select);
        }

        self.toggleItemSelected(value);

        if (self.multiple) {
          self.changeMultiSelectValue(true);
        } else {
          self.changeSelectValue(select, value, label);
          self.changeMultiSelectedClass();
        }
      });

      _util.default.on(option, 'click', '.group-label', function (e) {
        e.stopPropagation();

        _util.default.toggleClass(this, 'expend');
      });

      _util.default.on(option, 'change', 'input', function () {
        self.changeCheck(this);
      });

      _util.default.on(option, 'click', '.select-search', function (e) {
        e.stopPropagation();
      });

      this.inputTimer = null;

      _util.default.on(select, 'input', '.select-input', function () {
        var _this9 = this;

        clearTimeout(self.inputTimer);
        self.inputTimer = setTimeout(function () {
          var val = _this9.value;
          var main = self.createOptionContent(self.data, val);
          var con = main || '<li class="li-empty">暂无搜索结果</li>';
          option.querySelector('.select-main').innerHTML = con;
        }, 200);
      });
    }
  }], [{
    key: "createSearch",
    value: function createSearch() {
      var searchDom = "<div class=\"select-search\">\n      <input type=\"search\" class=\"ui-form-control\">\n    </div>";
      return searchDom;
    }
  }, {
    key: "createOptionWithCheckbox",
    value: function createOptionWithCheckbox(_ref) {
      var selected = _ref.selected,
          value = _ref.value,
          label = _ref.label,
          disabled = _ref.disabled;
      var checked = selected ? 'checked' : '';
      var className = disabled ? 'disabled' : '';
      return "<li class=\"menu-item label-item ".concat(className, "\" title=\"").concat(label, "\" data-value=\"").concat(value, "\">\n      <label class=\"ui-checkbox\"><input type=\"checkbox\" ").concat(checked, " value=\"").concat(value, "\"/><i class=\"iconfont\"></i>").concat(label, "</label>\n    </li>");
    }
  }]);

  return Select;
}(_SelectBase2.default);

function _default(selector, options) {
  if (typeof selector === 'string') {
    var elements = document.querySelectorAll(selector);
    return [].slice.call(elements).map(function (item) {
      return new Select(item, options);
    });
  }

  if (_typeof(selector) === 'object' && selector !== null) {
    return new Select(selector, options);
  }

  return null;
}
},{"../base/util.es6":"src/script/base/util.es6","./SelectBase.es6":"src/script/select/SelectBase.es6"}],"src/script/select/Cascader.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

var _SelectBase2 = _interopRequireDefault(require("./SelectBase.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var doc = document;

var Cascader =
/*#__PURE__*/
function (_SelectBase) {
  _inherits(Cascader, _SelectBase);

  function Cascader(elementSelector, options) {
    var _this;

    _classCallCheck(this, Cascader);

    var defaultSettings = Object.assign({}, {
      selectElement: 'div',
      selectedClass: 'selected',
      showClass: 'show',
      selectShowClass: 'ui-select-active',
      selectClass: 'ui-select ui-form-control',
      optionGroupClass: 'ui-select-dropdown menu-group hide',
      ajaxUrl: [],
      valueName: 'value',
      labelName: 'label',
      dataName: 'id',
      data: {},
      selectFn: null,
      selectFinalFn: null
    }, options);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Cascader).call(this, defaultSettings));
    var element = elementSelector;

    if (typeof elementSelector === 'string') {
      element = doc.querySelector(elementSelector);
    }

    if (!element) return _possibleConstructorReturn(_this);
    _this.select = element;

    _this.init();

    return _this;
  }

  _createClass(Cascader, [{
    key: "init",
    value: function init() {
      this.complete = false;
      this.linkage = [];
      this.values = [];
      this.defaultValue = null;
      this.max = 0;
      this.initAjaxSelect();
    }
    /**
     * @method
     * */

  }, {
    key: "initAjaxSelect",
    value: function initAjaxSelect() {
      var _this2 = this;

      var select = this.select;
      var ajaxUrl = this.settings.ajaxUrl;
      var valueArray = select.getAttribute('data-default');

      if (valueArray) {
        this.defaultValue = valueArray.split(',');
      }

      if (!ajaxUrl.length && !select.getAttribute('data-ajax')) {
        return;
      } // urls to get option items data


      this.urlArray = ajaxUrl.length ? ajaxUrl : select.getAttribute('data-ajax').split(',');
      this.max = this.urlArray.length; // whether should select to the final level or not

      this.level = Number(select.getAttribute('data-level')) || 0;
      this.initInput();
      this.initDropdownWrap();
      this.createAjaxOption(1);
      this.selectClickEvent(select, function () {
        if (!_this2.complete && _this2.defaultValue) {
          _this2.initStatus(select);

          _this2.createAjaxOption(1);
        }
      });
      this.optionClickEvent();
    }
  }, {
    key: "resetValue",
    value: function resetValue(value) {
      this.defaultValue = value;
      this.createAjaxOption(1);
    }
  }, {
    key: "initStatus",
    value: function initStatus(select) {
      var option = select.option;
      this.linkage = [];
      option.innerHTML = '';
    }
    /**
     * input element to save value
     * */

  }, {
    key: "initInput",
    value: function initInput() {
      var select = this.select;
      var parent = select.parentNode;
      var dataInput = select.getAttribute('data-input');
      select.originElement = dataInput ? doc.querySelector(dataInput) : parent.appendChild(_util.default.createElement('input', {
        type: 'hidden',
        name: select.id
      }));
    }
    /**
     * create div.ui-select-dropdown element
     * */

  }, {
    key: "initDropdownWrap",
    value: function initDropdownWrap() {
      var select = this.select;
      var className = this.settings.optionGroupClass;
      var option = select.parentNode.appendChild(_util.default.createElement('div', {
        className: className
      }));

      var _width = Math.max(select.clientWidth, option.clientWidth);

      option.style.width = _width ? _width + 'px' : 'auto';
      select.option = option;
    }
    /**
     * @method
     * @param {Node|Object} select
     * @param {Number} level
     * @param {Object} [d = {}]
     * @param {*} type
     * */

  }, {
    key: "createAjaxOption",
    value: function createAjaxOption(level) {
      var _this3 = this;

      var d = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var select = this.select;
      var url = this.urlArray[level - 1];
      var data = this.settings.data;

      if (url) {
        _util.default.fetchData(url, Object.assign({}, data, d)).then(function (res) {
          if (res.code === 200) {
            if (_util.default.isEmpty(res.data)) {
              _this3.selectFinalLevelEvent();

              _this3.removeNextSiblingOptions(level - 1);
            } else {
              _this3.appendAjaxOption(res.data, select, level, type);
            }
          }
        });
      } else {
        this.selectFinalLevelEvent();
      }
    }
  }, {
    key: "selectFinalLevelEvent",
    value: function selectFinalLevelEvent() {
      var selectFinalFn = this.settings.selectFinalFn;

      if (typeof selectFinalFn === 'function') {
        selectFinalFn(this.values);
      }
    }
    /**
     * @method
     * @param {Array} data - options data array
     * @param {Object} select
     * @param {Number} level - linkage level
     * (index = level - 1, index from 0, level from 1)
     * @param {*} type
     * */

  }, {
    key: "appendAjaxOption",
    value: function appendAjaxOption(data, select, level, type) {
      var _this4 = this;

      var domString = '';
      var trigger = !!this.defaultValue;
      var _this$settings = this.settings,
          valueName = _this$settings.valueName,
          labelName = _this$settings.labelName; // array data to create options

      data.forEach(function (item) {
        var selected = false;

        if (trigger && !type) {
          selected = item[valueName] == _this4.defaultValue[level - 1]; // eslint-disable-line
        }

        domString += _this4.createOptionItem({
          selected: selected,
          value: item[valueName],
          label: item[labelName]
        }, {
          level: level
        });
      });
      var optionUI = select.option.appendChild(_util.default.createElement('ul', {
        className: 'select-main'
      }, domString)); // trigger nex level

      if (!type) {
        var selected = optionUI.querySelector('.selected');

        if (selected) {
          this.triggerNewItem(selected, select);

          if (selected.offsetTop > optionUI.clientHeight) {
            optionUI.scrollTop = selected.offsetTop - optionUI.clientHeight / 2;
          }
        }
      }

      this.removeNextSiblingOptions(level - 1);
      this.linkage.push(optionUI);
    }
  }, {
    key: "removeNextSiblingOptions",
    value: function removeNextSiblingOptions(index) {
      var linkage = this.linkage,
          urlArray = this.urlArray;
      var max = urlArray.length;
      linkage.splice(index, max).forEach(function (item) {
        item.parentNode.removeChild(item);
      });
    }
    /**
     * @method
     * @param {Object} select
     * */

  }, {
    key: "optionClickEvent",
    value: function optionClickEvent() {
      var self = this;
      var select = this.select;

      _util.default.on(select.option, 'click', '.menu-item', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var ul = this.parentNode;
        self.changeSelectedClass(ul, this);
        self.triggerNewItem(this, select, 'click');
      });

      select.option.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  }, {
    key: "triggerNewItem",
    value: function triggerNewItem(element, select, type) {
      var value = element.getAttribute('data-value');
      var level = Number(element.getAttribute('data-level'));
      var label = element.innerHTML.trim();
      var show = !type;
      var values = this.values;
      var _this$settings2 = this.settings,
          selectFn = _this$settings2.selectFn,
          dataName = _this$settings2.dataName;
      values[level - 1] = {
        value: value,
        label: label
      };
      values.splice(level, values.length);

      if (typeof selectFn === 'function') {
        selectFn(element, select, type);
      }

      if (this.level) {
        if (level < this.level) {
          this.complete = false;
          this.createAjaxOption(level + 1, _defineProperty({}, dataName, value), type);
        }

        if (level === this.level) {
          this.complete = true;
          this.setValue(show);
          this.defaultValue = this.values.map(function (item) {
            return item.value;
          });
          this.selectFinalLevelEvent();
        }
      } else {
        this.complete = true;
        this.setValue();
        this.createAjaxOption(level + 1, _defineProperty({}, dataName, value), type);
      }
    }
    /**
     * @static
     * set select text and value
     * @param {Object} select
     * @param {Boolean} show
     * */

  }, {
    key: "setValue",
    value: function setValue(show) {
      var select = this.select;
      var valueAll = [];
      var labelAll = [];
      this.values.forEach(function (item) {
        valueAll.push(item.value);
        labelAll.push(item.label);
      });
      this.changeSelectValue(select, valueAll.join(','), labelAll.join(' / '), show);
    }
    /**
     * @method
     * remove created option and input dom
     * */

  }, {
    key: "destroy",
    value: function destroy() {
      var select = this.select;
      var option = select.option;
      var dataInput = select.getAttribute('data-input');

      if (!dataInput) {
        select.originElement.parentNode.removeChild(select.originElement);
      }

      option.parentNode.removeChild(option);
    }
  }]);

  return Cascader;
}(_SelectBase2.default);

var _default = Cascader;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6","./SelectBase.es6":"src/script/select/SelectBase.es6"}],"src/script/modal/Modal.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var doc = document;
var body = doc.body;

var Modal =
/*#__PURE__*/
function () {
  function Modal(settings) {
    _classCallCheck(this, Modal);

    var defaultSettings = {
      modal: null,
      modalBox: '.modal-box',
      modalContent: '.modal-content',
      modalTitle: '.modal-title',
      title: null,
      type: null,
      // confirm
      open: '[data-modal-open]',
      close: '[data-modal-close]',
      showClass: 'modal-visible',
      animateClass: 'fadeInDown',
      resize: false,
      clickOutside: true,
      closeKey: 27,
      onOpen: null,
      onClose: null,
      onResize: null,
      onCancel: null,
      onConfirm: null,
      footer: true,
      cancelBtn: '取消',
      confirmBtn: '确定',
      // button
      btnOkClass: 'ui-button primary',
      btnCancelClass: 'ui-button',
      btnType: '' // '' 'center'

    };

    if (settings && settings.type === 'confirm') {
      defaultSettings.btnOkClass = 'ui-button small primary';
      defaultSettings.btnCancelClass = 'ui-button small';
    }

    this.settings = Object.assign({}, defaultSettings, settings);
    this.isShow = false;
    this.current = null;
    this.init();
  }
  /**
   * @method
   * create modal element
   *
   * @returns {Node}
   * */


  _createClass(Modal, [{
    key: "createModalHtml",
    value: function createModalHtml(type) {
      var closeIcon = '<span class="modal-close iconfont icon-times" data-modal-close></span>';
      var str = '';
      var className = 'ui-modal';

      switch (type) {
        case 'confirm':
          str = this.getConfirmTypeHtml();
          className = 'ui-modal-confirm';
          break;

        default:
          str = this.getModalTypeHtml(closeIcon);
          break;
      }

      var div = _util.default.createElement('div', {
        className: className
      }, str);

      return body.appendChild(div);
    }
  }, {
    key: "createModalFooter",
    value: function createModalFooter() {
      var _this$settings = this.settings,
          cancelBtn = _this$settings.cancelBtn,
          footer = _this$settings.footer,
          confirmBtn = _this$settings.confirmBtn,
          btnOkClass = _this$settings.btnOkClass,
          btnCancelClass = _this$settings.btnCancelClass,
          onCancel = _this$settings.onCancel;
      var confirmButton = '';
      var cancelButton = '';
      var foot = '';

      if (!footer) {
        return foot;
      }

      if (confirmBtn) {
        confirmButton = "<button class=\"".concat(btnOkClass, " modal-ok\">").concat(confirmBtn, "</button>");
      }

      if (cancelBtn) {
        if (onCancel) {
          cancelButton = "<button class=\"".concat(btnCancelClass, " modal-cancel\">").concat(cancelBtn, "</button>");
        } else {
          cancelButton = "<button class=\"".concat(btnCancelClass, " modal-cancel\" data-modal-close>").concat(cancelBtn, "</button>");
        }
      }

      if (confirmBtn || cancelBtn) {
        foot = "<div class=\"modal-footer\">".concat(confirmButton).concat(cancelButton, "</div>");
      }

      return foot;
    }
  }, {
    key: "getModalTypeHtml",
    value: function getModalTypeHtml(closeIcon) {
      var resize = this.settings.resize;
      var resizeClass = resize ? ' resizable' : '';
      var resizeTrigger = resize ? '<span class="resize-trigger"></span>' : '';
      var foot = this.createModalFooter();
      return "<div class=\"modal-box".concat(resizeClass, "\">").concat(closeIcon) + '<div class="modal-title"></div><div class="modal-content"></div>' + "".concat(foot).concat(resizeTrigger, "</div>");
    }
  }, {
    key: "getConfirmTypeHtml",
    value: function getConfirmTypeHtml() {
      var foot = this.createModalFooter();
      return '<div class="ui-confirm modal-box">' + '<div class="modal-content"></div>' + foot + '</div>';
    }
    /**
     * @method
     * @param {Object} option
     * @returns {String} confirm html
     * */

  }, {
    key: "init",
    value: function init() {
      var modal = this.settings.modal;
      var _this$settings2 = this.settings,
          modalBox = _this$settings2.modalBox,
          modalContent = _this$settings2.modalContent,
          modalTitle = _this$settings2.modalTitle,
          type = _this$settings2.type;

      if (!modal) {
        modal = this.createModalHtml(type);
      }

      this.modal = modal;
      this.modalBox = modal.querySelector(modalBox);
      this.modalTitle = modal.querySelector(modalTitle);
      this.modalContent = modal.querySelector(modalContent);
      this.modalOk = modal.querySelector('.modal-ok');
      this.modalCancel = modal.querySelector('.modal-cancel');
      this.events();
    }
    /**
     * @method
     * set modal content
     *
     * @param {String} content
     * */

  }, {
    key: "setContent",
    value: function setContent(content) {
      this.modalContent.innerHTML = content;
    }
    /**
     * @method
     * set modal title
     *
     * @param {String} title
     * */

  }, {
    key: "setTitle",
    value: function setTitle(title) {
      if (!title) return;
      this.modalTitle.innerHTML = "<div class=\"modal-head\">".concat(title, "</div>");
    }
    /**
     * @method
     * display modal
     *
     * @param {Object} options
     * */

  }, {
    key: "show",
    value: function show(options) {
      var content = options.content,
          title = options.title;
      this.setContent(content);
      this.setTitle(title);
      this.toggleShowHide('show');

      _util.default.addClass(document.querySelector('html'), 'modal-open');
    }
  }, {
    key: "confirm",
    value: function confirm(option) {
      var getData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var content = Modal.createConfirmHtml(option);
      this.getData = getData;
      this.setContent(content);
      this.toggleShowHide('show');
    }
    /**
     * @method
     * hide modal
     * */

  }, {
    key: "hide",
    value: function hide() {
      this.toggleShowHide('hide');
      this.modalContent.innerHTML = '';

      if (this.modalTitle) {
        this.modalTitle.innerHTML = '';
      }

      _util.default.removeClass(document.querySelector('html'), 'modal-open');
    }
    /**
     * @param {'show'|'hide'} type
     * */

  }, {
    key: "toggleShowHide",
    value: function toggleShowHide(type) {
      var modal = this.modal;
      var modalBox = this.modalBox;
      var _this$settings3 = this.settings,
          showClass = _this$settings3.showClass,
          animateClass = _this$settings3.animateClass,
          onOpen = _this$settings3.onOpen,
          onClose = _this$settings3.onClose;

      if (type === 'show') {
        _util.default.addClass(modal, showClass);

        _util.default.addClass(modalBox, animateClass);

        this.isShow = true;

        if (typeof onOpen === 'function') {
          onOpen(this);
        }
      }

      if (type === 'hide') {
        this.isShow = false;

        if (typeof onClose === 'function') {
          onClose(this);
        }

        _util.default.removeClass(modal, showClass);

        _util.default.removeClass(modalBox, animateClass);
      }
    }
  }, {
    key: "events",
    value: function events() {
      var _this = this;

      var self = this;
      var _this$settings4 = this.settings,
          clickOutside = _this$settings4.clickOutside,
          closeKey = _this$settings4.closeKey,
          resize = _this$settings4.resize,
          onCancel = _this$settings4.onCancel,
          onConfirm = _this$settings4.onConfirm;
      var modalOk = this.modalOk,
          modalCancel = this.modalCancel;

      _util.default.on(this.modal, 'click', '[data-modal-close]', function () {
        _this.hide();
      });

      if (modalOk && onConfirm) {
        modalOk.addEventListener('click', function (e) {
          onConfirm(e, self, self.getData);
        });
      }

      if (modalCancel && onCancel) {
        modalCancel.addEventListener('click', function (e) {
          onCancel(e, self, self.getData);
        });
      }

      if (clickOutside) {
        body.addEventListener('keydown', function (e) {
          if (e.keyCode === closeKey) {
            _this.hide();
          }
        });
      }

      if (resize) {
        this.resizeEvent();
      }
    } // resize modal

  }, {
    key: "resizeEvent",
    value: function resizeEvent() {
      var modalBox = this.modalBox;
      var docEle = document.documentElement;
      var onResize = this.settings.onResize;

      var _modalBox$getBounding = modalBox.getBoundingClientRect(),
          minHeight = _modalBox$getBounding.height,
          minWidth = _modalBox$getBounding.width;

      var startX;
      var startY;
      var startWidth;
      var startHeight;
      var maxWidth;
      var maxHeight;
      var resizeTrigger = modalBox.querySelector('.resize-trigger');

      function doDrag(e) {
        var width = startWidth + (e.clientX - startX) * 2;
        var height = startHeight + (e.clientY - startY) * 2;

        if (width > maxWidth) {
          width = maxWidth;
        }

        if (height > maxHeight) {
          height = maxHeight;
        }

        modalBox.style.width = width + 'px';
        modalBox.style.height = height + 'px';

        if (typeof onResize === 'function') {
          onResize(width, height);
        }
      }

      function stopDrag() {
        docEle.removeEventListener('mousemove', doDrag, false);
        docEle.removeEventListener('mouseup', stopDrag, false);
      }

      resizeTrigger.addEventListener('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        startX = e.clientX;
        startY = e.clientY;
        maxWidth = docEle.clientWidth * 0.95;
        maxHeight = docEle.clientHeight * 0.98;
        startWidth = modalBox.getBoundingClientRect().width;
        startHeight = modalBox.getBoundingClientRect().height;
        docEle.addEventListener('mousemove', doDrag, false);
        docEle.addEventListener('mouseup', stopDrag, false);
      }, false);
    }
  }], [{
    key: "createConfirmHtml",
    value: function createConfirmHtml(option) {
      var content = option.content,
          desc = option.desc;
      var titHtml = content ? "<div class=\"warn\">".concat(content, "</div>") : '';
      var descHtml = desc ? "<div class=\"desc\">".concat(desc, "</div>") : '';
      return "".concat(titHtml).concat(descHtml);
    }
  }]);

  return Modal;
}();

var _default = Modal;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6"}],"src/script/modal/Message.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Message =
/*#__PURE__*/
function () {
  function Message(settings) {
    _classCallCheck(this, Message);

    var defaultSettings = {
      duration: 3000,
      position: 'top',
      top: 27 // px

    };
    this.settings = Object.assign({}, defaultSettings, settings);
    this.init();
  }

  _createClass(Message, [{
    key: "init",
    value: function init() {
      // do .. what ...
      this.count = 0; // this.messages = [];
    }
  }, {
    key: "success",
    value: function success(message, position) {
      this.show(message, true, position);
    }
  }, {
    key: "warn",
    value: function warn(message, position) {
      this.show(message, false, position);
    }
  }, {
    key: "show",
    value: function show(message, type, position) {
      var content = Message.createAlert(message, type);
      var alert = document.querySelector('.ui-alert');

      if (alert) {
        alert.parentNode.removeChild(alert);
      }

      var msg = document.body.appendChild(content);

      if (this.settings.position === 'center' || position === 'center') {
        msg.style.top = '50%'; // setTimeout(() => {
        //   msg.parentNode.removeChild(msg);
        // }, this.settings.duration);
        // return;
      } else {
        msg.style.top = this.settings.top + 'px';
      } // const top = this.settings.top + (this.count * 50) + 'px';
      // msg.style.top = top;
      // this.count += 1;
      // this.messages.push(msg);


      setTimeout(function () {
        // this.hide(msg);
        if (msg && msg.parentNode) {
          msg.parentNode.removeChild(msg);
        }
      }, this.settings.duration);
    } // hide() {
    //   this.count -= 1;
    //   const ele = this.messages.shift();
    //   ele.parentNode.removeChild(ele);
    //   this.resetTop();
    // }
    // resetTop() {
    //   const { messages } = this;
    //   messages.forEach((item) => {
    //     const top = item.style.top;
    //     item.style.top = (parseInt(top, 10) - 50) + 'px';
    //   });
    // }

  }], [{
    key: "createAlert",
    value: function createAlert(content, type) {
      var _type = 'success';

      if (typeof type === 'boolean' && !type) {
        _type = 'warn';
      }

      var className = 'alert-' + _type;
      var domString = Message.createDomString(content, className);

      var div = _util.default.createElement('div', {
        className: 'ui-alert'
      }, domString);

      return div;
    }
  }, {
    key: "createDomString",
    value: function createDomString(content, className) {
      return "<div class=\"alert-content ".concat(className, "\">").concat(content, "</div>");
    }
  }]);

  return Message;
}();

var _default = Message;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6"}],"src/script/modal/Position.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Position =
/*#__PURE__*/
function () {
  function Position(options) {
    _classCallCheck(this, Position);

    var defaultSettings = {
      position: 'right bottom',
      gap: 4
    };
    this.settings = Object.assign({}, defaultSettings, options);
  }

  _createClass(Position, [{
    key: "setPosition",
    value: function setPosition(element, targetElement) {
      var gap = this.settings.gap;

      var _targetElement$getBou = targetElement.getBoundingClientRect(),
          left = _targetElement$getBou.left,
          top = _targetElement$getBou.top;

      var data = targetElement.getAttribute('data-position');
      var position = data || this.settings.position;
      var pos = {
        targetHeight: targetElement.offsetHeight,
        targetWidth: targetElement.offsetWidth,
        targetLeft: left + window.scrollX,
        targetTop: top + window.scrollY,
        elementHeight: element.offsetHeight,
        elementWidth: element.offsetWidth
      };
      var style = element.style;
      element.style.width = element.offsetWidth + 'px';

      var _position$split = position.split(' '),
          _position$split2 = _slicedToArray(_position$split, 2),
          x = _position$split2[0],
          y = _position$split2[1];

      if (y === 'middle') {
        Position.setPositionMiddle(x, pos, style, gap);
      } else {
        Position.setPositionVertical(y, pos, style, gap);
        Position.setPositionHorizontal(x, pos, style, gap);
      }
    }
  }], [{
    key: "setPositionVertical",
    value: function setPositionVertical(y, pos, style, gap) {
      var sty = style;
      var h = pos.targetTop + pos.targetHeight + gap + 'px';
      var t = pos.targetTop - pos.elementHeight - gap + 'px';

      if (pos.targetTop < pos.elementHeight) {
        t = h;
      }

      if (y === 'bottom') {
        sty.top = h;
      }

      if (y === 'top') {
        sty.top = t;
      }
    }
  }, {
    key: "setPositionHorizontal",
    value: function setPositionHorizontal(x, pos, style) {
      var sty = style;

      switch (x) {
        case 'right':
          sty.left = pos.targetLeft + 'px';
          break;

        case 'left':
          sty.left = pos.targetLeft + pos.targetWidth - pos.elementWidth + 'px';
          break;

        case 'center':
          sty.left = pos.targetLeft + pos.targetWidth / 2 - pos.elementWidth / 2 + 'px';
          break;

        default:
          break;
      }
    }
  }, {
    key: "setPositionMiddle",
    value: function setPositionMiddle(x, pos, style, gap) {
      var sty = style;
      sty.top = pos.targetTop + pos.targetHeight / 2 - pos.elementHeight / 2 + 'px';

      if (x === 'left') {
        sty.left = pos.targetLeft - gap - pos.elementWidth + 'px';
      }

      if (x === 'right') {
        sty.left = pos.targetLeft + pos.targetWidth + gap + 'px';
      }
    }
  }]);

  return Position;
}();

var _default = Position;
exports.default = _default;
},{}],"src/script/modal/Tooltip.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

var _Position2 = _interopRequireDefault(require("./Position.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var doc = document;

var Tooltip =
/*#__PURE__*/
function (_Position) {
  _inherits(Tooltip, _Position);

  function Tooltip(selector, options) {
    var _this;

    _classCallCheck(this, Tooltip);

    var defaultSetting = {
      className: 'ui-tooltip',
      position: 'left bottom',
      // x: left center right  y: top bottom
      width: '',
      maxWidth: '',
      gap: 4,
      showEvent: 'mouseover',
      hideEvent: 'mouseout',
      template: null
    };
    var settings = Object.assign({}, defaultSetting, options);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tooltip).call(this, settings));

    _this.init(selector);

    return _this;
  }

  _createClass(Tooltip, [{
    key: "init",
    value: function init(selector) {
      var self = this;
      var _this$settings = this.settings,
          showEvent = _this$settings.showEvent,
          hideEvent = _this$settings.hideEvent;

      _util.default.on(doc, showEvent, selector, function (e) {
        var _this2 = this;

        if (e.target.matches(selector)) {
          this.timer = setTimeout(function () {
            self.showTooltip(_this2);
          }, 200);
        }
      });

      _util.default.on(doc, hideEvent, selector, function (e) {
        if (this.timer) {
          clearTimeout(this.timer);
        }

        Tooltip.destroyTooltip(this.tooltip, this);
      });
    }
  }, {
    key: "showTooltip",
    value: function showTooltip(element) {
      var self = this;
      var ele = element;
      var _this$settings2 = this.settings,
          width = _this$settings2.width,
          maxWidth = _this$settings2.maxWidth;
      if (ele.noTooltip) return;
      var title = ele.getAttribute('data-title');

      if (title) {
        if (ele.scrollWidth <= ele.offsetWidth) {
          ele.noTooltip = true;
          return;
        }
      }

      var data = ele.getAttribute('data-position');
      var position = data || this.settings.position;
      var tooltip = this.createTooltipElement(ele, position);
      var style = tooltip.style;
      style.display = 'block';

      if (width) {
        style.width = width + 'px';
        style.maxWidth = 'none';
      }

      if (maxWidth) {
        style.maxWidth = maxWidth + 'px';
      }

      style.left = 0;
      style.bottom = 0;
      ele.tooltip = tooltip;
      setTimeout(function () {
        style.left = 'auto';
        style.bottom = 'auto';
        self.setPosition(tooltip, element);
      }, 2);
    }
  }, {
    key: "createTooltipElement",
    value: function createTooltipElement(element, position) {
      var template = this.settings.template;
      var text = element.getAttribute('data-text');
      var title = element.getAttribute('data-title');
      var dataTip = element.querySelector('.data-tip') ? element.querySelector('.data-tip').innerHTML : '';
      text = dataTip || text || title;
      var className = this.settings.className;

      if (typeof template === 'function') {
        text = template(text);
      }

      var dom = _util.default.createElement('div', {
        className: "".concat(className, " ").concat(position)
      }, text);

      return document.body.appendChild(dom);
    }
  }], [{
    key: "destroyTooltip",
    value: function destroyTooltip(tooltipElement, ele) {
      var tip = tooltipElement;

      if (tip) {
        tip.parentNode.removeChild(tip);
        ele.tooltip = null;
      }
    }
  }]);

  return Tooltip;
}(_Position2.default);

var _default = Tooltip;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6","./Position.es6":"src/script/modal/Position.es6"}],"src/script/modal/Popper.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

var _Position2 = _interopRequireDefault(require("./Position.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var poppers = [];

var Popper =
/*#__PURE__*/
function (_Position) {
  _inherits(Popper, _Position);

  function Popper(element, options) {
    var _this;

    _classCallCheck(this, Popper);

    var defaultSettings = {
      className: 'ui-popper',
      position: 'center bottom',
      content: '',
      gap: 4,
      zIndex: null
    };
    var settings = Object.assign({}, defaultSettings, options);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Popper).call(this, settings));

    _this.init(element);

    return _this;
  }

  _createClass(Popper, [{
    key: "init",
    value: function init(element) {
      if (!element) return;
      var zIndex = this.settings.zIndex;
      var data = element.getAttribute('data-position');

      if (data) {
        this.settings.position = data;
      }

      Popper.hideOthers();
      var dom = this.createPopper();
      this.setPosition(dom, element);

      if (zIndex) {
        dom.style.zIndex = zIndex;
      }

      this.popper = dom;
      poppers.push(this);
    }
  }, {
    key: "createPopper",
    value: function createPopper() {
      var _this$settings = this.settings,
          className = _this$settings.className,
          content = _this$settings.content;

      var dom = _util.default.createElement('div', {
        className: "".concat(className)
      }, content);

      return document.body.appendChild(dom);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (!this.popper) return;
      this.popper.parentNode.removeChild(this.popper);
      this.popper = null;
    }
  }], [{
    key: "hideOthers",
    value: function hideOthers() {
      poppers.forEach(function (item) {
        item.destroy();
      });
      poppers = [];
    }
  }]);

  return Popper;
}(_Position2.default);

document.addEventListener('click', function (e) {
  if (e.target.closest('.ui-popper')) return;
  poppers.forEach(function (item) {
    item.destroy();
  });
  poppers = [];
}, false);
window.addEventListener('resize', function () {
  if (poppers.length) {
    poppers.forEach(function (item) {
      item.destroy();
    });
    poppers = [];
  }
}, false);
var _default = Popper;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6","./Position.es6":"src/script/modal/Position.es6"}],"src/script/modal/Layer.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Layer =
/*#__PURE__*/
function () {
  function Layer(settings) {
    _classCallCheck(this, Layer);

    var defaults = {
      layer: null,
      title: null,
      type: null,
      // alert, confirm
      confirmType: 'warn',
      // warn success
      close: '[data-layer-close]',
      showClass: 'layer-visible',
      width: 640,
      onOpen: null,
      onClose: null
    };
    this.settings = Object.assign({}, defaults, settings);
    this.init();
    this.events();
  }

  _createClass(Layer, [{
    key: "init",
    value: function init() {
      var layer = this.settings.layer;

      if (!layer) {
        layer = this.createLayer();
      }

      this.layer = layer;
      this.layerHead = layer.querySelector('.layer-head');
      this.layerContent = layer.querySelector('.layer-content');
    }
  }, {
    key: "createLayer",
    value: function createLayer() {
      var width = this.settings.width;
      var closeIcon = '<span class="layer-close iconfont icon-times" data-layer-close></span>';
      var htmlString = "<div class=\"layer-box\" style=\"width: ".concat(width, "px\">").concat(closeIcon, " \n      <div class=\"layer-head\"></div>\n      <div class=\"layer-content\"></div>\n    </div>");

      var div = _util.default.createElement('div', {
        className: 'ui-layer'
      }, htmlString);

      return document.body.appendChild(div);
    }
  }, {
    key: "setContent",
    value: function setContent(str) {
      this.layerContent.innerHTML = str;
    }
  }, {
    key: "setTitle",
    value: function setTitle(str) {
      this.layerHead.innerHTML = "<div class=\"layer-title\">".concat(str, "</div>");
    }
  }, {
    key: "show",
    value: function show(option) {
      var layer = this.layer;
      var _this$settings = this.settings,
          showClass = _this$settings.showClass,
          onOpen = _this$settings.onOpen;
      var content = option.content,
          title = option.title;
      this.setContent(content);
      this.setTitle(title);

      _util.default.addClass(document.querySelector('html'), 'layer-open');

      _util.default.addClass(layer, showClass);

      if (onOpen) {
        onOpen(this);
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      var _this$settings2 = this.settings,
          onClose = _this$settings2.onClose,
          showClass = _this$settings2.showClass;

      if (onClose) {
        onClose(this);
      }

      _util.default.removeClass(this.layer, showClass);

      if (!document.querySelector('.' + showClass)) {
        _util.default.removeClass(document.querySelector('html'), 'layer-open');
      }
    }
  }, {
    key: "events",
    value: function events() {
      var _this = this;

      _util.default.on(this.layer, 'click', '[data-layer-close]', function () {
        _this.hide();
      });
    }
  }]);

  return Layer;
}();

var _default = Layer;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6"}],"src/script/tag/Tag.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tag =
/*#__PURE__*/
function () {
  function Tag(selector, options) {
    _classCallCheck(this, Tag);

    var element = document.querySelector(selector);
    if (!element) return;
    var defaultSettings = {
      className: '',
      defaultValue: [],
      inputType: 'text',
      editable: true,
      valueSelector: '.tag-values',
      onDeleteFn: null,
      max: null
    };
    this.settings = Object.assign({}, defaultSettings, options);
    this.wrap = element;
    this.init();
  }

  _createClass(Tag, [{
    key: "init",
    value: function init() {
      var _this$settings = this.settings,
          defaultValue = _this$settings.defaultValue,
          editable = _this$settings.editable;
      this.tags = [];
      this.valueInput = document.querySelector(this.settings.valueSelector);
      var list = Tag.createTagList();
      var input = this.createInput();
      this.wrap.appendChild(list);

      if (editable) {
        this.wrap.appendChild(input);
      }

      this.list = list;
      this.input = input;
      var value = this.valueInput.value ? this.valueInput.value.split(',') : defaultValue;
      this.addTags(value);
      this.events();
    }
  }, {
    key: "createInput",
    value: function createInput() {
      var inputType = this.settings.inputType;
      return _util.default.createElement('input', {
        type: inputType,
        className: 'tag-input'
      });
    }
  }, {
    key: "emptyTags",
    value: function emptyTags() {
      this.list.innerHTML = '';
      this.tags = [];
      this.addValueToInput();
    }
    /**
     * @param {Array} values
     * */

  }, {
    key: "addTags",
    value: function addTags(values) {
      var _this = this;

      if (Array.isArray(values) && values.length) {
        values.forEach(function (item) {
          _this.addTagValue(item);
        });
      }
    }
    /**
     * @param {String} value
     * */

  }, {
    key: "addTagValue",
    value: function addTagValue(value) {
      var max = this.settings.max;

      if (value && this.tags.indexOf(value) < 0 && (max ? this.tags.length < max : true)) {
        this.tags.push(value);
        this.appendTag(value);
        this.addValueToInput();
      }

      if (this.settings.editable) {
        this.input.value = '';
      }
    }
  }, {
    key: "appendTag",
    value: function appendTag(value) {
      var item = Tag.createTagDom(value);
      var div = document.createElement('div');
      div.innerHTML = item;
      this.list.appendChild(div.firstElementChild);
    }
  }, {
    key: "removeTagValue",
    value: function removeTagValue(value) {
      var tags = this.tags;
      var onDeleteFn = this.settings.onDeleteFn;

      for (var i = 0, l = tags.length; i < l; i += 1) {
        if (tags[i] === value) {
          tags.splice(i, 1);

          if (onDeleteFn) {
            onDeleteFn(value, i);
          }

          return;
        }
      }
    }
  }, {
    key: "removeTag",
    value: function removeTag(element) {
      var value = element.getAttribute('data-value');
      this.removeTagValue(value);
      var parent = element.parentNode;
      this.wrap.querySelector('.tag-list').removeChild(parent);
      this.addValueToInput();
    }
  }, {
    key: "addValueToInput",
    value: function addValueToInput() {
      var valueInput = this.valueInput;

      if (this.tags.length) {
        valueInput.value = this.tags.join(',');
      } else {
        valueInput.value = '';
      }

      valueInput.trigger('change');
    }
  }, {
    key: "events",
    value: function events() {
      var wrap = this.wrap;
      var self = this;
      var input = this.input;
      var editable = this.settings.editable;

      _util.default.on(wrap, 'click', '.tag-delete', function () {
        self.removeTag(this);
      });

      if (editable) {
        wrap.addEventListener('click', function () {
          self.input.focus();
        }, 'false');
      }

      input.addEventListener('keydown', function (e) {
        var code = e.keyCode;
        var value = this.value.trim ? this.value.trim() : this.value;

        if (code === 13 || code === 32) {
          e.preventDefault();
          self.addTagValue(value);
        }
      });
      input.addEventListener('blur', function (e) {
        var value = this.value.trim ? this.value.trim() : this.value;
        self.addTagValue(value);
      });
    }
  }], [{
    key: "createTagList",
    value: function createTagList() {
      return _util.default.createElement('ul', {
        className: 'tag-list'
      });
    }
  }, {
    key: "createTagDom",
    value: function createTagDom(value) {
      return "<li class=\"tag\">".concat(value, "<a href=\"javascript:;\" data-value=\"").concat(value, "\" class=\"iconfont icon-times tag-delete\"></a></li>");
    }
  }]);

  return Tag;
}();

var _default = Tag;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6"}],"src/script/validator/Validator.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("../base/util.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var doc = document;
var docEle = doc.documentElement;
var body = doc.body;
var defaultSettings = {
  chinese: '请填写中文',
  date: '日期格式不正确',
  email: '邮箱格式不正确',
  english: '请填写字母',
  idCard: '身份证号格式不正确',
  mobile: '手机号格式不正确',
  number: '请填写数字',
  phone: '手机号格式不正确',
  qq: 'qq格式不正确',
  weChat: '微信格式不正确',
  tel: '电话号码格式不正确',
  time: '时间格式不正确',
  url: '地址格式不正确',
  required: '请填写该项',
  int: '请填写不为0的正整数'
};
var regs = {
  rule: /^(.+?)\((.+)\)$/,
  chinese: /^[\u0391-\uFFE5]+$/,
  date: /^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$/,

  /**
   * @description 邮箱规则
   * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
   * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
   * 3.@符号是必填项
   * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
   * 5.邮件提供商域可以包含特殊字符-、_、.
   */
  email: /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/,
  english: /^[A-Za-z]+$/,
  idCard: /^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/,
  int: /^[1-9][0-9]*$/,

  /**
   * @description phone 简化版
   * */
  mobile: /^1[3-9]\d{9}$/,
  number: /^[0-9]+$/,
  qq: /^[1-9]\d{4,}$/,
  weChat: /^[-_a-zA-Z0-9]{4,24}$/,
  url: /[a-zA-z]+:\/\/[^\s]/,
  tel: /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/,
  time: /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/,
  price: /^-?(([1-9]+\d*)|([1-9]\d*.\d{0,2})|(0.\d{0,2})|(0))$/,
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,

  /**
   *@description
   * 130、131、132、133、134、135、136、137、138、139
   * 145、147
   * 150、151、152、153、155、156、157、158、159
   * 166 167
   * 170、176、177、178
   * 180、181、182、183、184、185、186、187、188、189
   * 198 199 191 
   * 国际码 如：中国(+86)
   * 防止跟不上运营商开新数字，可以考虑使用mobile验证
   */
  phone: /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[579]|15[0-3,5-9]|16[67]|17[0135678]|18[0-9]|19[189])\d{8}$/,
  passport: /^((E|K)[0-9]{8})|(((SE)|(DE)|(PE)|(MA))[0-9]{7})$/
};
var testReg = {
  is_email: function is_email(value) {
    return value ? regs.email.test(value) : true;
  },
  is_english: function is_english(value) {
    return value ? regs.english.test(value) : true;
  },
  is_chinese: function is_chinese(value) {
    return value ? regs.chinese.test(value) : true;
  },
  is_number: function is_number(value) {
    return value ? regs.number.test(value) : true;
  },
  is_idCard: function is_idCard(value) {
    return value ? regs.idCard.test(value) : true;
  },
  is_int: function is_int(value, rule, key, field) {
    if (field.element.validity && field.element.validity.badInput) {
      return false;
    }

    return value ? regs.int.test(value) : true;
  },
  is_mobile: function is_mobile(value) {
    return value ? regs.mobile.test(value) : true;
  },
  is_price: function is_price(value) {
    return value ? regs.price.test(value) : true;
  },
  is_qq: function is_qq(value) {
    return value ? regs.qq.test(value) : true;
  },
  is_weChat: function is_weChat(value) {
    return value ? regs.weChat.test(value) : true;
  },
  is_tel: function is_tel(value) {
    return value ? regs.tel.test(value) : true;
  },
  is_time: function is_time(value) {
    return value ? regs.time.test(value) : true;
  },
  is_passport: function is_passport(value) {
    return value ? regs.passport.test(value) : true;
  },
  is_url: function is_url(value) {
    return value ? regs.url.test(value) : true;
  },
  is_required: function is_required(value) {
    return !!(value && value !== '' && value !== undefined);
  },
  is_reg: function is_reg(value, rule) {
    var reg = new RegExp(rule.value);
    return value ? reg.test(value) : true;
  },
  is_password: function is_password(value) {
    return value ? regs.password.test(value) : true;
  },
  is_not: function is_not(value, rule) {
    return value !== rule.value;
  },
  getCheckedCheckbox: function getCheckedCheckbox(element) {
    var cl = 0;
    [].slice.call(element).forEach(function (item) {
      if (item.checked) {
        cl += 1;
      }
    });
    return cl;
  },
  is_max: function is_max(value, rule, name, field) {
    var type = field.type,
        element = field.element;
    var max = rule.value;

    if (type === 'checkbox') {
      var cl = this.getCheckedCheckbox(element);
      return cl <= max;
    }

    if (value) {
      var l = value.length;
      return l <= max;
    }

    return true;
  },
  is_min: function is_min(value, rule, name, field) {
    var type = field.type,
        element = field.element;

    if (type === 'checkbox') {
      var l = this.getCheckedCheckbox(element);
      return l >= rule.value;
    }

    return value ? value.length >= rule.value : true;
  },
  is_phone: function is_phone(value) {
    return value ? regs.phone.test(value) : true;
  },
  is_remote: function is_remote(value, rule, name, field, form) {
    var url = rule.value;
    var urlArr = url.split(',');
    var data = {};

    if (urlArr.length > 1) {
      url = urlArr.shift();
      var hasValue = true;
      urlArr.forEach(function (item) {
        var _item$replace$match = item.replace(' ', '').match(/^(\S*)\[(\S*)\]$/),
            _item$replace$match2 = _slicedToArray(_item$replace$match, 3),
            itm = _item$replace$match2[0],
            itemName = _item$replace$match2[1],
            inputName = _item$replace$match2[2];

        var _value = form.querySelector("[name=\"".concat(inputName, "\"]")).value;
        data[itemName] = _value;

        if (!_value.length) {
          hasValue = false;
        }
      });

      if (!hasValue) {
        return false;
      }
    }

    var last = url.charAt(url.length - 1);

    if (value) {
      if (last === '=') {
        return _util.default.fetchData(url + value, data);
      }

      return _util.default.fetchData(url, Object.assign({}, data, _defineProperty({}, field.element.name, value)));
    }

    return false;
  },
  is_same: function is_same(value, rule) {
    var ele = doc.querySelector("[name=\"".concat(rule.value, "\"]"));
    var eleValue = ele.value.trim();
    return value === eleValue;
  },
  is_diff: function is_diff(value, rule, key, field, form) {
    var ele = form.querySelector("[name=\"".concat(rule.value, "\"]"));
    var eleValue = ele.value.trim();
    return value !== eleValue;
  },
  is_gt: function is_gt(value, rule) {
    var ele = doc.querySelector("[name=\"".concat(rule.value, "\"]"));
    return Number(value) > Number(ele.value);
  },
  is_gte: function is_gte(value, rule) {
    var ele = doc.querySelector("[name=\"".concat(rule.value, "\"]"));
    return Number(value) >= Number(ele.value);
  },
  is_gtnum: function is_gtnum(value, rule) {
    // great than number
    if (value !== '') {
      return Number(value) > Number(rule.value);
    }

    return true;
  },
  is_gtenum: function is_gtenum(value, rule) {
    // great than or equal
    if (value !== '') {
      return Number(value) >= Number(rule.value);
    }

    return true;
  },
  is_ltnum: function is_ltnum(value, rule) {
    // less than number
    if (value !== '') {
      return Number(value) < Number(rule.value);
    }

    return true;
  },
  is_ltenum: function is_ltenum(value, rule) {
    // less than or equal
    if (value !== '') {
      return Number(value) <= Number(rule.value);
    }

    return true;
  }
};

var Validator =
/*#__PURE__*/
function () {
  function Validator(_selector, _fields, _settings, _callback, _errorCallback) {
    var _this = this;

    _classCallCheck(this, Validator);

    var selector = _selector;
    var fields = _fields;
    var settings = _settings;
    var callback = _callback;
    var errorCallback = _errorCallback;

    if (typeof _fields === 'function') {
      // (selector, callback, ..)
      callback = _fields;
      errorCallback = _settings;
      fields = null;
      settings = null;
    } else if (typeof _settings === 'function') {
      // (selector, setting, callback, ..)
      callback = _settings;
      errorCallback = _callback;
      fields = null;
      settings = _fields;
    }

    var form = selector;

    if (typeof selector === 'string') {
      form = doc.querySelector(selector);
    }

    if (!form) {
      return;
    }

    var options = {
      wrapClass: '.ui-control-wrap',
      validClass: '.v-item',
      errorClass: 'error',
      successClass: 'success',
      loadClass: 'loading',
      tipElement: 'span',
      tipClass: 'v-error-tip',
      showClass: 'show',
      realTime: true,
      shouldFresh: false,
      scrollToError: false
    };
    this.settings = Object.assign({}, options, settings);
    this.fields = {};
    this.form = form;

    if (fields) {
      this.addFields(fields);
    }

    if (this.settings.realTime) {
      this.delegateBlur();
    }

    this.delegateFocus();
    this.form.addEventListener('submit', function (e) {
      e.preventDefault();

      _this.validAllFiles(callback, errorCallback);

      return false;
    });
  }

  _createClass(Validator, [{
    key: "validAllFiles",
    value: function validAllFiles(callback, errorCallback) {
      var _this2 = this;

      var _this$settings = this.settings,
          validClass = _this$settings.validClass,
          tipClass = _this$settings.tipClass,
          showClass = _this$settings.showClass,
          shouldFresh = _this$settings.shouldFresh;
      var items = this.form.querySelectorAll(validClass);

      if (items) {
        if (shouldFresh) {
          this.fields = {};
        }

        this.addItems(items);
      }

      this.validForm();
      var valid = true;
      var arr = [];
      Object.keys(this.fields).every(function (key) {
        arr.push(key);
        var item = _this2.fields[key];

        if (!item.valid) {
          valid = false;
        }

        return item.valid;
      });
      var __fields = this.fields,
          __form = this.form,
          __settings = this.settings;

      function cb() {
        if (valid) {
          if (typeof callback === 'function') {
            callback(__form, __fields);
          }
        } else {
          if (__settings.scrollToError) {
            var tipElement = doc.querySelector('.' + tipClass + '.' + showClass);

            if (tipElement) {
              var top = tipElement.getBoundingClientRect().top - 80 + (docEle.scrollTop + body.scrollTop);
              var left = docEle.scrollLeft + body.scrollLeft; // scroll to error tip position

              window.scrollTo(left, top);
            }
          }

          if (typeof errorCallback === 'function') {
            errorCallback(__form, __fields);
          }
        }
      }

      function checkValid(index) {
        if (index >= arr.length) {
          valid = true;
          cb();
          return;
        }

        var item = __fields[arr[index]];

        if (item.remote) {
          item.remote.then(function (res) {
            if (res.code === 200) {
              checkValid(index + 1);
            } else {
              valid = false;
              cb();
            }
          });
        } else if (!item.valid) {
          valid = false;
          cb();
        } else {
          checkValid(index + 1);
        }
      }

      checkValid(0);
    }
  }, {
    key: "addFields",

    /**
     * @method
     * @param {Array} fields
     * [{
     *   name,   // element [name]
     *   rules,  // valid rule
     *   msgs    // error message
     * }]
     * */
    value: function addFields(fields) {
      var _this$settings2 = this.settings,
          validClass = _this$settings2.validClass,
          realTime = _this$settings2.realTime;

      for (var i = 0, l = fields.length; i < l; i += 1) {
        var field = fields[i];
        var name = field.name;
        var rules = Validator.rulesToObject(field.rules, field.msgs);
        var element = this.form[name];
        var type = element.length > 0 ? element.type || element[0].type : element.type;
        var tip = this.createErrorTip(element);
        var fieldItem = {
          element: element,
          name: name,
          type: type,
          rules: rules,
          tip: tip,
          value: null,
          checked: null,
          fn: field.fn || null
        };
        this.fields[name] = fieldItem;

        if (!_util.default.hasClass(element, validClass.replace('.', ''))) {
          if (realTime) {
            this.addBlurEvent(fieldItem);
            this.addFocusEvent(fieldItem);
          }
        }
      }
    }
    /**
     * @method
     * create error tip element
     * @param  {Node|NodeList} [node] - elements
     * @returns {Node}
     * */

  }, {
    key: "createErrorTip",
    value: function createErrorTip(node) {
      var element = node.length > 1 ? node[0] : node;
      var _this$settings3 = this.settings,
          tipElement = _this$settings3.tipElement,
          wrapClass = _this$settings3.wrapClass,
          tipClass = _this$settings3.tipClass;
      var parent = element.closest(wrapClass);
      var addedClass = element.id ? " v-tip-".concat(element.id) : '';
      var tip;

      if (element.getAttribute('data-tip')) {
        tip = document.querySelector(element.getAttribute('data-tip'));
        return tip;
      } else if (parent.querySelector(".".concat(tipClass))) {
        tip = parent.querySelector(".".concat(tipClass));
        return tip;
      } // create new tip element


      tip = doc.createElement(tipElement);
      tip.className = "".concat(tipClass).concat(addedClass);
      return parent.appendChild(tip);
    }
    /**
     * @method
     * get rule and msg from element node
     * @param  {NodeList} items nodeList of form item
     * */

  }, {
    key: "addItems",
    value: function addItems(items) {
      var _this3 = this;

      var fields = [];
      [].slice.call(items).forEach(function (element) {
        if (!(element.name in _this3.fields)) {
          var filed = _this3.addItem(element);

          if (filed) {
            fields.push(filed);
          }
        }
      });
      this.addFields(fields);
    }
    /**
     * @static
     * get name & rules & error messages from form element
     * @param {HTMLFormElement} element
     * @returns {Object|Boolean} field or nothing
     * */

  }, {
    key: "addItem",
    value: function addItem(element) {
      var name = element.name;
      var elements = this.form[name];
      var ele = elements;

      if (elements.length > 0) {
        // select radio checkbox
        if (Validator.isRadioOrCheckbox(elements[0].type)) {
          ele = elements[0];
        }
      }

      var rules = ele.getAttribute('data-rules');
      var msgs = ele.getAttribute('data-msgs') || '';
      return name && rules ? {
        name: name,
        rules: rules,
        msgs: msgs
      } : false;
    }
    /**
     * @method
     * @param {string} rules [form item valid rule]
     * @param {string} msgs  [error message]
     * @returns {object}
     * */

  }, {
    key: "addBlurEvent",
    // trigger verify when element loose focus
    value: function addBlurEvent(field) {
      var _this4 = this;

      if (!Validator.isRadioOrCheckbox(field.type)) {
        field.element.addEventListener('blur', function () {
          _this4.validField(field);
        });
      }
    } // remove error class when element get focus

  }, {
    key: "addFocusEvent",
    value: function addFocusEvent(field) {
      var _this5 = this;

      var element = field.element,
          tip = field.tip,
          type = field.type;

      if (Validator.isRadioOrCheckbox(type) && element.length > 1) {
        [].slice.call(element).forEach(function (item) {
          return _this5.addFocus(item, tip);
        });
      } else {
        this.addFocus(element, tip);
      }
    }
  }, {
    key: "addFocus",
    value: function addFocus(element, tip) {
      var self = this;
      element.addEventListener('focus', function () {
        self.removeErrorClass(this, tip);
      });
    }
    /**
     * @method
     * delegate event
     * - focusin for normal form elements
     * - change for hidden form elements
     * */

  }, {
    key: "delegateFocus",
    value: function delegateFocus() {
      var _this6 = this;

      var validClass = this.settings.validClass;
      var form = this.form;

      _util.default.on(form, 'focusin change', validClass, function (e) {
        var target = e.target;
        var name = target.name; // if (_.has(this.fields, name)) {

        if (name in _this6.fields) {
          var field = _this6.fields[name];

          _this6.removeErrorClass(target, field.tip);
        }
      });
    }
    /**
     * @method
     * remove error style class
     * @param {HTMLElement} target - form element
     * @param {HTMLElement} tip - error tip element
     * */

  }, {
    key: "removeErrorClass",
    value: function removeErrorClass(target, tip) {
      var _this$settings4 = this.settings,
          showClass = _this$settings4.showClass,
          errorClass = _this$settings4.errorClass,
          wrapClass = _this$settings4.wrapClass,
          successClass = _this$settings4.successClass;
      var tipEle = tip;

      _util.default.removeClass(target, errorClass);

      _util.default.removeClass(tip, showClass);

      tipEle.innerText = '';

      if (target.closest && target.closest(wrapClass)) {
        _util.default.removeClass(target.closest(wrapClass), errorClass);

        _util.default.removeClass(target.closest(wrapClass), successClass);
      }
    }
    /**
     * @method
     * add loading class for remote item
     * @param {HTMLElement} target - form element
     * */

  }, {
    key: "addLoadClass",
    value: function addLoadClass(target) {
      var _this$settings5 = this.settings,
          loadClass = _this$settings5.loadClass,
          wrapClass = _this$settings5.wrapClass;

      _util.default.addClass(target, loadClass);

      if (target.closest && target.closest(wrapClass)) {
        _util.default.addClass(target.closest(wrapClass), loadClass);
      }
    }
    /**
     * @method
     * remove loading class for remote item
     * @param {HTMLElement} target - form element
     * */

  }, {
    key: "removeLoadClass",
    value: function removeLoadClass(target) {
      var _this$settings6 = this.settings,
          loadClass = _this$settings6.loadClass,
          wrapClass = _this$settings6.wrapClass;

      _util.default.removeClass(target, loadClass);

      if (target.closest && target.closest(wrapClass)) {
        _util.default.removeClass(target.closest(wrapClass), loadClass);
      }
    } // delegate focusout event

  }, {
    key: "delegateBlur",
    value: function delegateBlur() {
      var _this7 = this;

      _util.default.on(this.form, 'focusout', this.settings.validClass, function (e) {
        if (_this7.fields === null) return;
        var target = e.target;
        var name = target.name;

        if (!(name in _this7.fields)) {
          var item = _this7.addItem(target);

          _this7.addFields([item]);
        }

        var field = _this7.fields[name];

        if (!Validator.isRadioOrCheckbox(field.type)) {
          _this7.validField(field);
        }
      });
    }
  }, {
    key: "validForm",
    value: function validForm() {
      var arr = [];

      for (var i in this.fields) {
        if (Object.hasOwnProperty.call(this.fields, i)) {
          arr.push(i);
          var field = this.fields[i];
          this.validField(field, 'final');
        }
      }
    }
    /**
     * @method
     * verify single filed
     * @param {object} fieldItem
     * @param {String} type
     * {
          element,
          name,
          type,
          rules,
          tip,
          value,
          checked,
          remote,
          remoteOk
        }
     * */

  }, {
    key: "validField",
    value: function validField(fieldItem) {
      var _this8 = this;

      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var field = fieldItem;
      var element = field.element,
          rules = field.rules,
          tip = field.tip; // for 'checkbox' and 'radio'

      field.checked = Validator.getAttrChecked(element, 'checked');
      field.value = Validator.isRadioOrCheckbox(field.type) ? field.checked : element.value;
      Object.keys(rules).every(function (key) {
        var rule = rules[key];
        var value = field.value.trim ? field.value.trim() : field.value;

        if (key === 'remote' && type === 'final' && field.remote && field.remoteOk) {
          return false;
        }

        var validResult = testReg["is_".concat(key)](value, rule, key, field, _this8.form);

        if (typeof validResult === 'boolean') {
          if (!validResult) {
            _this8.showErrorTip(element, tip, rule.msg);

            field.valid = false;
            return false;
          }
        } else if (key === 'remote') {
          // self.addLoadClass(element);
          field.valid = true;
          field.remote = validResult;
          field.remoteOk = false;
          validResult.then(function (res) {
            // self.removeLoadClass(element);
            if (res.code === 200) {
              field.valid = true;

              _this8.showSuccessTip(element);
            } else {
              field.valid = false;

              _this8.showErrorTip(element, tip, res.msg || rule.msg);
            }

            field.remoteOk = true;
          });
          return true;
        }

        field.valid = true;
        return true;
      });

      if (field.fn && typeof field.fn === 'function') {
        field.fn(this, field);
      }
    }
    /**
     * @method
     * show error tip element
     * @param {HTMLFormElement} element - form element
     * @param {HTMLElement} tip - error tip element
     * @param {String} message - error message
     * */

  }, {
    key: "showErrorTip",
    value: function showErrorTip(element, tip, message) {
      var _this$settings7 = this.settings,
          errorClass = _this$settings7.errorClass,
          wrapClass = _this$settings7.wrapClass;
      var tipElement = tip;
      tipElement.innerHTML = message;

      _util.default.addClass(tipElement, 'show');

      _util.default.addClass(element, errorClass);

      if (element.closest && element.closest(wrapClass)) {
        _util.default.addClass(element.closest(wrapClass), errorClass);
      }
    }
  }, {
    key: "showSuccessTip",
    value: function showSuccessTip(element) {
      var _this$settings8 = this.settings,
          successClass = _this$settings8.successClass,
          wrapClass = _this$settings8.wrapClass;

      if (element.closest && element.closest(wrapClass)) {
        _util.default.addClass(element.closest(wrapClass), successClass);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.form = null;
      this.fields = null;
    }
  }], [{
    key: "getAttrChecked",
    value: function getAttrChecked(element, attr) {
      if (element.length > 0 && Validator.isRadioOrCheckbox(element[0].type)) {
        for (var i = 0, l = element.length; i < l; i += 1) {
          if (element[i].checked) {
            return element[i][attr];
          }
        }

        return false;
      }

      return element[attr];
    } // check if element is 'radio' or 'checkbox'

  }, {
    key: "isRadioOrCheckbox",
    value: function isRadioOrCheckbox(type) {
      return type === 'radio' || type === 'checkbox';
    }
  }, {
    key: "rulesToObject",
    value: function rulesToObject(rules, msgs) {
      var rulesArray = rules.split('|');
      var rulesObject = {};
      var msgArray = msgs ? msgs.split('|') : '';
      rulesArray.forEach(function (item, index) {
        var r = item.match(regs.rule);
        var ruleName;
        var ruleValue;
        var ruleMsg;

        if (r) {
          ruleName = r[1];
          ruleValue = r[2];
        } else {
          ruleName = item;
        }

        ruleMsg = msgArray[index] || defaultSettings[ruleName] || '';
        rulesObject[ruleName] = {
          value: ruleValue,
          msg: ruleMsg
        };
      });
      return rulesObject;
    }
  }]);

  return Validator;
}();

var _default = Validator;
exports.default = _default;
},{"../base/util.es6":"src/script/base/util.es6"}],"src/script/upload/Upload.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isObject(obj) {
  return _typeof(obj) === 'object' && obj !== null;
}

var errorMessage = {
  InternalError: '上传错误',
  InvalidFileExtensionError: '文件格式不正确',
  InvalidFileTypeError: '文件格式不正确',
  MaxFileSizeError: '文件过大',
  RequestError: '上传失败',
  UnsupportedError: '浏览器不支持此种上传',
  MultipleUnsupportedError: '不支持多文件上传'
};

var Upload =
/*#__PURE__*/
function () {
  function Upload(url, input, options) {
    var _this = this;

    _classCallCheck(this, Upload);

    var defaultSettings = {
      files: null,
      limit: 0,
      // 一次能同时添加的数量
      maxSize: 0,
      data: {},
      fileType: [],
      // 例 ['.jpeg', '.png', '.gif']
      fileName: 'file',
      // upload key
      dataType: 'json',
      maxUploads: 1000,
      // 假定系统能支持的上传数量
      beforeInit: null,
      init: null,
      start: function start() {
        return true;
      },
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

    if (this.settings.beforeInit) {
      this.settings.beforeInit(function (next) {
        if (next) {
          _this.create(input);
        }
      });
    } else {
      this.create(input);
    }
  }

  _createClass(Upload, [{
    key: "create",
    value: function create(element) {
      var _this2 = this;

      var _this$settings = this.settings,
          files = _this$settings.files,
          fileName = _this$settings.fileName;
      var input = element;
      if (!isObject(input) && !files) return;

      if (isObject(input) && input.length > 1) {
        input = input[0];
      }

      var name = input && input.name;

      if (fileName) {
        name = fileName;
      }

      var _files = files || input.files;

      this.fileName = name;
      this.files = _files;
      this.input = input;
      var fileNum = this.countFileNum();
      this.fileNum = fileNum;

      if (fileNum > 0) {
        // 初始化保存上传文件信息
        this.initUploadContext(fileNum, _files, input); // 考虑是否需要init回调限制上传数量

        var remaining = this.initRemaining();
        this.remaining = remaining; // array of file index

        if (remaining.length) {
          this.queuedFilesCount = remaining.length;
          this.activeUploads = remaining.length;
          this.queueUpload(remaining);
          this.beforeUploadStart();
        } else {
          this.uploadContexts.forEach(function (item, index) {
            _this2.setUploadState(index, 4);
          });
          this.finish();
        }
      } else {
        this.finish();
      }
    }
  }, {
    key: "countFileNum",
    value: function countFileNum() {
      var files = this.files,
          input = this.input;
      var limit = this.settings.limit;

      if (files && files.length) {
        return limit <= 0 ? files.length : Math.min(limit, files.length);
      }

      if (input.value) return 1;
      return 0;
    }
  }, {
    key: "initUploadContext",
    value: function initUploadContext(fileNum, files, input) {
      var uploadContexts = this.uploadContexts,
          _uploadData = this._uploadData;

      _toConsumableArray(Array(fileNum)).forEach(function (itm, i) {
        var id = Upload.createId();
        _uploadData[i] = {
          state: 0,
          id: id,
          xhr: null
        };
        uploadContexts[i] = {
          index: i,
          id: id,
          state: 'init',
          file: files !== null ? files[i] : {
            name: input.value.split(/(\\|\/)/g).pop()
          },
          cancel: function cancel() {
            var state = this.getUploadState(i);

            if (state === 0) {
              this.setUploadState(i, 4);
            } else if (state === 1) {
              this.setUploadState(i, 4);
              var data = _uploadData[i];

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
  }, {
    key: "getUploadState",
    value: function getUploadState(num) {
      return this._uploadData[num].state;
    }
    /**
     * 
     * @param num {number} file index
     * @param state {number} file state
     */

  }, {
    key: "setUploadState",
    value: function setUploadState(num, state) {
      var stateText = {
        0: 'init',
        1: 'uploading',
        2: 'success',
        3: 'error',
        4: 'cancel'
      };
      this._uploadData[num].state = state;
      this.uploadContexts[num].state = stateText[state];
    }
  }, {
    key: "initRemaining",
    value: function initRemaining() {
      var fileNum = this.fileNum;
      var remaining = [];

      for (var i = 0; i < fileNum; i += 1) {
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

  }, {
    key: "queueUpload",
    value: function queueUpload(remaining) {
      var _this3 = this;

      var result = []; // 文件类型和大小合法的文件index

      remaining.forEach(function (item) {
        if (_this3.validFile(item)) {
          if (_this3.start(item)) {
            result.push(item);
          }
        }
      });

      if (result.length) {
        this.uploads.push(result); // [1,3,4,5...]
      }
    }
  }, {
    key: "validateFileExtension",
    value: function validateFileExtension(file) {
      var validExtension = this.settings.fileType;
      var input = this.input;

      if (file && file.name) {
        var name = Upload.getFileExtension(file.name);
        return validExtension.lastIndexOf(name) > -1;
      }

      if (isObject(input) && input.value) {
        var _name = Upload.getFileExtension(input.value);

        return validExtension.lastIndexOf(_name) > -1;
      }

      return true; // can't valid // or return false ?
    }
  }, {
    key: "validFile",
    value: function validFile(num) {
      var input = this.input,
          files = this.files;
      var _this$settings2 = this.settings,
          fileType = _this$settings2.fileType,
          maxSize = _this$settings2.maxSize;
      var file;
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
  }, {
    key: "init",
    value: function init(num) {
      var init = this.settings.init;

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
  }, {
    key: "start",
    value: function start(num) {
      var start = this.settings.start;

      if (start) {
        if (start.call(this.uploadContexts[num]) === false) {
          this.setUploadState(num, 4);
          return false;
        }
      }

      return true;
    }
  }, {
    key: "beforeUploadStart",
    value: function beforeUploadStart() {
      var _this4 = this;

      var beforeUploadStart = this.settings.beforeUploadStart;

      if (beforeUploadStart) {
        beforeUploadStart(this.uploadContexts, function (next) {
          if (next) {
            _this4.uploadNext();
          }
        });
      } else {
        this.uploadNext();
      }
    }
  }, {
    key: "uploadNext",
    value: function uploadNext() {
      var _this$settings3 = this.settings,
          maxUploads = _this$settings3.maxUploads,
          beforeUpload = _this$settings3.beforeUpload,
          data = _this$settings3.data;
      var self = this;

      if (this.uploads.length && this.activeUploads < maxUploads) {
        var upload = this.uploads[0];
        var uploadNum = upload.shift();

        if (!upload.length) {
          this.uploads.shift();
        }

        if (beforeUpload) {
          beforeUpload.call(this.uploadContexts[uploadNum], uploadNum, function (next, _data) {
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
  }, {
    key: "objectToFormData",
    value: function objectToFormData(formData, obj, parent) {
      var _this5 = this;

      Object.keys(obj).forEach(function (key) {
        var item = obj[key];
        var k = !parent ? key : "".concat(parent, "[").concat(key, "]");

        if (!item) {
          formData.append(k, '');
        } else if (_typeof(item) === 'object') {
          _this5.objectToFormData(formData, item, k);
        } else {
          formData.append(k, item.toString());
        }
      });
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(num, data) {
      if (this.getUploadState(num) !== 1) return;
      var files = this.files,
          fileName = this.fileName;
      var self = this;

      if (files !== null) {
        var file = files[num];
        var formData = new FormData();
        this.objectToFormData(formData, data);
        formData.append(fileName, file);

        var _xhr = new XMLHttpRequest();

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
            self.progress(num, e.loaded / e.total * 100);
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
  }, {
    key: "progress",
    value: function progress(num, pro) {
      var progress = this.settings.progress;

      if (this.getUploadState(num) === 1) {
        if (progress) {
          progress.call(this.uploadContexts[num], pro);
        }
      }
    }
  }, {
    key: "success",
    value: function success(num, data) {
      var _this$settings4 = this.settings,
          success = _this$settings4.success,
          dataType = _this$settings4.dataType;
      var _data = data;

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
  }, {
    key: "error",
    value: function error(num, err) {
      var error = this.settings.error;
      var errObj = err;

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

  }, {
    key: "complete",
    value: function complete(num, status) {
      var complete = this.settings.complete;

      if (complete) {
        complete.call(this.uploadContexts[num], status); // status如果和uploadContexts里的一致可以删除
      }
    }
    /**
     * 单个文件取消上传 -> 文件上传结束
     * @param num {number} file index
     * */

  }, {
    key: "cancel",
    value: function cancel(num) {
      var cancel = this.settings.cancel;

      if (cancel) {
        cancel.call(this.uploadContexts[num]);
      }

      this.fileComplete(num, 'cancel');
    }
    /**
     * @param num {number} file index
     * @param status {string}
     * */

  }, {
    key: "fileComplete",
    value: function fileComplete(num, status) {
      this.complete(num, status);
      this.queuedFilesCount -= 1;

      if (this.queuedFilesCount === 0) {
        this.finish();
      }

      this.activeUploads -= 1;
    } // 整个上传结束

  }, {
    key: "finish",
    value: function finish() {
      var finish = this.settings.finish;

      if (finish) {
        finish.call(this.uploadContexts);
      }
    }
  }], [{
    key: "createId",
    value: function createId() {
      return 'id' + Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
    }
  }, {
    key: "getFileExtension",
    value: function getFileExtension(filename) {
      var dotPos = filename.lastIndexOf('.');
      return dotPos !== -1 ? filename.substr(dotPos).toLowerCase() : '';
    }
  }, {
    key: "validateFileSize",
    value: function validateFileSize(maxSize, file) {
      if (file) {
        var size = file.size;

        if (size && typeof size === 'number') {
          return size <= maxSize;
        }
      }

      return true;
    }
  }]);

  return Upload;
}();

var _default = Upload;
exports.default = _default;
},{}],"src/script/upload/UploadHelper.es6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = _interopRequireDefault(require("../base/util.es6"));

var _Upload = _interopRequireDefault(require("./Upload.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// move this js file to common
var UploadHelper =
/*#__PURE__*/
function () {
  function UploadHelper(selector, options) {
    _classCallCheck(this, UploadHelper);

    var defaultSettings = {
      url: ''
    };
    this.settings = Object.assign({}, defaultSettings, options);
    this.init(selector);
  }

  _createClass(UploadHelper, [{
    key: "init",
    value: function init(selector) {
      var element = selector;

      if (typeof selector === 'string') {
        element = document.querySelector(selector);
      }

      if (!element) return;
      var input = element.querySelector('input[type="file"]');
      this.wrap = element;
      this.input = input;

      if (element.hasAttribute('data-drag')) {
        this.dragEvents();
      }

      if (input.hasAttribute('accept')) {
        this.settings.fileType = input.getAttribute('accept').split(',');
      }

      if (_util.default.hasClass(element, 'ui-upload-img')) {
        this.singleUpload();
      }

      this.inputEvent();
    }
  }, {
    key: "createUpload",
    value: function createUpload(input) {
      var url = this.settings.url;
      new _Upload.default(url, input, this.settings); // input.value = ''; // eslint-disable-line
    }
  }, {
    key: "singleUpload",
    value: function singleUpload() {
      var wrap = this.wrap;
      var trigger = wrap.querySelector('.trigger');
      var image = wrap.querySelector('.image');
      var self = this;

      _util.default.on(wrap, 'click', '.js-clean', function () {
        _util.default.removeClass(trigger, 'hidden');

        _util.default.addClass(image, 'hidden');

        image.innerHTML = '';
        self.input.value = '';
      });
    }
  }, {
    key: "inputEvent",
    value: function inputEvent() {
      var input = this.input;
      var self = this;
      input.addEventListener('change', function () {
        self.createUpload(this);
      });
    }
  }, {
    key: "dragEvents",
    value: function dragEvents() {
      var wrap = this.wrap;
      var self = this;
      wrap.addEventListener('dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();

        _util.default.addClass(this, 'highlight');
      }, false);
      wrap.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();

        _util.default.removeClass(this, 'highlight');
      }, false);
      wrap.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();

        _util.default.addClass(this, 'highlight');
      }, false);
      wrap.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();

        _util.default.removeClass(this, 'highlight');

        var files = e.dataTransfer.files;
        self.createUpload(files);
      }, false);
    }
  }]);

  return UploadHelper;
}();

function _default(selector, options) {
  if (typeof selector === 'string') {
    var element = document.querySelectorAll(selector);

    _util.default.forEach(element, function (item) {
      new UploadHelper(item, options);
    });

    return;
  }

  if (_typeof(selector) === 'object') {
    if (selector.length) {
      _util.default.forEach(selector, function (item) {
        new UploadHelper(item, options);
      });

      return;
    }

    new UploadHelper(selector, options);
  }
}
},{"../base/util.es6":"src/script/base/util.es6","./Upload.es6":"src/script/upload/Upload.es6"}],"src/ui.es6":[function(require,module,exports) {
"use strict";

require("./polyfill/promise-polyfill.js");

require("./polyfill/fetch-polyfill.js");

require("./script/base/polyfill.es6");

var _util = _interopRequireDefault(require("./script/base/util.es6"));

var _InputCount = _interopRequireDefault(require("./script/form/InputCount.es6"));

var _PikaEx = _interopRequireDefault(require("./script/form/PikaEx.es6"));

var _CheckAll = _interopRequireDefault(require("./script/form/CheckAll.es6"));

var _Transfer = _interopRequireDefault(require("./script/form/Transfer.es6"));

var _Select = _interopRequireDefault(require("./script/select/Select.es6"));

var _Cascader = _interopRequireDefault(require("./script/select/Cascader.es6"));

var _Modal = _interopRequireDefault(require("./script/modal/Modal.es6"));

var _Message = _interopRequireDefault(require("./script/modal/Message.es6"));

var _Tooltip = _interopRequireDefault(require("./script/modal/Tooltip.es6"));

var _Popper = _interopRequireDefault(require("./script/modal/Popper.es6"));

var _Layer = _interopRequireDefault(require("./script/modal/Layer.es6"));

var _Position = _interopRequireDefault(require("./script/modal/Position.es6"));

var _Tag = _interopRequireDefault(require("./script/tag/Tag.es6"));

var _Validator = _interopRequireDefault(require("./script/validator/Validator.es6"));

var _Upload = _interopRequireDefault(require("./script/upload/Upload.es6"));

var _UploadHelper = _interopRequireDefault(require("./script/upload/UploadHelper.es6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.ui = {
  util: _util.default,
  Select: _Select.default,
  Cascader: _Cascader.default,
  CheckAll: _CheckAll.default,
  Modal: _Modal.default,
  Message: _Message.default,
  Tooltip: _Tooltip.default,
  InputCount: _InputCount.default,
  Tag: _Tag.default,
  Validator: _Validator.default,
  Upload: _Upload.default,
  Popper: _Popper.default,
  Layer: _Layer.default,
  PikaEx: _PikaEx.default,
  UploadHelper: _UploadHelper.default,
  Transfer: _Transfer.default,
  Position: _Position.default
};

_util.default.on(document, 'click', '[data-closeable]', function (e) {
  var node = this;

  if (_util.default.hasClass(e.target, 'icon-times')) {
    node.parentNode.removeChild(node);
  }
});

_util.default.on(document, 'click', '.node-trigger', function () {
  _util.default.toggleClass(this, 'expend');
});

if (!_util.default.supportPseudo(':focus-within')) {
  _util.default.on(document, 'focusin', '.ui-icon-input input', function () {
    _util.default.addClass(this.closest('.ui-icon-input'), 'active');
  });

  _util.default.on(document, 'focusout', '.ui-icon-input input', function () {
    _util.default.removeClass(this.closest('.ui-icon-input'), 'active');
  });
}
},{"./polyfill/promise-polyfill.js":"src/polyfill/promise-polyfill.js","./polyfill/fetch-polyfill.js":"src/polyfill/fetch-polyfill.js","./script/base/polyfill.es6":"src/script/base/polyfill.es6","./script/base/util.es6":"src/script/base/util.es6","./script/form/InputCount.es6":"src/script/form/InputCount.es6","./script/form/PikaEx.es6":"src/script/form/PikaEx.es6","./script/form/CheckAll.es6":"src/script/form/CheckAll.es6","./script/form/Transfer.es6":"src/script/form/Transfer.es6","./script/select/Select.es6":"src/script/select/Select.es6","./script/select/Cascader.es6":"src/script/select/Cascader.es6","./script/modal/Modal.es6":"src/script/modal/Modal.es6","./script/modal/Message.es6":"src/script/modal/Message.es6","./script/modal/Tooltip.es6":"src/script/modal/Tooltip.es6","./script/modal/Popper.es6":"src/script/modal/Popper.es6","./script/modal/Layer.es6":"src/script/modal/Layer.es6","./script/modal/Position.es6":"src/script/modal/Position.es6","./script/tag/Tag.es6":"src/script/tag/Tag.es6","./script/validator/Validator.es6":"src/script/validator/Validator.es6","./script/upload/Upload.es6":"src/script/upload/Upload.es6","./script/upload/UploadHelper.es6":"src/script/upload/UploadHelper.es6"}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52569" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/ui.es6"], null)
//# sourceMappingURL=/ui.6b26f7aa.map