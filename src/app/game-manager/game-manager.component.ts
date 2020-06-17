import { Component, OnInit } from '@angular/core';
import { IGame } from '../services/game.interface';
import { Game, GameService } from '../services/game';

@Component({
  selector: 'app-game-manager',
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.scss'],
  providers: [GameService]
})
export class GameManagerComponent implements OnInit {
  games: IGame[] = [];
  ws: WebSocket;
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getAll().subscribe((data: any) => {
      this.games = data.games;
    })
    this.ws = new WebSocket("ws://localhost:3000/websocket")
    this.ws.onopen = (e) => {
      let a =  JSON.stringify(
        {
          "command": "subscribe",
          "identifier": JSON.stringify(
              {"channel": "GameChannel" }       )
        })
      this.ws.send(a)
    }
    this.ws.onmessage = (e) => {
      console.log(e)
    }
  }

  create(): void {
    let id = "123";
    this.gameService.create({id: id}).subscribe();
  }

}
