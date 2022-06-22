import { Data } from '../model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.scss']
})
export class EquipeComponent implements OnInit {
  
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
