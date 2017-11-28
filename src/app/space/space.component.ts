import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css']
})
export class SpaceComponent implements OnInit {
  type;
  color;
  name;
  pricetext;

  constructor() { }

  ngOnInit() {
  }

}
