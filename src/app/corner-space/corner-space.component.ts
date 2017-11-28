import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-corner-space',
  templateUrl: './corner-space.component.html',
  styleUrls: ['./corner-space.component.css']
})
export class CornerSpaceComponent implements OnInit {

  @Input() topLabel: string;
  @Input() bottomLabel: string;
  @Input() type: string;
  @Input() icon: string;

  constructor() { }

  ngOnInit() {
  }

}
