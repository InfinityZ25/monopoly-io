import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { SquareComponent } from './square/square.component';
import { DeckComponent } from './deck/deck.component';
import { SpaceComponent } from './space/space.component';
import { CornerSpaceComponent } from './corner-space/corner-space.component';
import { StartComponent } from './start/start.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { SettingsComponent } from './settings/settings.component';
import {AppRoutingModule} from "./app-routing.module";


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SquareComponent,
    DeckComponent,
    SpaceComponent,
    CornerSpaceComponent,
    StartComponent,
    GameBoardComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
