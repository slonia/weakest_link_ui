import { EventEmitter } from '@angular/core';

export class TimerService {
  time: number = 0;
  running: boolean = false;
  private timerInterval;
  private initialTime: number = 0;
  tick: EventEmitter<number> = new EventEmitter();
  stopped: EventEmitter<null> = new EventEmitter();
  started: EventEmitter<null> = new EventEmitter();
  paused: EventEmitter<null> = new EventEmitter();

  constructor(time: number, interval: number = 1000) {
    this.time = time;
    this.initialTime = time;
    this.timerInterval = setInterval(() => {
      if (this.running) {
        this.time -= 1;
        if (this.time < 1) {
          this.stop();
        } else {
          this.tick.emit(this.time);
        }
      }
    }, interval);
  }

  restart() {
    this.time = this.initialTime;
    this.start();
  }

  start() {
    this.running = true;
    this.started.emit();
  }

  pause() {
    this.running = false;
    this.paused.emit();
  }

  stop() {
    this.time = 0;
    this.running = false;
    this.stopped.emit();
  }
}
