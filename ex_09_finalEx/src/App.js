import BaseApp from "./BaseApp";
import Particle from "./Particle";
import Svg from "./Svg";

export default class App extends BaseApp {
  constructor() {
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.audioFile = "./audio/track.mp3";
    this.particles = [];
    this.audio = new Audio(this.audioFile);
    this.isPlaying = false;

    this.svgDrawer = new Svg(this.width, this.height);
    this.svgDrawer.init("./number.svg");

    window.addEventListener("resize", this.handleResize.bind(this));
    this.init();
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.svgDrawer = new Svg(this.width, this.height);
    this.svgDrawer.init("./number.svg");
    this.setupAnalyser();
  }

  init() {
    document.addEventListener("click", (e) => {
      this.play(e);
    });

    document.addEventListener("keydown", async (e) => {
      if (this.isPlaying) {
        await this.audio.pause();
        if (this.audioContext) {
          await this.audioContext.suspend();
        }
        this.isPlaying = false;
      } else {
        if (this.audioContext && this.audioContext.state === "suspended") {
          await this.audioContext.resume();
        }
        await this.audio.play();
        this.isPlaying = true;
      }
    });
  }

  initAudioContext() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.setupAnalyser();
  }

  setupAnalyser() {
    this.analyser = this.audioContext.createAnalyser();
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.frequencyBinCount;

    this.dataFrequency = new Uint8Array(this.bufferLength);
    this.dataFloatFrequency = new Float32Array(this.bufferLength);
    this.dataWave = new Uint8Array(this.bufferLength);

    const particleCount = 800;
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      const hue = (i / particleCount) * 360;
      const color = `hsla(${hue}, 100%, 70%, 0.8)`;
      const x = (this.width / particleCount) * i;
      const y = this.height / 2;

      this.particles.push(new Particle(x, y, 2.5, color, this.width));
    }

    this.draw();
  }

  play(mouse) {
    if (!this.isPlaying) {
      if (!this.audioContext) {
        this.initAudioContext();
      }
      this.audio.play();
      this.isPlaying = true;
    } else {
      const timeToStart =
        (mouse.clientX / window.innerWidth) * this.audio.duration;
      this.audio.currentTime = timeToStart;
    }
  }

  updateAudioData() {
    this.analyser.getByteTimeDomainData(this.dataWave);
    this.analyser.getByteFrequencyData(this.dataFrequency);
    this.analyser.getFloatFrequencyData(this.dataFloatFrequency);
  }

  draw() {
    this.updateAudioData();

    const { ctx, width, height } = this;

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);

    this.svgDrawer.draw(ctx, this.dataFrequency);

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const dataIndex = Math.floor(
        (i / this.particles.length) * this.bufferLength
      );
      particle.update(this.dataWave, dataIndex, this.svgDrawer, this.particles);
      particle.draw(ctx);
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}
