import { EventEmitter } from '@angular/core';

export class TimerService {
  time: number = 0;
  private timerInterval;
  private running: boolean = false;
  tick: EventEmitter<number> = new EventEmitter();
  stopped: EventEmitter<null> = new EventEmitter();
  constructor(time: number, interval: number = 1000) {
    this.time = time;
    this.timerInterval = setInterval(() => {
      if (this.running) {
        this.time -= 1;
        if (this.time < 1) {
          this.running = false;
          this.stopped.emit();
        } else {
          this.tick.emit(this.time);
        }
      }
    }, interval);
  }

  start() {
    this.running = true;
  }

  pause() {
    this.running = false;
  }

}
