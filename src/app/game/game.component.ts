import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Game, GameService } from '../services/game';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [GameService]
})
export class GameComponent implements OnInit {
  gameId: string = '';
  players: string[] = [];
  constructor(private route: ActivatedRoute, private gameService: GameService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params.id;

      let ws = new WebSocket("ws://localhost:3000/websocket")
      ws.onopen = (e) => {
        let a =  JSON.stringify(
          {
            "command": "subscribe",
            "identifier":  JSON.stringify({"channel": "GameChannel", "id": this.gameId}),
            "id": this.gameId
          })
        ws.send(a)
      }
      ws.onmessage = (e) => {
        let json = JSON.parse(e.data);
        if (json["identifier"]) {
          json['identifier'] = JSON.parse(json['identifier'])
          if (json['identifier']['channel'] === 'GameChannel' && json['message']) {
            console.log('!!!', json)
            this.players = json['message']['players']
          }
        }
      }

      this.gameService.join(this.gameId).subscribe()
    });
  }

}
