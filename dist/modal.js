"use strict";function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function _iterableToArrayLimit(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}}function _arrayWithHoles(e){if(Array.isArray(e))return e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}!function(e){"function"==typeof define&&define.amd?define("modal",e):e()}(function(){var e;e=function(){function e(t){var n=this.constructor;return this.then(function(e){return n.resolve(t()).then(function(){return e})},function(e){return n.resolve(t()).then(function(){return n.reject(e)})})}var t=setTimeout;function r(){}function i(e){if(!(this instanceof i))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],u(e,this)}function o(n,r){for(;3===n._state;)n=n._value;0!==n._state?(n._handled=!0,i._immediateFn(function(){var e,t=1===n._state?r.onFulfilled:r.onRejected;if(null!==t){try{e=t(n._value)}catch(e){return void s(r.promise,e)}a(r.promise,e)}else(1===n._state?a:s)(r.promise,n._value)})):n._deferreds.push(r)}function a(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"===_typeof(e)||"function"==typeof e)){var n=e.then;if(e instanceof i)return t._state=3,t._value=e,void l(t);if("function"==typeof n)return void u((r=n,o=e,function(){r.apply(o,arguments)}),t)}t._state=1,t._value=e,l(t)}catch(e){s(t,e)}var r,o}function s(e,t){e._state=2,e._value=t,l(e)}function l(e){2===e._state&&0===e._deferreds.length&&i._immediateFn(function(){e._handled||i._unhandledRejectionFn(e._value)});for(var t=0,n=e._deferreds.length;t<n;t++)o(e,e._deferreds[t]);e._deferreds=null}function c(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function u(e,t){var n=!1;try{e(function(e){n||(n=!0,a(t,e))},function(e){n||(n=!0,s(t,e))})}catch(e){if(n)return;n=!0,s(t,e)}}i.prototype.catch=function(e){return this.then(null,e)},i.prototype.then=function(e,t){var n=new this.constructor(r);return o(this,new c(e,t,n)),n},i.prototype.finally=e,i.all=function(t){return new i(function(o,i){if(!t||void 0===t.length)throw new TypeError("Promise.all accepts an array");var a=Array.prototype.slice.call(t);if(0===a.length)return o([]);var s=a.length;for(var e=0;e<a.length;e++)!function t(n,e){try{if(e&&("object"===_typeof(e)||"function"==typeof e)){var r=e.then;if("function"==typeof r)return void r.call(e,function(e){t(n,e)},i)}a[n]=e,0==--s&&o(a)}catch(e){i(e)}}(e,a[e])})},i.resolve=function(t){return t&&"object"===_typeof(t)&&t.constructor===i?t:new i(function(e){e(t)})},i.reject=function(n){return new i(function(e,t){t(n)})},i.race=function(o){return new i(function(e,t){for(var n=0,r=o.length;n<r;n++)o[n].then(e,t)})},i._immediateFn="function"==typeof setImmediate?function(e){setImmediate(e)}:function(e){t(e,0)},i._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var n=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("unable to locate global object")}();n.Promise?n.Promise.prototype.finally||(n.Promise.prototype.finally=e):n.Promise=i},("object"!==("undefined"==typeof exports?"undefined":_typeof(exports))||"undefined"==typeof module)&&"function"==typeof define&&define.amd?define(e):e();var t,n,r="URLSearchParams"in self,o="Symbol"in self&&"iterator"in Symbol,s="FileReader"in self&&"Blob"in self&&function(){try{return new Blob,!0}catch(e){return!1}}(),i="FormData"in self,a="ArrayBuffer"in self;function l(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function c(e){return"string"!=typeof e&&(e=String(e)),e}function u(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return o&&(e[Symbol.iterator]=function(){return e}),e}function d(t){this.map={},t instanceof d?t.forEach(function(e,t){this.append(t,e)},this):Array.isArray(t)?t.forEach(function(e){this.append(e[0],e[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function f(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function h(n){return new Promise(function(e,t){n.onload=function(){e(n.result)},n.onerror=function(){t(n.error)}})}function m(e){var t=new FileReader,n=h(t);return t.readAsArrayBuffer(e),n}function v(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function p(){return this.bodyUsed=!1,this._initBody=function(e){if(this._bodyInit=e)if("string"==typeof e)this._bodyText=e;else if(s&&Blob.prototype.isPrototypeOf(e))this._bodyBlob=e;else if(i&&FormData.prototype.isPrototypeOf(e))this._bodyFormData=e;else if(r&&URLSearchParams.prototype.isPrototypeOf(e))this._bodyText=e.toString();else if(a&&s&&((t=e)&&DataView.prototype.isPrototypeOf(t)))this._bodyArrayBuffer=v(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!a||!ArrayBuffer.prototype.isPrototypeOf(e)&&!n(e))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=v(e)}else this._bodyText="";var t;this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):r&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},s&&(this.blob=function(){var e=f(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?f(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(m)}),this.text=function(){var e,t,n,r=f(this);if(r)return r;if(this._bodyBlob)return e=this._bodyBlob,t=new FileReader,n=h(t),t.readAsText(e),n;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),n=new Array(t.length),r=0;r<t.length;r++)n[r]=String.fromCharCode(t[r]);return n.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},i&&(this.formData=function(){return this.text().then(w)}),this.json=function(){return this.text().then(JSON.parse)},this}a&&(t=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],n=ArrayBuffer.isView||function(e){return e&&-1<t.indexOf(Object.prototype.toString.call(e))}),d.prototype.append=function(e,t){e=l(e),t=c(t);var n=this.map[e];this.map[e]=n?n+", "+t:t},d.prototype.delete=function(e){delete this.map[l(e)]},d.prototype.get=function(e){return e=l(e),this.has(e)?this.map[e]:null},d.prototype.has=function(e){return this.map.hasOwnProperty(l(e))},d.prototype.set=function(e,t){this.map[l(e)]=c(t)},d.prototype.forEach=function(e,t){for(var n in this.map)this.map.hasOwnProperty(n)&&e.call(t,this.map[n],n,this)},d.prototype.keys=function(){var n=[];return this.forEach(function(e,t){n.push(t)}),u(n)},d.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),u(t)},d.prototype.entries=function(){var n=[];return this.forEach(function(e,t){n.push([t,e])}),u(n)},o&&(d.prototype[Symbol.iterator]=d.prototype.entries);var y=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function b(e,t){var n,r,o=(t=t||{}).body;if(e instanceof b){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new d(e.headers)),this.method=e.method,this.mode=e.mode,this.signal=e.signal,o||null==e._bodyInit||(o=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"omit",!t.headers&&this.headers||(this.headers=new d(t.headers)),this.method=(n=t.method||this.method||"GET",r=n.toUpperCase(),-1<y.indexOf(r)?r:n),this.mode=t.mode||this.mode||null,this.signal=t.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function w(e){var o=new FormData;return e.trim().split("&").forEach(function(e){var t,n,r;e&&(n=(t=e.split("=")).shift().replace(/\+/g," "),r=t.join("=").replace(/\+/g," "),o.append(decodeURIComponent(n),decodeURIComponent(r)))}),o}function g(e,t){t=t||{},this.type="default",this.status=void 0===t.status?200:t.status,this.ok=200<=this.status&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new d(t.headers),this.url=t.url||"",this._initBody(e)}b.prototype.clone=function(){return new b(this,{body:this._bodyInit})},p.call(b.prototype),p.call(g.prototype),g.prototype.clone=function(){return new g(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new d(this.headers),url:this.url})},g.error=function(){var e=new g(null,{status:0,statusText:""});return e.type="error",e};var C=[301,302,303,307,308];g.redirect=function(e,t){if(-1===C.indexOf(t))throw new RangeError("Invalid status code");return new g(null,{status:t,headers:{location:e}})};var E,_,k=self.DOMException;try{new k}catch(e){(k=function(e,t){this.message=e,this.name=t;var n=Error(e);this.stack=n.stack}).prototype=Object.create(Error.prototype),k.prototype.constructor=k}function T(o,a){return new Promise(function(r,e){var t=new b(o,a);if(t.signal&&t.signal.aborted)return e(new k("Aborted","AbortError"));var i=new XMLHttpRequest;function n(){i.abort()}i.onload=function(){var e,o,t={status:i.status,statusText:i.statusText,headers:(e=i.getAllResponseHeaders()||"",o=new d,e.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(e){var t,n=e.split(":"),r=n.shift().trim();r&&(t=n.join(":").trim(),o.append(r,t))}),o)};t.url="responseURL"in i?i.responseURL:t.headers.get("X-Request-URL");var n="response"in i?i.response:i.responseText;r(new g(n,t))},i.onerror=function(){e(new TypeError("Network request failed"))},i.ontimeout=function(){e(new TypeError("Network request failed"))},i.onabort=function(){e(new k("Aborted","AbortError"))},i.open(t.method,t.url,!0),"include"===t.credentials?i.withCredentials=!0:"omit"===t.credentials&&(i.withCredentials=!1),"responseType"in i&&s&&(i.responseType="blob"),t.headers.forEach(function(e,t){i.setRequestHeader(t,e)}),t.signal&&(t.signal.addEventListener("abort",n),i.onreadystatechange=function(){4===i.readyState&&t.signal.removeEventListener("abort",n)}),i.send(void 0===t._bodyInit?null:t._bodyInit)})}function A(e){return"function"==typeof e||"[object Function]"===E.call(e)}function S(e){var t,n=(t=Number(e),isNaN(t)?0:0!==t&&isFinite(t)?(0<t?1:-1)*Math.floor(Math.abs(t)):t);return Math.min(Math.max(n,0),_)}T.polyfill=!0,self.fetch||(self.fetch=T,self.Headers=d,self.Request=b,self.Response=g),Array.from||(Array.from=(E=Object.prototype.toString,_=Math.pow(2,53)-1,function(e,t,n){var r=Object(e);if(null==e)throw new TypeError("Array.from requires an array-like object - not null or undefined");var o,i=1<arguments.length?t:void 0;if(void 0!==i){if(!A(i))throw new TypeError("Array.from: when provided, the second argument must be a function");2<arguments.length&&(o=n)}for(var a,s=S(r.length),l=A(this)?Object(new this(s)):new Array(s),c=0;c<s;)a=r[c],l[c]=i?void 0===o?i(a,c):i.call(o,a,c):a,c+=1;return l.length=s,l})),Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(t))return null;if(!Element.prototype.matches)return t.parentNode;do{if(t.matches(e))return t;t=t.parentElement}while(null!==t);return null}),"function"!=typeof Object.assign&&Object.defineProperty(Object,"assign",{value:function(e,t){if(null==e)throw new TypeError("Cannot convert undefined or null to object");for(var n=Object(e),r=1;r<arguments.length;r+=1){var o=arguments[r];if(null!=o)for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(n[i]=o[i])}return n},writable:!0,configurable:!0}),HTMLElement.prototype.trigger=function(e,t){var n=document.createEvent("HTMLEvents");return n.initEvent(e,!0,!0),n.data=t||{},n.eventName=e,this.dispatchEvent(n),this},window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)},window.cancelAnimFrame=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||function(e){window.clearTimeout(e)};try{new window.CustomEvent("T")}catch(e){var O=function(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n};O.prototype=window.Event.prototype,window.CustomEvent=O}var x={IEVersion:function(){var e=window.navigator.userAgent,t=e.indexOf("MSIE");return 0<t||e.match(/Trident.*rv:11\./)?parseInt(e.substring(t+5,e.indexOf(".",t)),10):999},forEach:function(e,t){[].slice.call(e).forEach(t)},isEmpty:function(e){return null==e||"object"===_typeof(e)&&0===Object.keys(e).length||"string"==typeof e&&0===e.trim().length},getUrlParameter:function(e){if("function"==typeof window.URLSearchParams)return new URLSearchParams(window.location.search).get(e);var t=e.replace(/[\[\]]/g,"\\$&"),n=new RegExp("[?&]"+t+"(=([^&#]*)|&|#|$)").exec(decodeURIComponent(location.href));return n?n[2]?n[2]:"":null},hasClass:function(t,e){return!!t&&(!!t.className&&(t.classList?e.match(/(\w|-)+/g).every(function(e){return t.classList.contains(e)}):!!t.className.match(new RegExp("(\\s|^)"+e+"(\\s|$)"))))},addClass:function(t,e){var n;t&&e&&((n=t).classList?e.match(/(\w|-)+/g).forEach(function(e){t.classList.add(e)}):this.hasClass(t,e)||(n.className=t.className?t.className.trim()+" "+e:e))},removeClass:function(t,e){var n;t&&e&&((n=t).classList?e.match(/(\w|-)+/g).forEach(function(e){t.classList.remove(e)}):n.className=n.className.replace(new RegExp("(\\s|^)".concat(e,"(\\s|$)"))," "))},toggleClass:function(t,e){t&&e&&(t.classList?e.match(/(\w|-)+/g).forEach(function(e){t.classList.toggle(e)}):this.hasClass(t,e)?this.removeClass(t,e):this.addClass(t,e))},addMultiEvent:function(e,t,n){for(var r=t.split(" "),o=0,i=r.length;o<i;o+=1)e.addEventListener(r[o],n,!1)},on:function(n,e,r,o){this.addMultiEvent(n,e,function(e){for(var t=e.target;t&&t!==n;t=t.parentNode)if(t.matches(r)){o.call(t,e);break}})},createElement:function(e,t,n){var r=1<arguments.length&&void 0!==t?t:{},o=2<arguments.length&&void 0!==n?n:"",i=document.createElement(e);for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[a]=r[a]);try{i.innerHTML=o}catch(e){throw new Error(e)}return i},createId:function(){return Number(Math.random().toString().substr(3,3)+Date.now()).toString(36)},supportPseudo:function(e){var t,n=e,r=document.styleSheets[0];r||(t=document.createElement("style"),document.head.appendChild(t),r=document.styleSheets[0],document.head.removeChild(t));return function(){try{return/^:/.test(e)||(n=":"+e),r.insertRule("html"+n+"{}",0),r.deleteRule(0),!0}catch(e){return!1}}()},dateFormate:function(e,t){var n,r=new Date(e),o=r.getFullYear()+"",i=("0"+(r.getMonth()+1)).slice(-2),a=("0"+r.getDate()).slice(-2),s=("0"+r.getHours()).slice(-2),l=("0"+r.getMinutes()).slice(-2),c=("0"+r.getSeconds()).slice(-2),u={YY:o,MM:i,DD:a,hh:s,mm:l,ss:c};return t?(n=t,Object.keys(u).forEach(function(e){n=n.replace(e,u[e])})):n="".concat(o,"-").concat(i,"-").concat(a," ").concat(s,":").concat(l,":").concat(c),n},getPageScrollTop:function(){return window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0},getPageScrollLeft:function(){return window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0},fetchData:function(e,t,n,r){var o,i=1<arguments.length&&void 0!==t?t:{},a=2<arguments.length&&void 0!==n?n:"GET",s=3<arguments.length&&void 0!==r?r:{Accept:"application/json, text/javascript, */*; q=0.01","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},l=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&l.push("".concat(c,"=").concat(encodeURIComponent(i[c])));if(o=l.join("&"),"POST"===a)return fetch(e,{method:a,headers:s,body:o}).then(function(e){if(e.status)return e.json();throw new Error("post data fetch error!")});var u=e;return o&&(u=0<e.indexOf("?")?"".concat(e,"&").concat(o):"".concat(e,"?").concat(o)),fetch(u,{}).then(function(e){if(e.status)return e.json();throw new Error("get data fetch error!")})}},j=function(){function o(e){_classCallCheck(this,o);var t={modal:null,modalBox:".modal-box",modalContent:".modal-content",modalTitle:".modal-title",title:null,type:null,open:"[data-modal-open]",close:"[data-modal-close]",showClass:"modal-visible",animateClass:"fadeInDown",resize:!1,clickOutside:!0,closeKey:27,onOpen:null,onClose:null,onResize:null,onCancel:null,onConfirm:null,footer:!0,cancelBtn:"取消",confirmBtn:"确定",btnOkClass:"ui-button primary",btnCancelClass:"ui-button",btnType:"",zIndex:19e3};e&&"confirm"===e.type&&(t.btnOkClass="ui-button small primary",t.btnCancelClass="ui-button small"),this.settings=Object.assign({},t,e),this.isShow=!1,this.current=null,this.init()}return _createClass(o,[{key:"init",value:function(){var e=this.settings.modal,t=this.settings,n=t.modalBox,r=t.modalContent,o=t.modalTitle,i=t.type,e=e||this.createModalHtml(i);this.modal=e,this.modalBox=e.querySelector(n),this.modalTitle=e.querySelector(o),this.modalContent=e.querySelector(r),this.modalOk=e.querySelector(".modal-ok"),this.modalCancel=e.querySelector(".modal-cancel"),this.events()}},{key:"createModalHtml",value:function(e){var t=this.settings.zIndex,n="",r="ui-modal";switch(e){case"confirm":n=this.createConfirmTypeHtml(),r="ui-modal-confirm";break;default:n=this.createModalTypeHtml()}var o=x.createElement("div",{className:r},n);return o.style.zIndex=t,document.body.appendChild(o)}},{key:"createModalFooter",value:function(){var e,t=this.settings,n=t.cancelBtn,r=t.footer,o=t.confirmBtn,i=t.btnOkClass,a=t.btnCancelClass,s=t.onCancel,l="",c="",u="";return r&&(o&&(l='<button class="'.concat(i,' modal-ok">').concat(o,"</button>")),n&&(e=s?"":"data-modal-close",c='<button class="'.concat(a,' modal-cancel" ').concat(e,">").concat(n,"</button>")),(o||n)&&(u='<div class="modal-footer">'.concat(c).concat(l,"</div>"))),u}},{key:"createModalTypeHtml",value:function(){var e=this.settings.resize,t=e?" resizable":"",n=e?'<span class="resize-trigger"></span>':"",r=this.createModalFooter();return'<div class="modal-box'.concat(t,'">')+'<span class="modal-close iconfont icon-times" data-modal-close></span><div class="modal-title"></div><div class="modal-content"></div>'+"".concat(r).concat(n,"</div>")}},{key:"createConfirmTypeHtml",value:function(){return'<div class="ui-confirm modal-box"><div class="modal-content"></div>'+this.createModalFooter()+"</div>"}},{key:"setContent",value:function(e){this.modalContent.innerHTML=e}},{key:"setTitle",value:function(e){e&&(this.modalTitle.innerHTML='<div class="modal-head">'.concat(e,"</div>"))}},{key:"show",value:function(e){var t=e.content,n=e.title;this.setContent(t),this.setTitle(n),this.toggleShowHide("show"),document.body.scrollHeight>document.documentElement.clientHeight&&x.addClass(document.querySelector("html"),"modal-open")}},{key:"confirm",value:function(e,t){var n=1<arguments.length&&void 0!==t?t:null,r=o.createConfirmHtml(e);this.getData=n,this.setContent(r),this.toggleShowHide("show")}},{key:"hide",value:function(){this.toggleShowHide("hide"),this.modalContent.innerHTML="",this.modalTitle&&(this.modalTitle.innerHTML=""),document.querySelector(".modal-visible")||x.removeClass(document.querySelector("html"),"modal-open")}},{key:"toggleShowHide",value:function(e){var t=this.modal,n=this.modalBox,r=this.settings,o=r.showClass,i=r.animateClass,a=r.onOpen,s=r.onClose;"show"===e&&(x.addClass(t,o),x.addClass(n,i),this.isShow=!0,"function"==typeof a&&a(this)),"hide"===e&&(this.isShow=!1,"function"==typeof s&&s(this),x.removeClass(t,o),x.removeClass(n,i))}},{key:"events",value:function(){var t=this,n=this,e=this.settings,r=e.clickOutside,o=e.closeKey,i=e.resize,a=e.onCancel,s=e.onConfirm,l=this.modalOk,c=this.modalCancel;x.on(this.modal,"click","[data-modal-close]",function(){t.hide()}),l&&s&&l.addEventListener("click",function(e){s(e,n,n.getData)}),c&&a&&c.addEventListener("click",function(e){a(e,n,n.getData)}),r&&document.body.addEventListener("keydown",function(e){e.keyCode===o&&t.hide()}),i&&this.resizeEvent()}},{key:"resizeEvent",value:function(){var r,o,i,a,s,l,c=this.modalBox,t=document.documentElement,u=this.settings.onResize;function n(e){var t=i+2*(e.clientX-r),n=a+2*(e.clientY-o);s<t&&(t=s),l<n&&(n=l),c.style.width=t+"px",c.style.height=n+"px","function"==typeof u&&u(t,n)}function d(){t.removeEventListener("mousemove",n,!1),t.removeEventListener("mouseup",d,!1)}c.querySelector(".resize-trigger").addEventListener("mousedown",function(e){e.preventDefault(),e.stopPropagation(),r=e.clientX,o=e.clientY,s=.95*t.clientWidth,l=.98*t.clientHeight,i=c.getBoundingClientRect().width,a=c.getBoundingClientRect().height,t.addEventListener("mousemove",n,!1),t.addEventListener("mouseup",d,!1)},!1)}}],[{key:"createConfirmHtml",value:function(e){var t=e.content,n=e.desc,r=e.dom,o=t?'<div class="warn">'.concat(t,"</div>"):"",i=n?'<div class="desc">'.concat(n,"</div>"):"";return r||"".concat(o).concat(i)}}]),o}(),F=null,R=function(){function a(e){_classCallCheck(this,a);this.settings=Object.assign({},{duration:2e3,position:"center"},e)}return _createClass(a,[{key:"show",value:function(e,t,n){var r=n||this.settings.position,o=a.createAlert(t,e,r),i=document.body.appendChild(o);F&&a.hide(F),F=i,setTimeout(function(){i&&i.parentNode&&(i.parentNode.removeChild(i),F=null)},this.settings.duration)}},{key:"warn",value:function(e,t){this.show("warn",e,t)}},{key:"success",value:function(e,t){this.show("success",e,t)}},{key:"loading",value:function(e){this.show("loading",null,e)}}],[{key:"hide",value:function(e){e.parentNode.removeChild(e)}},{key:"createDomString",value:function(e,t){var n="toast-".concat(t),r="success"===t?'<i class="iconfont icon-success-fill"></i>':"";return'<div class="ui-toast"><div class="toast-content '.concat(n,'">').concat(r).concat(e,"</div></div>")}},{key:"createAlert",value:function(e,t,n){var r=a.createDomString(e,t);return x.createElement("div",{className:"ui-toast-wrap ".concat(n)},r)}}]),a}(),L=document,P={chinese:"请填写中文",date:"日期格式不正确",email:"邮箱格式不正确",english:"请填写字母",idCard:"身份证号格式不正确",mobile:"手机号格式不正确",number:"请填写数字",phone:"手机号格式不正确",qq:"qq格式不正确",weChat:"微信格式不正确",tel:"电话号码格式不正确",time:"时间格式不正确",url:"地址格式不正确",required:"请填写该项",int:"请填写不为0的正整数"},q={_rule:/^(.+?)\((.+)\)$/,chinese:/^[\u0391-\uFFE5]+$/,date:/^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$/,email:/^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/,english:/^[A-Za-z]+$/,idCard:/^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/,int:/^[1-9][0-9]*$/,mobile:/^1[3-9]\d{9}$/,number:/^[0-9]+$/,qq:/^[1-9]\d{4,}$/,weChat:/^[-_a-zA-Z0-9]{4,24}$/,url:/[a-zA-z]+:\/\/[^\s]/,tel:/^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/,time:/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/,price:/^-?(([1-9]+\d*)|([1-9]\d*.\d{0,2})|(0.\d{0,2})|(0))$/,password:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,phone:/^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[579]|15[0-3,5-9]|16[67]|17[0135678]|18[0-9]|19[189])\d{8}$/,passport:/^((E|K)[0-9]{8})|(((SE)|(DE)|(PE)|(MA))[0-9]{7})$/,ip:/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,domain:/^[\w-_\u0391-\uFFE5]+$/},B={is_or:function(e){var t=e.value,n=e.rule.value.split(","),r=!1;return""===t||(n.forEach(function(e){q[e]&&q[e].test(t)&&(r=!0)}),r)},is_email:function(e){var t=e.value;return!t||q.email.test(t)},is_english:function(e){var t=e.value;return!t||q.english.test(t)},is_chinese:function(e){var t=e.value;return!t||q.chinese.test(t)},is_number:function(e){var t=e.value;return!t||q.number.test(t)},is_idCard:function(e){var t=e.value;return!t||q.idCard.test(t)},is_int:function(e){var t=e.value,n=e.field.element.validity;return(!n||!n.badInput)&&(!t||q.int.test(t))},is_mobile:function(e){var t=e.value;return!t||q.mobile.test(t)},is_price:function(e){var t=e.value;return!t||q.price.test(t)},is_qq:function(e){var t=e.value;return!t||q.qq.test(t)},is_weChat:function(e){var t=e.value;return!t||q.weChat.test(t)},is_tel:function(e){var t=e.value;return!t||q.tel.test(t)},is_time:function(e){var t=e.value;return!t||q.time.test(t)},is_passport:function(e){var t=e.value;return!t||q.passport.test(t)},is_url:function(e){var t=e.value;return!t||q.url.test(t)},is_required:function(e){var t=e.value;return!(!t||""===t||void 0===t)},is_reg:function(e){var t=e.value,n=e.rule,r=new RegExp(n.value);return!t||r.test(t)},is_password:function(e){var t=e.value;return!t||q.password.test(t)},is_not:function(e){return e.value!==e.rule.value},getCheckedCheckbox:function(e){var t=0;return[].slice.call(e).forEach(function(e){e.checked&&(t+=1)}),t},is_max:function(e){var t=e.value,n=e.rule,r=e.field,o=r.type,i=r.element,a=n.value;return"checkbox"===o?this.getCheckedCheckbox(i)<=a:!t||t.length<=a},is_min:function(e){var t=e.value,n=e.rule,r=e.field,o=r.type,i=r.element;return"checkbox"!==o?!t||t.length>=n.value:this.getCheckedCheckbox(i)>=n.value},is_phone:function(e){var t=e.value;return!t||q.phone.test(t)},is_ip:function(e){var t=e.value;return!t||q.ip.test(t)},is_domain:function(e){var t=e.value;return!t||q.domain.test(t)},is_remote:function(e){var t=e.value,n=e.rule,r=e.field,i=e.form,o=n.value,a=o.split(","),s={},l="GET";if(1<a.length){o=a.shift();var c=!0;if(a.forEach(function(e){var t=_slicedToArray(e.replace(" ","").match(/^(\S*)\[(\S*)\]$/),3),n=(t[0],t[1]),r=t[2],o=i.querySelector('[name="'.concat(r,'"]')).value;s[n]=encodeURIComponent(o),o.length||(c=!1)}),!c)return!1}var u=o.charAt(o.length-1);if(0===o.indexOf("post:")&&(l="POST",o=o.slice(5)),t){var d=s;return"="===u?o+=t:d=Object.assign({},s,_defineProperty({},r.element.name,t)),"POST"===l&&window.jQuery?new Promise(function(t){window.jQuery.post(o,d,function(e){t(e)},"json")}):x.fetchData(o,d,l)}return!1},is_same:function(e){var t=e.value,n=e.rule;return t===L.querySelector('[name="'.concat(n.value,'"]')).value.trim()},is_diff:function(e){var t=e.value,n=e.rule,r=e.form.querySelector('[name="'.concat(n.value,'"]')).value.trim();return!r.length||t!==r},is_gt:function(e){var t=e.value,n=e.rule,r=L.querySelector('[name="'.concat(n.value,'"]'));return Number(t)>Number(r.value)},is_gte:function(e){var t=e.value,n=e.rule,r=L.querySelector('[name="'.concat(n.value,'"]'));return Number(t)>=Number(r.value)},is_gtnum:function(e){var t=e.value,n=e.rule;return""===t||Number(t)>Number(n.value)},is_gtenum:function(e){var t=e.value,n=e.rule;return""===t||Number(t)>=Number(n.value)},is_ltnum:function(e){var t=e.value,n=e.rule;return""===t||Number(t)<Number(n.value)},is_ltenum:function(e){var t=e.value,n=e.rule;return""===t||Number(t)<=Number(n.value)}},I=function(){function m(e,t,n,r,o){var i=this;_classCallCheck(this,m);var a=t,s=n,l=r,c=o;"function"==typeof t?(l=t,c=n,s=a=null):"function"==typeof n&&(l=n,c=r,a=null,s=t);var u=e;"string"==typeof e&&(u=L.querySelector(e)),u&&(this.settings=Object.assign({},{wrapSelector:".ui-control-wrap",validSelector:".v-item",errorClass:"error",successClass:"success",loadClass:"loading",tipElement:"span",tipClass:"v-error-tip",showClass:"show",separator:"|",realTime:!0,shouldFresh:!1,remoteLoading:!1,scrollToError:!1,fetchSuccess:function(e){return 200===e.code}},s),this.fields={},this.form=u,a&&this.addFields(a),this.settings.realTime&&this.delegateBlur(),this.delegateFocus(),this.form.addEventListener("submit",function(e){return e.preventDefault(),i.validAllFields(l,c),!1}))}return _createClass(m,[{key:"validAllFields",value:function(e,t){var n=this,r=this.settings,o=r.validSelector,i=r.shouldFresh,a=this,s=this.form.querySelectorAll(o),l=[];s&&(i&&(this.fields={}),this.initFields(s)),this.addResultToFields(),this.valid=!0,Object.keys(this.fields).every(function(e){var t=n.fields[e].valid;return l.push(e),t||(n.valid=!1),t}),this.checkValidResult(0,l,function(){a.validCallback(e,t)})}},{key:"addResultToFields",value:function(){var n=this,r=this.fields;Object.keys(r).forEach(function(e){var t=r[e];n.validField(t,"final")})}},{key:"checkValidResult",value:function(t,n,r){var e=this.fields,o=this.settings.fetchSuccess,i=this;if(t>=n.length)return i.valid=!0,void r();var a=e[n[t]];a.remote?a.remote.then(function(e){o(e)?i.checkValidResult(t+1,n,r):(i.valid=!1,r())}):a.valid?i.checkValidResult(t+1,n,r):(i.valid=!1,r())}},{key:"validCallback",value:function(e,t){var n,r,o=this.settings,i=o.tipClass,a=o.showClass,s=o.scrollToError,l=this.fields,c=this.form;this.valid?"function"==typeof e&&e(c,l):(!s||(n=L.querySelector("."+i+"."+a))&&(r=n.getBoundingClientRect().top-80+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0),window.scrollTo(0,r)),"function"==typeof t&&t(c,l))}},{key:"addFields",value:function(e){for(var t=this.settings,n=t.validSelector,r=t.realTime,o=this.form,i=0,a=e.length;i<a;i+=1){var s=e[i],l=s.name,c=s.rules,u=s.msgs,d=o[l],f={element:d,name:l,type:0<d.length?d.type||d[0].type:d.type,rules:this.rulesToObject(c,u),tip:this.createErrorTip(d),value:null,checked:null,fn:s.fn||null};this.fields[l]=f,x.hasClass(d,n.replace(".",""))||r&&(this.addBlurEvent(f),this.addFocusEvent(f))}}},{key:"createErrorTip",value:function(e){var t,n=e.length&&0<e.length?e[0]:e,r=this.settings,o=r.tipElement,i=r.wrapSelector,a=r.tipClass,s=n.closest(i),l=n.id?" v-tip-".concat(n.id):"",c=n.getAttribute("data-tip");return c?t=this.form.querySelector(c):s.querySelector(".".concat(a))?t=s.querySelector(".".concat(a)):((t=L.createElement(o)).className="".concat(a).concat(l),s.appendChild(t))}},{key:"initFields",value:function(e){var n=this,r=[];[].slice.call(e).forEach(function(e){var t;e.name in n.fields||(t=n.addItem(e))&&r.push(t)}),this.addFields(r)}},{key:"addItem",value:function(e){var t=e.name,n=this.form[t],r=n;0<n.length&&m.isRadioOrCheckbox(n[0].type)&&(r=n[0]);var o=r.getAttribute("data-rules"),i=r.getAttribute("data-msgs")||"";return!(!t||!o)&&{name:t,rules:o,msgs:i}}},{key:"rulesToObject",value:function(e,t){var n=this.settings.separator,r=e.split(n),a={},s=t?t.split(n):"";return r.forEach(function(e,t){var n,r,o,i=e.match(q._rule);i?(n=i[1],r=i[2]):n=e,o=s[t]||P[n]||"error",a[n]={value:r,msg:o}}),a}},{key:"addBlurEvent",value:function(e){var t=this;m.isRadioOrCheckbox(e.type)||e.element.addEventListener("blur",function(){t.validField(e)})}},{key:"addFocusEvent",value:function(e){var t=this,n=e.element,r=e.tip,o=e.type;m.isRadioOrCheckbox(o)&&1<n.length?[].slice.call(n).forEach(function(e){return t.addFocus(e,r)}):this.addFocus(n,r)}},{key:"addFocus",value:function(e,t){var n=this;e.addEventListener("focus",function(){n.removeErrorClass(this,t)})}},{key:"delegateFocus",value:function(){var o=this,e=this.settings.validSelector,t=this.form;x.on(t,"focusin change",e,function(e){var t,n=e.target,r=n.name;r in o.fields&&(t=o.fields[r],o.removeErrorClass(n,t.tip))})}},{key:"delegateBlur",value:function(){var i=this;x.on(this.form,"focusout",this.settings.validSelector,function(e){var t,n,r,o;null!==i.fields&&((n=(t=e.target).name)in i.fields||(r=i.addItem(t),i.addFields([r])),o=i.fields[n],m.isRadioOrCheckbox(o.type)||i.validField(o))})}},{key:"removeErrorClass",value:function(e,t){var n=this.settings,r=n.showClass,o=n.errorClass,i=n.wrapSelector,a=n.successClass,s=t;x.removeClass(e,o),x.removeClass(t,r),s.innerText="",e.closest&&e.closest(i)&&(x.removeClass(e.closest(i),o),x.removeClass(e.closest(i),a))}},{key:"addLoadClass",value:function(e){var t=this.settings,n=t.loadClass,r=t.wrapSelector;x.addClass(e,n),e.closest&&e.closest(r)&&x.addClass(e.closest(r),n)}},{key:"removeLoadClass",value:function(e){var t=this.settings,n=t.loadClass,r=t.wrapSelector;x.removeClass(e,n),e.closest&&e.closest(r)&&x.removeClass(e.closest(r),n)}},{key:"validField",value:function(e,t){var o=this,i=1<arguments.length&&void 0!==t?t:"",a=e,s=this.form,n=this.settings,l=a.element,c=a.rules,u=a.tip,r=a.type,d=n.remoteLoading,f=n.fetchSuccess;a.checked=m.getAttrChecked(l,"checked"),a.value=m.isRadioOrCheckbox(r)?a.checked:l.value;var h=a.value;Object.keys(c).every(function(e){var t=c[e],n="string"==typeof h?h.trim():h;if("remote"===e&&"final"===i&&a.remote&&a.remoteOk)return!1;if(l.hasAttribute&&l.hasAttribute("disabled"))return a.valid=!0,a.validRule=void 0,!1;var r=B["is_".concat(e)]({value:n,rule:t,key:e,field:a,form:s});if("boolean"==typeof r){if(!r)return o.showErrorTip(l,t.msg,u),a.valid=!1,a.validRule=t,o.removeSuccessTip(l),!1;o.showSuccessTip(l)}else if("remote"===e)return d&&o.addLoadClass(l),a.valid=!0,a.remote=r,a.remoteOk=!1,r.then(function(e){d&&o.removeLoadClass(l),f(e)?(a.valid=!0,a.validRule=void 0,o.showSuccessTip(l)):(a.valid=!1,a.validRule=t,o.showErrorTip(l,e.msg||t.msg,u)),a.remoteOk=!0}),!0;return a.valid=!0}),a.fn&&"function"==typeof a.fn&&a.fn(this,a)}},{key:"showErrorTip",value:function(e,t,n){var r,o,i=this.settings,a=i.errorClass,s=i.wrapSelector,l=i.tipClass,c=n,u=e;"string"==typeof e&&(u=this.form[e]),u&&(!n&&u.closest&&((c=(r=u.closest(s)).querySelector("."+l))||((o=document.createElement("div")).className=l,c=r.appendChild(o))),c.innerHTML=t,x.addClass(c,"show"),x.addClass(u,a),u.closest&&u.closest(s)&&x.addClass(u.closest(s),a))}},{key:"showSuccessTip",value:function(e){var t=this.settings,n=t.successClass,r=t.wrapSelector;e.closest&&e.closest(r)&&x.addClass(e.closest(r),n)}},{key:"removeSuccessTip",value:function(e){var t=this.settings,n=t.successClass,r=t.wrapSelector;e.closest&&e.closest(r)&&x.removeClass(e.closest(r),n)}},{key:"destroy",value:function(){this.form=null,this.fields=null}},{key:"cleanTip",value:function(e){var t,n=this.fields[e];n&&((t=n.element).length&&(t=n.element[0]),this.removeErrorClass(t,n.tip))}},{key:"cleanTips",value:function(e){var t=this,n=this.fields;e?this.cleanTip(e):Object.keys(n).forEach(function(e){t.cleanTip(e)})}}],[{key:"getAttrChecked",value:function(e,t){if(0<e.length&&m.isRadioOrCheckbox(e[0].type)){for(var n=0,r=e.length;n<r;n+=1)if(e[n].checked)return e[n][t];return!1}return e[t]}},{key:"isRadioOrCheckbox",value:function(e){return"radio"===e||"checkbox"===e}}]),m}(),N=function(){function r(e,t){_classCallCheck(this,r);var n=Object.assign({},{navActive:"active",conActive:"show",navSelector:".tab-itm",conSelector:".tab-content",onChange:null},t);this.settings=n,this.init(e)}return _createClass(r,[{key:"init",value:function(e){var t=e;"string"==typeof e&&(t=document.querySelector(e)),t&&(this.wrapper=t,this.createIndex(),this.events())}},{key:"createIndex",value:function(){var e=this.wrapper,t=this.settings,n=t.navSelector,r=t.conSelector,o=e.querySelectorAll(n),i=e.querySelectorAll(r);this.navElements=o,this.contentElements=i,[].slice.call(o).forEach(function(e,t){e.setAttribute("data-index",t)})}},{key:"handleChangeTab",value:function(e){var t=this,n=this.settings,r=n.navActive,o=n.onChange,i=e.getAttribute("data-index"),a=Number(i);x.hasClass(e,r)||(o?o(a,function(){t.changeTab(e,a)}):this.changeTab(e,a))}},{key:"changeTab",value:function(e,n){var t=this.settings,r=this.navElements,o=this.contentElements,i=t.navActive,a=t.conActive;x.addClass(e,i),[].slice.call(r).forEach(function(e,t){t!==n&&x.removeClass(e,i)}),[].slice.call(o).forEach(function(e,t){t===n?x.addClass(e,a):x.removeClass(e,a)})}},{key:"events",value:function(){var e=this,t=e.wrapper,n=e.settings.navSelector;x.on(t,"click",n,function(){e.handleChangeTab(this)})}}]),r}();var M={util:x,Modal:j,Validator:I,Toast:R,Tab:function(e,t){if("string"!=typeof e)return"object"===_typeof(e)&&null!==e?e.length?[].slice.call(e).map(function(e){return new N(e,t)}):new N(e,t):null;var n=document.querySelectorAll(e);return[].slice.call(n).map(function(e){return new N(e,t)})}};window.ui=M});