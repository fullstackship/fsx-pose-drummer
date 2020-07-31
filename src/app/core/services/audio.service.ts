import { Injectable } from '@angular/core';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AudioService {

  private audio: HTMLAudioElement;

  constructor() {


  }

  getAudio(): HTMLAudioElement {
    return this.audio;
  }

  setAudio(src: string): void {
    // TODO: Audio issue when changing src

    if (this.audio) {
      this.audio.pause();
    }
    this.audio = new Audio();
    this.audio.src = src;
    this.audio.load();
    this.playAudio();
  }

  playAudio(): void {
    this.audio.play();
  }

  pauseAudio(): void {
    this.audio.pause();
  }

  seekAudio(position: number): void {
    this.audio.currentTime = position;
  }

}
