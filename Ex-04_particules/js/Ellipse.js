export default class Ellipse {
  constructor(centerX, centerY, radiusX, radiusY) {
    this.center = { x: centerX, y: centerY };
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }

  resize(newRadiusX, newRadiusY) {
    this.radiusX = newRadiusX;
    this.radiusY = newRadiusY;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.ellipse(
      this.center.x,
      this.center.y,
      this.radiusX,
      this.radiusY,
      0,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.1;
    ctx.stroke();
  }

  isInside(x, y) {
    const dx = x - this.center.x;
    const dy = y - this.center.y;
    const distance =
      (dx * dx) / (this.radiusX * this.radiusX) +
      (dy * dy) / (this.radiusY * this.radiusY);
    return distance <= 1;
  }

  confine(particle) {
    const dx = particle.x - this.center.x;
    const dy = particle.y - this.center.y;

    const distance =
      (dx * dx) / (this.radiusX * this.radiusX) +
      (dy * dy) / (this.radiusY * this.radiusY);

    if (distance > 1) {
      const angle = Math.atan2(dy, dx);
      particle.x = this.center.x + Math.cos(angle) * this.radiusX * 0.99;
      particle.y = this.center.y + Math.sin(angle) * this.radiusY * 0.99;

      particle.vitesseX *= -0.5;
      particle.vitesseY *= -0.5;
    }
  }
}
