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
  // attributes
  gameId: string = '';
  players: string[] = [];
  owner: string;
  currentUser: string;
  isOwner: boolean = false;
  timer: TimerService;
  bankTimer: TimerService;
  answeringId: number;
  money = [1000, 2000, 5000, 10000, 15000, 20000, 30000, 40000];
  totalMoney = 0;
  moneyIndex = 0;
  isAnswering: boolean = false;
  answerReceived: boolean = false;
  canPutInBank: boolean = false;
  currentQuestion: string;
  currentAnswer: string;
  currentRound: number = 0;

  onBankStart = () => {
    this.timer.pause();
    this.canPutInBank = true;
  }

  onBankPause = () => {
    this.canPutInBank = false;
  }

  onBankEnd = () => {
    this.askForQuestion();
  }

  // instance methods
  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private wss: WebSocketsService,
    private cookieService: CookieService
  ) {
    this.timer = new TimerService(this.getRoundTime());
    this.bankTimer = new TimerService(10);
    this.bankTimer.started.subscribe(this.onBankStart);
    this.bankTimer.paused.subscribe(this.onBankPause);
    this.bankTimer.stopped.subscribe(this.onBankEnd);
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


  wrong() {
    this.wss.sendData('GameChannel', {id: this.gameId}, {'event': 'wrong'})
  }

  correct() {
    this.wss.sendData('GameChannel', {id: this.gameId}, {'event': 'correct'})
  }

  pause() {
    this.timer.pause();
  }

  // private

  private processMessage(event: any) {
    console.log(event.event, "received")
    switch(event.event) {
      case "player_joined": {
        this.players = event.data.players;
        break;
      }
      case "start": {
        this.askForQuestion();
        this.startNextTurn(false);
        break;
      }
      case "bank": {
        this.onBank();
        break;
      }
      case "pass": {
        this.moneyIndex = 0;
        this.startNextTurn();
        break;
      }
      case "question": {
        this.onQuestion(event);
        break;
      }
      case "answer": {
        this.answerReceived = true;
        this.timer.pause();
        break
      }
      case "wrong": {
        this.moneyIndex = 0
        this.startNextTurn();
        break;
      }
      case "correct": {
        this.moneyIndex += 1;
        if (this.moneyIndex > this.money.length - 1) {
          this.moneyIndex = 0;
        }
        this.startNextTurn();
        break;
      }
    }
  }

  onBank() {
    this.totalMoney += this.money[this.moneyIndex];
    this.moneyIndex = 0;
    this.bankTimer.stop();
  }

  sendStart() {
    this.wss.sendData('GameChannel', {id: this.gameId}, {"event": "start"});
  }

  sendBank() {
    this.wss.sendData('GameChannel', {id: this.gameId}, {"event": "bank"});
  }

  sendPass() {
    this.wss.sendData('GameChannel', {id: this.gameId}, {"event": "pass"});
  }

  sendAnswer() {
    this.wss.sendData('GameChannel', {id: this.gameId}, {"event": "answer"});
  }

  private onQuestion(event: any) {
    this.currentQuestion = event.question;
    this.currentAnswer = event.answer;
    this.timer.start();
  }

  private startNextTurn(bank = true) {
    if (typeof this.answeringId === 'undefined') {
      this.answeringId = 0;
    } else {
      this.answeringId += 1;
    }
    if (this.answeringId >= this.players.length) {
      this.answeringId = 0;
    }
    this.isAnswering = this.players[this.answeringId] === this.currentUser;
    if (bank) this.bankTimer.restart();
  }

  private getRoundTime(): number{
    let n = this.players.length - 1;
    if (n >= 8) {
      return 150;
    } else if (n > 2) {
      return 90 + 10 * (n-2);
    } else {
      return 90;
    }
  }

  private askForQuestion() {
    this.wss.sendData('GameChannel', {id: this.gameId}, {'event': 'question'})
  }
}
