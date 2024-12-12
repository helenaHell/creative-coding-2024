import Easing from "./Easing";

export default class Letter {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.targetx = x;
    this.targety = y;
    this.originx = x;
    this.originy = y;
    this.radius = radius;
    this.originRadius = radius;
    this.targetRadius = radius;

    const characters = "ACDEFGHIKMNOQTUVWXYZ%&|#£•*";
    this.character = characters[Math.floor(Math.random() * characters.length)];
    this.speed = 0.01;

    this.timing = 0;
  }

  dessine(ctx) {
    ctx.fillStyle = "white";
    ctx.font = `${this.radius * 2}px Sherif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(this.character, this.x, this.y);

    ctx.fillStyle = "white";
    ctx.font = `${this.radius * 2}px Sherif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.character, this.x, this.y);

    ctx.fillStyle = "white";
    ctx.font = `${this.radius * 2}px Sherif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(this.character, this.x, this.y);
  }

  pointQuiAvanceEtQuiStop(t) {
    return Math.min(t, 1);
  }

  update() {
    if (this.timing < 1) {
      this.timing += this.speed;
      if (this.timing > 1) this.timing = 1;

      this.x =
        this.originx +
        (this.targetx - this.originx) * Easing.backOut(this.timing);
      this.y =
        this.originy +
        (this.targety - this.originy) * Easing.backOut(this.timing);

      this.radius =
        this.originRadius +
        (this.targetRadius - this.originRadius) *
          Easing.elasticOut(this.timing);
    }
  }

  reset(x, y) {
    this.targetx = x;
    this.targety = y;
    this.originx = this.x;
    this.originy = this.y;

    this.targetRadius = Math.random() * 300 + 40;
    this.originRadius = this.radius;
    this.timing = 0;
  }
}
