import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Data, Lieu } from '../model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() data : Data;
  @Output() newData = new EventEmitter<Data>();

  public datatmp : Data;
  public focus : Lieu|undefined;

  constructor() { }

  ngOnInit(): void {
  }

  getLieux():Lieu[]
  {
    return this.data.lieux.filter(lieu=>lieu.parent==this.data.lieuActuel.id);
  }

  changeLieu(lieu:Lieu)
  {
    this.datatmp = Object.assign({},this.data);
    this.datatmp.lieuActuel = lieu;
    this.maj();
  }

  maj(){
    this.newData.emit(this.datatmp);
  }

}
