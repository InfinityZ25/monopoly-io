import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {StartComponent} from "./start/start.component";
import {GameBoardComponent} from "./game-board/game-board.component";
import {SettingsComponent} from "./settings/settings.component";


const routes: Routes = [
  { path: 'start', component: StartComponent },
  { path: 'board/:location', component: GameBoardComponent},
  { path: 'settings', component: SettingsComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})

export class AppRoutingModule {


}
