import BaseApp from "./BaseApp.js";
import Utils from "./Utils.js";
import Easing from "./Easing.js";

export default class App extends BaseApp {
  constructor() {
    super();

    this.svgData = {
      noWord: {
        svg: null,
        time: 0,
        amplitude: 20,
        frequency: 0.15,
        scale: 1,
        isScalingDown: false,
        transition: 1,
        strokeStyle: "red",
        lineWidth: 3,
        centerX: 0,
        centerY: 0,
        positionOffsetX: -350,
        bounds: null,
      },
      yesWord: {
        svg: null,
        time: 0,
        amplitude: 20,
        frequency: 0.02,
        scale: 1,
        isScalingDown: false,
        transition: 1,
        strokeStyle: "turquoise",
        lineWidth: 3,
        centerX: 0,
        centerY: 0,
        positionOffsetX: 350,
        bounds: null,
      },
    };

    Promise.all([Utils.loadSVG("no.svg"), Utils.loadSVG("yes.svg")]).then(
      ([noWordSVG, yesWordSVG]) => {
        this.svgData.noWord.svg = noWordSVG;
        this.svgData.yesWord.svg = yesWordSVG;

        this.calculateCenter(this.svgData.noWord);
        this.calculateCenter(this.svgData.yesWord);
        this.calculateBounds(this.svgData.noWord);
        this.calculateBounds(this.svgData.yesWord);

        this.canvas.addEventListener("mousedown", (event) =>
          this.handleMouseDown(event)
        );
        this.canvas.addEventListener("mouseup", (event) =>
          this.handleMouseUp(event)
        );

        this.animate();
      }
    );
  }

  calculateCenter(data) {
    const bounds = Utils.calculateBounds(data.svg);
    data.centerX =
      this.width / 2 - (bounds.minX + bounds.width / 2) + data.positionOffsetX;
    data.centerY = this.height / 2 - (bounds.minY + bounds.height / 2);
  }

  calculateBounds(data) {
    const bounds = Utils.calculateBounds(data.svg);
    data.bounds = {
      minX: data.centerX + bounds.minX,
      minY: data.centerY + bounds.minY,
      maxX: data.centerX + bounds.minX + bounds.width,
      maxY: data.centerY + bounds.minY + bounds.height,
    };
  }

  handleMouseDown(event) {
    const { offsetX, offsetY } = event;

    if (this.isWithinBounds(offsetX, offsetY, this.svgData.noWord.bounds)) {
      this.svgData.noWord.isScalingDown = true;
    }

    if (this.isWithinBounds(offsetX, offsetY, this.svgData.yesWord.bounds)) {
      this.svgData.yesWord.isScalingDown = true;
    }
  }

  handleMouseUp(event) {
    const { offsetX, offsetY } = event;

    if (this.isWithinBounds(offsetX, offsetY, this.svgData.noWord.bounds)) {
      this.svgData.noWord.isScalingDown = false;
    }

    if (this.isWithinBounds(offsetX, offsetY, this.svgData.yesWord.bounds)) {
      this.svgData.yesWord.isScalingDown = false;
    }
  }

  isWithinBounds(x, y, bounds) {
    return (
      x >= bounds.minX &&
      x <= bounds.maxX &&
      y >= bounds.minY &&
      y <= bounds.maxY
    );
  }

  animate() {
    this.ctx.fillStyle = "rgba(0,0,0,0.01)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    Object.values(this.svgData).forEach((data) => {
      if (data.svg) {
        data.time += 0.085;
        data.scale += data.isScalingDown ? -0.2 : 0.02;
        data.scale = Math.max(0.6, Math.min(1, data.scale));

        // if (data.timing < 1) {
        //   data.timing += data.speed;
        //   if (data.timing > 1) data.timing = 1;
        // }
        // if (data.isScalingDown) {
        //   data.scale = 1 - Easing.backOut(data.timing) * 0.5;
        // } else {
        //   data.scale = 0.5 + Easing.backOut(data.timing) * 0.5;
        // }

        //////
        //   this.x =
        //   this.originx +
        //   (this.targetx - this.originx) * Easing.backOut(this.timing);
        // this.y =
        //   this.originy +
        //   (this.targety - this.originy) * Easing.backOut(this.timing);

        this.ctx.save();
        this.ctx.translate(data.centerX, data.centerY);
        this.ctx.scale(data.scale, data.scale);
        this.ctx.strokeStyle = data.strokeStyle;
        this.ctx.lineWidth = data.lineWidth;

        this.ctx.beginPath();
        data.svg.forEach((path) => this.drawPath(path, data));
        this.ctx.stroke();
        this.ctx.restore();
      }
    });

    requestAnimationFrame(this.animate.bind(this));
  }

  drawPath(path, data) {
    path.forEach((point, i) => {
      const { x, y } = this.getOffsetPoint(point, i, data);
      this.ctx[i ? "lineTo" : "moveTo"](x, y);
    });
  }

  getOffsetPoint(point, i, data) {
    const angle = data.time + i * data.frequency;
    const easing = Easing.expoInOut(data.transition);
    const offset = Math.sin(angle) * data.amplitude * easing;
    return {
      x: point.x + offset,
      y: point.y + offset * 0.8 * Math.cos(angle + Math.PI / 2),
    };
  }
}
