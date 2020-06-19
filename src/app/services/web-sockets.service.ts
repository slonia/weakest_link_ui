import { Injectable } from '@angular/core';
import { Subject, Observable }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WebSocketsService {
  ws: WebSocket;
  channels: {
    [key: string]: Subject<any>
  } = {};

  constructor() {
    this.ws = new WebSocket("ws://localhost:3000/websocket");
    this.ws.onopen = () => {
      this.setOnMessage();
    };
  }

  subscribeTo(channel: string, params = {}): Subject<any> {
    let subscription = {
      "command": "subscribe",
      "identifier": JSON.stringify({...{"channel": channel}, ...params})
    };
    let interval = setInterval(() => {
      if (this.ws.readyState === this.ws.OPEN) {
        this.ws.send(JSON.stringify(subscription));
        clearInterval(interval)
      }
    }, 500);
    this.channels[channel] = new Subject<any>();
    return this.channels[channel];
  }

  private setOnMessage() {
    let json, identifier;
    this.ws.onmessage = (message) => {
      json = JSON.parse(message.data);
      if (json['identifier']) {
        identifier = JSON.parse(json['identifier']);
        if (identifier['channel'] && this.channels[identifier['channel']]) {
          this.channels[identifier['channel']].next(json['message'])
        }
      }
    }
  }
}
