/**
 * @see https://developers.google.com/youtube/
 */
export enum PlayerStateEnum {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  LOADING = 4,
  CUED = 5,
  SEEKING = 6,
  STOPPED = 7
}


export interface Player {
  currentTrackId?: string;
  nextTrackId?: string;
  prevTrackId?: string;
  data: {
    volume?: number;
    isPlaying?: boolean;
    readableCurrentTime?: string;
    readableDuration?: string;
    duration?: number | undefined;
    currentTime?: number | undefined;
    canPlay?: boolean;
    error?: boolean;
    extra?: any;
  };
}
