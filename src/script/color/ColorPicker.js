// // @ts-nocheck
// /* eslint-disable */ 
// let canvas; 
// let ctx;
// const tinycolor = window.tinycolor;

// // 中间的canvas
// var spectrumCanvas = document.getElementById('spectrum-canvas');
// var spectrumCtx = spectrumCanvas.getContext('2d');
// var spectrumCursor = document.getElementById('spectrum-cursor'); 
// var spectrumRect = spectrumCanvas.getBoundingClientRect();
  
// // 颜色条
// var hueCanvas = document.getElementById('hue-canvas');
// var hueCtx = hueCanvas.getContext('2d');
// var hueCursor = document.getElementById('hue-cursor'); 
// var hueRect = hueCanvas.getBoundingClientRect();
  
// var currentColor = '';

// var hue = 0;
// var saturation = 1;
// var lightness = 0.5;
  
// var rgbFields = document.getElementById('rgb-fields');
// var hexField = document.getElementById('hex-field');

// var red = document.getElementById('red');
// var blue = document.getElementById('blue');
// var green = document.getElementById('green');
// var hex = document.getElementById('hex'); 

// function ColorPicker() {
//   this.addDefaultSwatches();
//   createShadeSpectrum();
//   createHueSpectrum();
// }
  
// ColorPicker.prototype.defaultSwatches = [
//   '#000000', 
//   '#595959', 
//   '#BFBFBF', 
//   '#f5f5f5', 
//   '#F5242D', 
//   '#FA541C', 
//   '#FA8C17',
//   '#FADB13',
//   '#52C41A',
//   '#13C2C2',
//   '#1790FF',
//   '#2F54EB',
//   '#722ED1',
//   '#EB2F96',
//   '#2A86C5',
//   '#2E5089'
// ];
  
// /**
//  * @param target
//  * @param color
//  */
// // 创建默认色板 或用户选择色板
// function createSwatch(target, _color) {
//   var swatch = document.createElement('button');

//   swatch.className = 'swatch';
//   swatch.style.backgroundColor = _color;

//   swatch.addEventListener('click', function () {
//     var color = tinycolor(this.style.backgroundColor);     
//     colorToPos(color);
//     setColorValues(color);
//   });

//   target.appendChild(swatch);
//   refreshElementRects();
// }
  
// // 添加默认色板
// ColorPicker.prototype.addDefaultSwatches = function () {
//   const swatches = document.getElementsByClassName('default-swatches')[0];

//   this.defaultSwatches.forEach(item => {
//     createSwatch(swatches, item);
//   })
// };
  
// /**
//  * 刷新canvas rect
//  */
// function refreshElementRects() {
//   spectrumRect = spectrumCanvas.getBoundingClientRect();
//   hueRect = hueCanvas.getBoundingClientRect();
// }
  
// function createShadeSpectrum(color) {
//   canvas = spectrumCanvas;
//   ctx = spectrumCtx;
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//   if (!color) color = '#f00';
//   ctx.fillStyle = color;
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
  
//   const whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
//   whiteGradient.addColorStop(0, '#fff');
//   whiteGradient.addColorStop(1, 'transparent');

//   ctx.fillStyle = whiteGradient;
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
  
//   const blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
//   blackGradient.addColorStop(0, 'transparent');
//   blackGradient.addColorStop(1, '#000');

//   ctx.fillStyle = blackGradient;
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
  
//   canvas.addEventListener('mousedown', function (e) {
//     startGetSpectrumColor(e);
//   });
// }

