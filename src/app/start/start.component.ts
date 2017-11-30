import { Component, OnInit } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  gameConfiguration = {
    location: '',
    numberOfPlayers: 4,
    players: []
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

  setup(){
    console.log(this.gameConfiguration);
    this.router.navigate(['/board', 'nyc']);
  }

}
