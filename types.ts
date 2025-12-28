
export type ActivityType = 'tv' | 'play' | 'eat' | 'sleep' | 'tablet';

export interface Activity {
  id: ActivityType;
  label: string;
  icon: string;
  color: string;
  endMessage: string;
}

export interface Character {
  id: string;
  icon: string;
  label: string;
}

export enum TimerStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED'
}
