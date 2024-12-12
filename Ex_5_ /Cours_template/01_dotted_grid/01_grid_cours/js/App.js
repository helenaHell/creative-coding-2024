import Letter from "./Letter.js";
import Webcam from "./Webcam.js";
import BaseApp from "./BaseApp.js";

export default class App extends BaseApp {
  constructor() {
    super();
    this.ctx.willReadFrequently = true; // Optimisation pour la lecture de pixels
    this.ctx.font = "17px monospace";
    this.letters = []; // on créer un tableau
    this.pixelColors = [];
    this.init();
  }

  loadImage(src) {
    return new Promise((resolve) => {
      // le promise permet de "bloquer" le code pour etre sûre que l'image va venir mais pas instantanément (elle viendra, mais peut etre 3ms plus tard)
      this.image = new Image();
      this.image.onload = resolve; // resolve (on le rapelle) pour dire que la promesse à été cocher
      this.image.src = src;
    });
  }

  initWebcam() {
    this.webcam = new Webcam(); //pour que le import le reconnaisse
  }

  async init() {
    this.initWebcam(); //pas besoin de await vu qu'il n'y pas de promesse
    // await this.loadImage("./portrait.jpg");// "await" pour attendre que la promesse a été faite !VA tjrs avec un ASYNC
    for (let i = 0; i < 130; i++) {
      for (let j = 0; j < 80; j++) {
        this.letters.push(new Letter(this.ctx, "B", i * 10, j * 10)); //on créer notre tableau
      }
    }
    this.draw();
  }

  draw() {
    this.ctx.drawImage(this.webcam.video, 0, 0, 1300, 800);
    const pixels = this.ctx.getImageData(0, 0, 1300, 800).data;

    // this.ctx.drawImage(this.image, 0, 0, 600, 800);
    // const pixels = this.ctx.getImageData(0, 0, 600, 800).data; //getImageData analyse la couleur de chaque pixel en RGBA et on lui donne la mesure qu'on veut qu'il crope ici on veut toute l'image ATTENTION de ne pas oublier le ".data"

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // On créer un rect noir pour cacher l'image

    this.letters.forEach((letter) => {
      const i = (letter.y * 1300 + letter.x) * 4; // FORMULE qui calcule les cordonnés et donnera une valeur RGBA (ici c'est le rouge, pour du vert on devra mettre i+1)
      //letter.color = `rgb(${pixels[i]} ${pixels[i + 1]}, ${pixels[i + 2]})`; //!!ON ajoute des dollar parce que STRINGS `` //on ajoute la couleur pour chaque lettrePixel
      //FORMULE pour caclculer luminosité de chaque pixel depuis son RBG et on le lie au scale
      // DONC + c clair + la lettre sera grande et + c foncé + c petit
      const luminance = this.getLuminance([
        pixels[i],
        pixels[i + 1],
        pixels[i + 2],
      ]);
      letter.scale = luminance;

      //CONDITION
      if (luminance > 0.99) {
        letter.color = "blue";
      }

      letter.draw();
    });

    requestAnimationFrame(this.draw.bind(this));
  }

  getLuminance(rgb) {
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }
}
