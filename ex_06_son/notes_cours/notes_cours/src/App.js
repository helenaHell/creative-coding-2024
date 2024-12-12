import BaseApp from "./BaseApp.js";
export default class App extends BaseApp {
  constructor() {
    super();
    //fichier audio a charger
    this.audioFile = "./sound.mp3";
    //creation de l'élément audio HTML
    this.audio = new Audio(this.audioFile);
    this.audio.controls = true;
    document.body.appendChild(this.audio); //methode html de montrer audio file
    this.isPlaying = false;
    this.init();
  }

  init() {
    document.addEventListener("click", (e) => {
    //   if (!this.audioContext) {
    //   const AudioContext = window.AudioContext || windoww.webkitAudioContext;
    // this.audio} --> a completer 
      const position_souris_x = e.clientX;
      //% par rapport à la largeur de la fenêtre
      const pourcentage = position_souris_x / window.innerWidth;
      //mettre a jour position de lecture
      this.audio.currentTime = this.audio.duration * pourcentage;
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play();
        this.isPlaying = true;
      }
    });

    //on recupère le contexte audio
    this.audioContext = new AudioContext();
    //createMedia... nous créer une boite pour notre audio
    this.source = this.audioContext.createMediaElementSource(this.audio);

    //on créer un noeud d'analyse
    this.analyser = this.audioContext.createAnalyser();
    //creer un noeud de destination
    this.destination = this.audioContext.destination;
    //on connect le noeud source à l'analyseur
    this.source.connect(this.analyser);
    //on definie la taille du buffer, pour donner une limite de "memoire" pour pas cracher
    this.analyser.fftSize = 2048;
    //creer tableau de donnes pour analyse de frequences (en Byte)
    this.dataAray = new Uint8Array(this.analyser.fftSize);
    // creer tableau de données pour l'analéyse de waveform (en Byte)
    this.waveArray = new Uint8Array(this.analyser.fftSize);
    this.draw();
  

  //on cree une methode  pour analyser les données de frequences
  analyserFrequencies() {
    this.analyser.getByteFrequencyData(this.dataArray);
  }

  //creer une methode pour analyser les donnes de waveform
  analyserWaveform() {
    this.analyser.getBytetimeDomainData(this.dataArray);
  }

  draw() {
    this.analyserFrequencies();
    this.analyserWaveform();

    this.ctx.clearRect(0, 0, this, width, this.height);

    const barWidth = this.width / (this.dataArray.length / 2);
    let x = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const barHeight = this.dataArray[i] * 3;
      this.ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      this.ctx.fillRect(x, this.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}
