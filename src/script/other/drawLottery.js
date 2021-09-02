let drawLottery = {
  init(canvas, options, data) {
    const { 
      size, 
      bgImg, 
      coverImg, 
      activeImg, 
      pointerImg,
      ratio,
      start = 0 
    } = options;

    const ctx = canvas.getContext('2d');

    this.addImageProcess([bgImg, coverImg, activeImg, pointerImg]).then(arr => {
      this.opt = {
        size,
        half: size / 2,
        bgImg: arr[0],
        coverImg: arr[1],
        activeImg: arr[2],
        pointerImg: arr[3],
        parts: data.length,
        start
      };
  
      this.resetCanvasSize(canvas, ctx, size, ratio);
      this.ctx = ctx;
      this.draw(data);
    });
  },

  resetCanvasSize(canvas, ctx, size, ratio) {
    // eslint-disable-next-line no-param-reassign
    canvas.height = size * ratio;
    // eslint-disable-next-line no-param-reassign
    canvas.width = size * ratio;

    ctx.scale(ratio, ratio);
  },

  addImageProcess(src) {
    return new Promise((resolve) => {
      let ok = 0;
      let imgs = [];

      if (Array.isArray(src)) {
        src.forEach((item, index) => {
          let img = new Image();
          img.src = item;
          img.onload = () => {
            ok += 1;
            imgs[index] = img;
            if (ok === src.length) {
              resolve(imgs);
            }
          };
        });
      }
    });
  },

  draw(data, active) {
    const { size, bgImg } = this.opt;
    const { ctx } = this;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(bgImg, 0, 0, size, size);

    data.forEach((item, index) => {
      this.drawItem(ctx, item, index, active);
    });
  },

  drawItem(ctx, item, i, active = -1) {
    const { half, parts, activeImg, coverImg, start } = this.opt;
    ctx.save();
    ctx.translate(half, half);
    ctx.rotate((((i + 1 + start) * (360 / parts)) - (360 / parts / 2)) * (Math.PI / 180));
    ctx.translate(-half, -half);

    if (i === active) {
      ctx.drawImage(activeImg, half - (276 / 2), 0, 276, 276);
    }

    ctx.drawImage(coverImg, half - 64, 60, 127, 113);

    ctx.font = '500 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff433d';
    ctx.fillText(item.title, half, 45);

    ctx.font = '500 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff433d';
    ctx.fillText(item.num, half, 106);

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffe7c9';
    ctx.fillText(item.desc, half, 143);

    ctx.restore();
  }
};

export default drawLottery;
