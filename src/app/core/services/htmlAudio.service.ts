import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { Player, PlayerStateEnum } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class HTMLAudioService {
  private stop$ = new Subject();
  private audio = new Audio(); //HTMLAudioElement

  // TODO: Ngrx Actions
  audioEvents = [
    'ended', 'error', 'play', 'playing', 'pause', 'timeupdate', 'canplay', 'loadstart'
  ];

  private state: Player = {
    data: {
      isPlaying: false,
      readableCurrentTime: '', //the current time of playing
      readableDuration: '', //durationg of the current audio
      duration: undefined, //duration of the current audio in milliseconds
      currentTime: undefined,
      canPlay: false,
      error: false,
    }
  };

  private stateChange: BehaviorSubject<Player> = new BehaviorSubject(this.state);

  private streamObservable(url) {
    return new Observable(observer => {
      // Play audio
      this.audio.src = url;
      this.audio.load();
      this.audio.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audio, this.audioEvents, handler);
      // TeardownLogic when stop$ emitted
      return () => {
        // Stop Playing
        this.audio.pause();
        this.audio.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audio, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }

  private addEvents(obj, events, handler) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(url) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.stop$.next();
  }

  seekTo(seconds) {
    this.audio.currentTime = seconds;
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }



  // Todo: Ngrx action,reducer
  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.state.data.duration = this.audio.duration;
        this.state.data.readableDuration = this.formatTime(this.state.data.duration);
        this.state.data.canPlay = true;
        break;
      case 'playing':
        this.state.data.isPlaying = true;
        break;
      case 'pause':
        this.state.data.isPlaying = false;
        break;
      case 'timeupdate':
        this.state.data.currentTime = this.audio.currentTime;
        this.state.data.readableCurrentTime = this.formatTime(this.state.data.currentTime);
        break;
      case 'error':
        this.resetState();
        this.state.data.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState() {
    this.state = {
      data: {
        isPlaying: false,
        readableCurrentTime: '',
        readableDuration: '',
        duration: undefined,
        currentTime: undefined,
        canPlay: false,
        error: false
      }

    };
  }

  // providing access to Subject outside the service can be dangerous. So you will use asObservable method of BehaviorSubject to only return Observable part
  getState(): Observable<Player> {
    return this.stateChange.asObservable();
  }
}
