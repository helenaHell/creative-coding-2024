export default class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.opacity = 1;

    //Ajouter vitesse (une vitesse c'est une acrémentation) -> on met tout a 0 au debut
    this.vitesseX = 0;
    this.vitesseY = 0;

    this.vitesseMax = Math.random() * 4 + 1;

    //accélération de la particule (donc acrémentaiton)
    this.accelerationX = (Math.random() - 0.5) * 0.01;
    //Math.random -> chiffre random entre 0 et 1 puisque tjrs positif il partira tjrs vers le côté droite et bas de l'écran
    //mais avant le avec le -0.5 si le chiffe random entre 0 et 4,99 sera négatif donc partira côté gauche et haut de l'écran
    this.accelerationY = (Math.random() - 0.5) * 0.01;
  }

  // Mettre à jour la position et la vitesse de la particule
  update() {
    this.vitesseX += this.accelerationX; //
    this.vitesseY += this.accelerationY;

    this.x += this.vitesseX; // position suit la vitesse
    this.y += this.vitesseY;

    this.angle = Math.atan2(this.vitesseY, this.vitesseX); //caclucle l'angle de rotation ATAN = arc tangeante

    this.opacity -= 0.003;
    if (this.opacity < 0) this.opacity = 0;
  }

  // Limiter la vitesse de la particule
  limiterVitesse() {
    // cette manière = juste mains ne fonctionne pas pour des valeur négative
    // this.vitesseX = Math.min(this.vitesseX, this.vitesseMax);
    // this.vitesseY = Math.min(this.vitesseY, this.vitesseMax);
    //MaTHMIN -> il prend le chiffre minimale entre deux valeurs.
    //ex. il prendra par exemple vitesse 5 comparé à 20 et quand le 5 atteindra 20 il restera a 20

    this.vitesseX = Math.min(
      Math.max(this.vitesseX, -this.vitesseMax),
      this.vitesseMax
    );
    this.vitesseY = Math.min(
      Math.max(this.vitesseY, -this.vitesseMax),
      this.vitesseMax
    );
  }

  // Faire réapparaître la particule de l'autre côté si elle sort de l'écran
  gererBordsEcran() {
    if (this.x > window.innerWidth) this.x = 0;
    if (this.x < 0) this.x = window.innerWidth;
    if (this.y > window.innerHeight) this.y = 0;
    if (this.y < 0) this.y = window.innerHeight;
  }

  // Dessiner la particule
  draw(ctx) {
    ctx.save(); //
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    ctx.globalAlpha = this.opacity;

    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();

    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; // avec lgn 42+43 on peut centrer l'objet
    ctx.fillText("V", 0, 0); // avec cette methode, le point d'origine et en bas à gauche de l'objet et pas au centre
    // solution : soit on change origine indépendemment soit toute la logique draw
    ctx.globalAlpha = 1;
    ctx.restore(); //

    // Avec le save, translate, le (0,0) et restore on resout rien, tjrs pas centrer mais parfois bien de l'ecrire.
    // le save restore permet de sauvergarder le reste et ce qu'on ecris entre est propre a ces lignes là
  }
}
