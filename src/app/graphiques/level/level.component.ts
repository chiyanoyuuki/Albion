import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit {

  @Input() niveau: number;

  constructor() { }

  ngOnInit(): void {
  }

}
