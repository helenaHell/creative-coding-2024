import BaseApp from "./BaseApp";
import Particle from "./Particle";

export default class App extends BaseApp {
  // extends pour dire que le base app (donc créer le canvas se fait autmatiquement)
  constructor() {
    super(); // supérieur pour dire que le "this" se mélange a tout ?
    this.letter = [];
    // for (let i = 0; i < 400; i++) {
    //   const particule = new Particle(this.width / 2, this.height / 2);
    //   this.letter.push(particule); // on push(mettre) la particule dans tableau au lieu de l'écrie 10x "new particule" dans tableau
    // }

    document.addEventListener("mousemove", (e) => {
      // avec eventlistener on accède à plein d'information sur la souris et autre dont le x et y
      for (let i = 0; i < 3; i++) {
        const particule = new Particle(e.x, e.y);
        this.letter.push(particule);
      }
    });

    this.draw();
  }

  // draw() {
  //   // Clear canvas
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  //   // il faut updater la particule avant de la dessiner
  //   this.particule.update();
  //   this.particule.gererBordsEcran();
  //   this.particule.draw(this.ctx);
  //   // Continue animation
  //   requestAnimationFrame(() => this.draw());
  // }

  ////on change le draw mnt qu'il y a boucle for parce qu'il n'existe plus der this.particule
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.letter = this.letter.filter((particule) => particule.opacity > 0);

    // pour lire les element de notre tableau on les repère par position -> on prend la particule en position 3, puis 7 etc.
    // for (let i = 0; i < 400; i++) {
    //   const particule = this.letter[i]; // pas la bonne méthode
    this.letter.forEach((particule) => {
      // on écrit un forEach
      particule.update();
      particule.gererBordsEcran();
      // particule.(method) Particle
      particule.draw(this.ctx);
    });
    requestAnimationFrame(() => this.draw());
  }
}
