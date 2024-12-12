import Circle from "./Circle.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
  }

  createCanvas(width, height) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
    this.createBackground();
    document.body.appendChild(this.canvas);
  }

  createBackground() {
    const gradient = this.ctx.createLinearGradient(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.9, "black");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerWidth);
  }

  createGrid() {
    const monCercle = new Circle(this.ctx);
    let stepX = 50;
    let stepY = 50;
    let baseRadius = 5;
    let spaceX = window.innerWidth / stepX;
    let spaceY = window.innerHeight / stepY;

    for (let i = 0; i < stepX; i++) {
      for (let j = 0; j < stepY; j++) {
        // Generate a random radius for each circle between 2 and 15
        let radius = baseRadius + Math.random() * 8;

        // Draw the circle with the random radius
        monCercle.draw(i * spaceX + radius, j * spaceY + radius, radius);
      }
    }
  }
}
