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
  owner: string;
  currentUser: string;
  isOwner: boolean = false;
  timer: number;
  timerInterval: any;
  answeringId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private wss: WebSocketsService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params.id;
      this.wss.subscribeTo('GameChannel', {id: this.gameId}).asObservable().subscribe((event) => {
        if (event) {
          this.processMessage(event);
        }

      })

      this.currentUser = this.cookieService.get('user');
      this.gameService.join(this.gameId, this.currentUser).subscribe((data: any) => {
        data.players.forEach((player) => {
          if (player.role === 'creator') {
            this.owner = player.name;
            this.isOwner = this.owner === this.currentUser;
          }
        })

      })
    });
  }

  start() {
    this.wss.sendData('GameChannel', {id: this.gameId}, {"event": "start"});
  }

  // private

  private processMessage(event: any) {
    console.log("aaa", event)
    switch(event.event) {
      case "player_joined": {
        this.players = event.data.players;
        break;
      }
      case "start": {
        this.timer = 200;
        this.setNextPlayer();
        this.runTimer();
        break;
      }
    }
  }

  private runTimer() {
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.timer -= 1;
        if (this.timer % 10 === 0) {
          this.setNextPlayer();
        }
        if (this.timer < 1) {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    }
  }

  private setNextPlayer() {
    this.answeringId += 1;
    if (this.answeringId >= this.players.length) {
      this.answeringId = 0;
    }
  }

}
