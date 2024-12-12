import Letter from "./Letter.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    this.createCanvas();
    this.letter = new Letter(this.width / 2, this.height / 2, 100);
    this.initInteraction();
    this.draw();
  }
  createCanvas(width = window.innerWidth, height = window.innerHeight) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.backgroundColor = "black";
    document.body.appendChild(this.canvas);
  }

  initInteraction() {
    document.addEventListener("click", (e) => {
      this.letter.reset(e.x, e.y);
    });
  }
  // initInteraction() {
  //   this.canvas.addEventListener("mousemove", (e) => {
  //     const mouseX = e.clientX;
  //     const mouseY = e.clientY;
  //   });
  // }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.letter.update();
    this.letter.dessine(this.ctx);
    requestAnimationFrame(this.draw.bind(this));
  }
}
