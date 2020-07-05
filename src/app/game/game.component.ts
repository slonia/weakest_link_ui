import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Game, GameService } from '../services/game';
import { WebSocketsService } from '../services/web-sockets.service';
import { CookieService } from 'ngx-cookie-service';
import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  gameId: string = '';
  players: string[] = [];
  owner: string;
  currentUser: string;
  isOwner: boolean = false;
  timer: TimerService;
  timeLeft: number;
  answeringId: number = 0;
  money = [1000, 2000, 5000, 10000, 15000, 20000, 30000, 40000];
  totalMoney = 0;
  moneyIndex = 0;
  isAnswering: boolean = false;
  answerReceived: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private wss: WebSocketsService,
    private cookieService: CookieService
  ) {
    this.timer = new TimerService(200);
    this.timer.tick.subscribe((num: number) => {
      this.timeLeft = num;
      if (num % 10 === 0) {
        this.setNextPlayer();
      }
    })
  }

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

  bank() {
    this.wss.sendData('GameChannel', {id: this.gameId}, {"event": "bank"});
  }

  pass() {
    this.wss.sendData('GameChannel', {id: this.gameId}, {"event": "pass"});
  }

  wrong() {

  }

  correct() {

  }

  pause() {
    this.timer.pause();
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
        this.timer.start();
        break;
      }
      case "bank": {
        this.totalMoney += this.money[this.moneyIndex];
        this.moneyIndex = 0;
        break;
      }
      case "pass": {
        this.moneyIndex = 0;
        this.setNextPlayer();
        break;
      }
    }
  }

  private setNextPlayer() {
    this.answeringId += 1;
    if (this.answeringId >= this.players.length) {
      this.answeringId = 0;
    }
    this.isAnswering = this.players[this.answeringId] === this.currentUser;
  }

}
