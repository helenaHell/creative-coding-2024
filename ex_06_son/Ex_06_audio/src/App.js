import BaseApp from "./BaseApp";

export default class App extends BaseApp {
  constructor() {
    super();
    this.audioFile = "./sound.wav";
    this.audio = new Audio(this.audioFile);
    this.audio.controls = true;
    document.body.appendChild(this.audio);
    this.isPlaying = false;
    this.particles = [];
    this.blink = 100;
    this.init();
  }

  init() {
    document.addEventListener("click", (e) => {
      if (!this.audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.setup();
      }

      const mouseX = e.clientX;
      const progress = mouseX / window.innerWidth;
      this.audio.currentTime = this.audio.duration * progress;

      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play();
        this.isPlaying = true;
      }
    });

    window.addEventListener("resize", this.resizeCanvas.bind(this));
  }

  setup() {
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.analyser = this.audioContext.createAnalyser();
    this.destination = this.audioContext.destination;
    this.source.connect(this.analyser);
    this.analyser.connect(this.destination);
    this.analyser.fftSize = 2048;

    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.waveArray = new Uint8Array(this.analyser.fftSize);

    this.draw();
  }

  analyseFrequencies() {
    this.analyser.getByteFrequencyData(this.dataArray);
  }

  analyseWaveform() {
    this.analyser.getByteTimeDomainData(this.waveArray);
  }

  drawBackground() {
    const gradient = this.ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      0,
      this.width / 2,
      this.height / 2,
      this.width / 2
    );
    gradient.addColorStop(0, "rgba(20, 20, 50)");
    gradient.addColorStop(1, "rgba(0, 0, 0)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawFrequencies() {
    const radius = Math.min(this.width, this.height) / 4;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);

    for (let i = 0; i < this.dataArray.length; i++) {
      const angle = (i / this.dataArray.length) * Math.PI * 2;
      const barHeight = this.dataArray[i] * 1;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const gradient = this.ctx.createLinearGradient(x, y, x + barHeight, y);
      gradient.addColorStop(0, "rgb(255, 0, 0)");
      gradient.addColorStop(1, "rgb(93, 0, 255)");

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x * (1 + barHeight / 400), y * (1 + barHeight / 400));
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  drawWaveform() {
    const waveSpace = this.width / this.waveArray.length;

    for (let i = 0; i < this.waveArray.length; i++) {
      const x = i * waveSpace;
      const y = (this.waveArray[i] / 128) * (this.height / 2);
      this.ctx.beginPath();
      this.ctx.arc(x, this.height / 2 - y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255,0, ${200 - y}, 0.1)`;
      this.ctx.fill();
    }
  }

  getAverageWaveformPower() {
    let totalPower = 0;
    for (let i = 0; i < this.waveArray.length; i++) {
      totalPower += Math.abs(this.waveArray[i] - 30);
    }
    return totalPower / this.waveArray.length;
  }

  drawParticles() {
    const averagePower = this.getAverageWaveformPower();

    if (averagePower > this.blink) {
      this.particles = this.particles.filter((p) => p.alpha > 0);

      while (this.particles.length < 100) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 5,
          velocity: {
            x: (Math.random() - 0.5) / 2,
            y: (Math.random() - 0.5) / 2,
          },
          alpha: 1,
        });
      }

      this.particles.forEach((particle) => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.alpha -= 0.02;

        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
        this.ctx.fill();
      });
    }
  }

  draw() {
    this.analyseFrequencies();
    this.analyseWaveform();

    this.drawBackground();
    this.drawFrequencies();
    this.drawWaveform();
    this.drawParticles();

    requestAnimationFrame(this.draw.bind(this));
  }
}
