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

  subscribeTo(channel: string, payload = {}): Subject<any> {
    let identifier = JSON.stringify({"channel": channel, ...payload});
    this.send("subscribe", identifier);
    this.channels[channel] = new Subject<any>();
    return this.channels[channel];
  }

  sendData(channel: string, payload = {}, data = {}) {
    let identifier = JSON.stringify({"channel": channel, ...payload});
    this.send("message", identifier, JSON.stringify(data));
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

  private send(command: string, identifier: any, data = {}) {
    let subscription = {
      "command": command,
      "identifier": identifier,
      "data": data
    };
    let interval = setInterval(() => {
      if (this.ws.readyState === this.ws.OPEN) {
        this.ws.send(JSON.stringify(subscription));
        clearInterval(interval)
      }
    }, 500);

  }
}
