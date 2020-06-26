import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }   from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameManagerComponent } from './game-manager/game-manager.component';
import { GameComponent } from './game/game.component';
import { WebSocketsService } from './services/web-sockets.service';
import { GameService } from './services/game';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuestionsEditorComponent } from './questions-editor/questions-editor.component';
import { QuestionService } from './services/question'

@NgModule({
  declarations: [
    AppComponent,
    GameManagerComponent,
    GameComponent,
    QuestionsEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  providers: [CookieService, GameService, WebSocketsService, QuestionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