// function createHueSpectrum() {
//   var canvas = hueCanvas;
//   var ctx = hueCtx;
//   var hueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  
//   hueGradient.addColorStop(0.00, 'hsl(0,100%,50%)');
//   hueGradient.addColorStop(0.17, 'hsl(298.8, 100%, 50%)');
//   hueGradient.addColorStop(0.33, 'hsl(241.2, 100%, 50%)');
//   hueGradient.addColorStop(0.50, 'hsl(180, 100%, 50%)');
//   hueGradient.addColorStop(0.67, 'hsl(118.8, 100%, 50%)');
//   hueGradient.addColorStop(0.83, 'hsl(61.2,100%,50%)');
//   hueGradient.addColorStop(1.00, 'hsl(360,100%,50%)');
//   ctx.fillStyle = hueGradient;
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   canvas.addEventListener('mousedown', function (e) {
//     startGetHueColor(e);
//   });
// }
  
// /**
//  * @param color
//  */
// function colorToHue(color) {
//   var color = tinycolor(color);
//   var hueString = tinycolor('hsl ' + color.toHsl().h + ' 1 .5').toHslString();
//   return hueString;
// }
  
// /**
//  * @param color
//  */
// function colorToPos(color) {
//   var color = tinycolor(color);
//   var hsl = color.toHsl();
//   hue = hsl.h;
//   var hsv = color.toHsv();
//   var x = spectrumRect.width * hsv.s;
//   var y = spectrumRect.height * (1 - hsv.v);
//   var hueY = hueRect.height - ((hue / 360) * hueRect.height);
//   updateSpectrumCursor(x, y);
//   updateHueCursor(hueY);
//   setCurrentColor(color);
//   createShadeSpectrum(colorToHue(color));   
// }
  
// /**
//  * @param color
//  */
// function setColorValues(color) {  
//   var color = tinycolor(color);
//   var hexValue = color.toHex();

//   hex.value = hexValue;
// }
  
// /**
//  * @param color
//  */
// function setCurrentColor(color) {
//   color = tinycolor(color);
//   currentColor = color;
//   spectrumCursor.style.backgroundColor = color; 
//   hueCursor.style.backgroundColor = 'hsl(' + color.toHsl().h + ', 100%, 50%)';
// }
  
// /**
//  * @param y
//  */
// function updateHueCursor(y) {
//   hueCursor.style.top = y + 'px';
// }
  
// /**
//  * @param x
//  * @param y
//  */
// function updateSpectrumCursor(x, y) {
//   // assign position
//   spectrumCursor.style.left = x + 'px';
//   spectrumCursor.style.top = y + 'px';  
// }
  
// var startGetSpectrumColor = function (e) {
//   getSpectrumColor(e);
//   spectrumCursor.classList.add('dragging');
//   window.addEventListener('mousemove', getSpectrumColor);
//   window.addEventListener('mouseup', endGetSpectrumColor);
// };
  
// /**
//  * @param e
//  */
// function getSpectrumColor(e) {
//   // got some help here - http://stackoverflow.com/questions/23520909/get-hsl-value-given-x-y-and-hue
//   e.preventDefault();
//   // get x/y coordinates
//   var x = e.pageX - spectrumRect.left;
//   var y = e.pageY - spectrumRect.top;
//   // constrain x max
//   if (x > spectrumRect.width) { x = spectrumRect.width; }
//   if (x < 0) { x = 0; }
//   if (y > spectrumRect.height) { y = spectrumRect.height; }
//   if (y < 0) { y = 0.1; }  
//   // convert between hsv and hsl
//   var xRatio = x / spectrumRect.width * 100;
//   var yRatio = y / spectrumRect.height * 100; 
//   var hsvValue = 1 - (yRatio / 100);
//   var hsvSaturation = xRatio / 100;
//   lightness = (hsvValue / 2) * (2 - hsvSaturation);
//   saturation = (hsvValue * hsvSaturation) / (1 - Math.abs(2 * lightness - 1));
//   var color = tinycolor('hsl ' + hue + ' ' + saturation + ' ' + lightness);
//   setCurrentColor(color);  
//   setColorValues(color);
//   updateSpectrumCursor(x, y);
// }
  
// /**
//  * @param e
//  */
// function endGetSpectrumColor(e) {
//   spectrumCursor.classList.remove('dragging');
//   window.removeEventListener('mousemove', getSpectrumColor);
// }
  
// /**
//  * @param e
//  */
// function startGetHueColor(e) {
//   getHueColor(e);
//   hueCursor.classList.add('dragging');
//   window.addEventListener('mousemove', getHueColor);
//   window.addEventListener('mouseup', endGetHueColor);
// }
  
// function getHueColor(e) {
//   e.preventDefault();
//   var y = e.pageY - hueRect.top;

//   if (y > hueRect.height) { 
//     y = hueRect.height; 
//   }

//   if (y < 0) { 
//     y = 0; 
//   }  

//   var percent = y / hueRect.height;

//   hue = 360 - (360 * percent);

//   var hueColor = tinycolor('hsl ' + hue + ' 1 .5').toHslString();
//   var color = tinycolor('hsl ' + hue + ' ' + saturation + ' ' + lightness).toHslString();

//   createShadeSpectrum(hueColor);
//   updateHueCursor(y, hueColor);
//   setCurrentColor(color);
//   setColorValues(color);
// }

// function endGetHueColor(e) {
//   hueCursor.classList.remove('dragging');
//   window.removeEventListener('mousemove', getHueColor);
// }
  
// hex.addEventListener('change', function () {
//   const value = this.value;
//   colorToPos(value);
// });
  
  
// window.addEventListener('resize', function () {
//   refreshElementRects();
// });
  
// new ColorPicker();
