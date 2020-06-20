import { Component, OnInit } from '@angular/core';
import { IGame } from '../services/game.interface';
import { Game, GameService } from '../services/game';
import { WebSocketsService } from '../services/web-sockets.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-game-manager',
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.scss'],
})
export class GameManagerComponent implements OnInit {
  games: IGame[] = [];
  ws: WebSocket;
  player: string;
  playerCreated = false;

  constructor(
    private gameService: GameService,
    private wss: WebSocketsService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    // this.gameService.getAll().subscribe((data: any) => {
    //   this.games = data.games;
    // })
    this.player = this.cookieService.get('user');
    this.playerCreated = !!this.player;
    this.wss.subscribeTo('GamesChannel').asObservable().subscribe((event: any) => {
      if (event) {
        this.games = event.games
      }
    })

  }

  create(): void {
    this.gameService.create({name: this.player}).subscribe((data: any) => {
      console.log(data)
    });
  }

  savePlayer(): void {
    this.cookieService.set('user', this.player);
    this.playerCreated = true;
  }

}
