import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameManagerComponent } from './game-manager/game-manager.component';

const routes: Routes = [
  { path: '', component: GameManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
