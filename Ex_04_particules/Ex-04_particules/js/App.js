import BaseApp from "./BaseApp";
import Particle from "./Particle";
import Ellipse from "./Ellipse";

export default class App extends BaseApp {
  constructor() {
    super();
    this.letter = [];
    this.backgroundParticles = [];
    this.mouseIsDown = false;
    this.ellipse = new Ellipse(
      this.canvas.width / 2,
      this.canvas.height / 2,
      200,
      100
    );

    this.init();
  }

  init() {
    const numberOfBackgroundParticles = 100;
    for (let i = 0; i < numberOfBackgroundParticles; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const particle = new Particle(x, y);
      this.backgroundParticles.push(particle);
    }

    document.addEventListener("mousedown", (e) => {
      this.mouseIsDown = true;
    });
    document.addEventListener("mouseup", (e) => {
      this.mouseIsDown = false;
    });
    document.addEventListener("mousemove", (e) => {
      if (this.mouseIsDown) {
        const deltaX = e.movementX;
        const deltaY = e.movementY;

        let newRadiusX = this.ellipse.radiusX + deltaX;
        let newRadiusY = this.ellipse.radiusY + deltaY;

        newRadiusX = Math.max(50, Math.min(newRadiusX, 300));
        newRadiusY = Math.max(50, Math.min(newRadiusY, 300));

        this.ellipse.resize(newRadiusX, newRadiusY);
      }

      for (let i = 0; i < 1; i++) {
        const particle = new Particle(e.x, e.y);
        this.letter.push(particle);
      }
    });

    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ellipse.draw(this.ctx);

    // particules du fond
    this.backgroundParticles.forEach((particle) => {
      particle.update();
      particle.gererBordsEcran();
      particle.draw(this.ctx);
      this.ctx.strokeStyle = "rgba(0, 255, 255, 0.3)";
      this.ctx.lineWidth = 1;
    });

    // particules dessinées
    this.letter = this.letter.filter((particle) => particle.opacity > 0);
    this.letter.forEach((particle) => {
      particle.update();
      this.ellipse.confine(particle);
      particle.gererBordsEcran();
      particle.draw(this.ctx);
      this.ctx.strokeStyle = "rgba(255, 0, 50, 0.4)";
      this.ctx.lineWidth = 0.5;
    });

    this.connectParticles([...this.backgroundParticles, ...this.letter]);

    requestAnimationFrame(() => this.draw());
  }

  connectParticles(particles) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particles[i].x, particles[i].y);
          this.ctx.lineTo(particles[j].x, particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}
