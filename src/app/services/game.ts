import { IGame } from './game.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export class Game implements IGame {
  id: string;
  players: string[] = [];

}

@Injectable()
export class GameService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get("http://localhost:3000/");
  }

  create(payload: any = {}) {
    let id = Math.random().toString(36).substr(2, 9);
    let payloadWithId = {"game": {...payload, uuid: id}};
    return this.http.post("http://localhost:3000/games", payloadWithId);
  }

  join(id: string, name: string) {
    return this.http.post("http://localhost:3000/games/" + id + "/join", {name: name});
  }
}
