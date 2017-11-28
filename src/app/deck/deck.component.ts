import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {

  @Input() type: string;
  @Input() label: string;

  constructor() { }

  ngOnInit() {
  }

}
