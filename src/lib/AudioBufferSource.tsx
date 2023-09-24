import * as Tone from "tone";

export default class AudioBufferSource {
  source = null;
  loaded = false;
  name = null;
  fr: FileReader | null = null;
  file: File | null;
  audioCtx: AudioContext | null = null;
  player: any | null = null;
  playing: boolean = false;
  previouslyElapsedTime: number = 0;
  timeOfStart: number = 0;
  constructor(name: null, file: File | null, audioCtx: AudioContext | null) {
    this.source = null;
    this.loaded = false;
    this.name = name;
    this.fr = new FileReader();
    this.file = file;
    this.audioCtx = audioCtx;
    this.player = null;
    this.playing = false;
    this.previouslyElapsedTime = 0;
    this.timeOfStart = 0;
  }

  togglePlay() {
    console.log(this.playing, this.previouslyElapsedTime, this.timeOfStart);
    if (this.playing) {
      let timeOfStop = this.player.now();
      this.player.stop(timeOfStop);
      this.playing = false;
      this.previouslyElapsedTime =
        timeOfStop - this.timeOfStart + this.previouslyElapsedTime;
    } else {
      this.timeOfStart = this.player.now();
      this.player.start(this.timeOfStart, this.previouslyElapsedTime);

      this.playing = true;
    }
  }

  seek(percent: number) {
    percent = Math.min(1, Math.max(percent, 0));
    let currentTime = this.player.now();
    let seekTime = percent * this.player.buffer.duration;
    const wasPlaying = this.playing;
    if (wasPlaying) {
      this.togglePlay();
    }

    this.previouslyElapsedTime = seekTime;
    this.player.seek(seekTime, currentTime);
    if (wasPlaying) {
      this.togglePlay();
    }
  }

  restart() {
    if (this.playing) {
      this.togglePlay();
    }
    this.timeOfStart = 0;
    this.previouslyElapsedTime = 0;
  }

  currentTime() {
    if (this.playing) {
      return (
        this.previouslyElapsedTime + (this.player.now() - this.timeOfStart)
      );
    } else {
      return this.previouslyElapsedTime;
    }
  }

  load() {
    return new Promise((resolve, reject) => {
      this.fr.onloadend = e => {
        try {
          this.audioCtx.decodeAudioData(e.target.result, audioBuffer => {
            this.player = new Tone.Player(audioBuffer);
            this.player.connect(this.audioCtx.destination);
            resolve();
          });
        } catch (error) {
          console.log(error);
          reject();
        }
      };
      this.fr.readAsArrayBuffer(this.file);
    });
  }

  summarize() {
    let channelOne = this.player.buffer.getChannelData(0);
    let stepSize = this.player.buffer.sampleRate * 0.04;

    let ndx = 0;
    //TODO: get rid of intermediary arrays and just draw to the canvas in the while loop.
    // also
    let minArray = [];
    let maxArray = [];
    let rmsArray = [];

    while (ndx < channelOne.length) {
      let next = Math.min(ndx + stepSize, channelOne.length);
      maxArray.push(Math.max(...channelOne.slice(ndx, next)));
      minArray.push(Math.min(...channelOne.slice(ndx, next)));
      rmsArray.push(
        Math.sqrt(
          channelOne.slice(ndx, next).reduce((acum, val) => acum + val * val) /
            (next - ndx)
        )
      );
      ndx = next;
    }

    let offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = Math.round(channelOne.length / stepSize);
    offscreenCanvas.height = 512;
    let offscreenCtx = offscreenCanvas.getContext("2d");
    offscreenCtx.fillStyle = "#2b2f38";
    offscreenCtx.rect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.fill();
    for (let x = 0; x < minArray.length; x++) {
      let min = minArray[x];
      let max = maxArray[x];
      let rms = rmsArray[x];
      offscreenCtx.beginPath();
      offscreenCtx.strokeStyle = "#41B883";
      offscreenCtx.moveTo(x, Math.round(256 + min * 256));
      offscreenCtx.lineTo(x, Math.round(256 + max * 256));
      offscreenCtx.moveTo(x, Math.round(256 + min * 256));
      offscreenCtx.lineTo(x, Math.round(256 + max * 256));
      offscreenCtx.stroke();
      offscreenCtx.beginPath();
      offscreenCtx.strokeStyle = "#000000";
      offscreenCtx.moveTo(x, Math.round(256 - rms * 0.5 * 256));
      offscreenCtx.lineTo(x, Math.round(256 + rms * 0.5 * 256));
      offscreenCtx.stroke();
    }
    return offscreenCtx;
  }
}