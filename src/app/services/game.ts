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

  create(payload: any) {
    return this.http.post("http://localhost:3000/create", payload);
  }
}
