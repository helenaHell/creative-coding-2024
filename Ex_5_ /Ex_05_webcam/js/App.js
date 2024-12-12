import Webcam from "./Webcam.js";
import BaseApp from "./BaseApp.js";
import Particle from "./Particle.js";

export default class App extends BaseApp {
  constructor() {
    super();
    this.ctx.willReadFrequently = true; // Optimisation pour la lecture de pixels
    this.ctx.font = "17px monospace";
    this.particles = [];
    this.pixelColors = [];
    this.mouse = { x: 0, y: 0, isClicked: false };

    this.init();

    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }
  handleMouseDown(e) {
    this.mouse.isClicked = true;
    this.mouse.x = e.offsetX;
    this.mouse.y = e.offsetY;
  }

  handleMouseUp() {
    this.mouse.isClicked = false;
  }

  handleMouseMove(e) {
    if (this.mouse.isClicked) {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    }
  }

  initWebcam() {
    this.webcam = new Webcam();
  }

  async init() {
    this.initWebcam();
    for (let i = 0; i < 150; i++) {
      for (let j = 0; j < 80; j++) {
        this.particles.push(new Particle(this.ctx, "&", i * 10, j * 10));
      }
    }
    this.draw();
  }

  draw() {
    this.ctx.drawImage(this.webcam.video, 0, 0, 1500, 800);
    const pixels = this.ctx.getImageData(0, 0, 1500, 800).data;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((particle) => {
      const gridX = Math.round(particle.initialX);
      const gridY = Math.round(particle.initialY);
      const i = (gridY * 1500 + gridX) * 4;
      const luminance = this.getLuminance([
        pixels[i],
        pixels[i + 1],
        pixels[i + 2],
      ]);
      // particle.scale = luminance;
      particle.scale = Math.max(0.3, luminance);

      // CONDITON;
      // if (luminance > 0.9 && !particle.hasColor) {
      //   particle.color = this.getRandomColor();
      //   particle.hasColor = true;
      // }

      particle.color = "white";

      if (this.mouse.isClicked) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, 100 - distance) / 100;
        particle.vx += force * dx * 0.5;
        particle.vy += force * dy * 0.5;
      }

      particle.updatePosition(this.mouse.isClicked);
      particle.draw();
    });

    requestAnimationFrame(this.draw.bind(this));
  }

  getLuminance(rgb) {
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }
}
