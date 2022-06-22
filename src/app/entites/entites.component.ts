import { Data } from '../model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-entites',
  templateUrl: './entites.component.html',
  styleUrls: ['./entites.component.scss']
})
export class EntitesComponent implements OnInit {
  
  @Input() data : Data;
  @Output() newData = new EventEmitter<Data>();

  public datatmp : Data;
  
  constructor() { }

  ngOnInit(): void 
  {

  }

  maj(){
    this.newData.emit(this.datatmp);
  }
}
