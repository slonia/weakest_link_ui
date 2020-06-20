import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Game, GameService } from '../services/game';
import { WebSocketsService } from '../services/web-sockets.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})

export class GameComponent implements OnInit {
  gameId: string = '';
  players: string[] = [];
  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private wss: WebSocketsService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params.id;
      this.wss.subscribeTo('GameChannel', {'id': this.gameId}).asObservable().subscribe((event: any) => {
        if (event) {
          // debugger
          this.players = event.players;
        }
      })

      let user = this.cookieService.get('user');
      this.gameService.join(this.gameId, user).subscribe()
    });
  }

}
