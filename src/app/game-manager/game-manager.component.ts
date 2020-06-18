import { Component, OnInit } from '@angular/core';
import { IGame } from '../services/game.interface';
import { Game, GameService } from '../services/game';
import { WebSocketsService } from '../services/web-sockets.service';

@Component({
  selector: 'app-game-manager',
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.scss'],
})
export class GameManagerComponent implements OnInit {
  games: IGame[] = [];
  ws: WebSocket;
  constructor(private gameService: GameService, private wss: WebSocketsService) { }

  ngOnInit(): void {
    // this.gameService.getAll().subscribe((data: any) => {
    //   this.games = data.games;
    // })
    setTimeout(() => {
      this.wss.subscribeTo('GamesChannel').asObservable().subscribe((event: any) => {
        if (event) {
          this.games = event.games
        }
      })

    }, 2000);
  }

  create(): void {
    this.gameService.create().subscribe((data: any) => {
      console.log(data)
    });
  }

}
