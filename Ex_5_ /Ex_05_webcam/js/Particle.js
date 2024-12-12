export default class Particle {
  constructor(ctx, letter, x, y) {
    this.ctx = ctx;
    this.letter = letter;
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.vx = 0;
    this.vy = 0;
    this.color = "white";
    this.scale = 1;
  }

  updatePosition(mouseIsClicked) {
    // Friction applied during movement
    this.vx *= 0.75;
    this.vy *= 0.75;
    this.x += this.vx;
    this.y += this.vy;

    if (!mouseIsClicked) {
      const dx = this.initialX - this.x;
      const dy = this.initialY - this.y;
      this.vx += dx * 0.03;
      this.vy += dy * 0.03;
    }
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.fillStyle = this.color;
    this.ctx.font = `${this.scale * 10}px monospace`;
    this.ctx.fillText(this.letter, 0, 0);
    this.ctx.restore();
  }
}
