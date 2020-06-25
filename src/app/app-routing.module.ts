import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameManagerComponent } from './game-manager/game-manager.component';
import { GameComponent } from './game/game.component';
import { QuestionsEditorComponent } from './questions-editor/questions-editor.component';

const routes: Routes = [
  { path: '', component: GameManagerComponent },
  { path: 'game/:id', component: GameComponent },
  { path: 'questions-editor', component: QuestionsEditorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
