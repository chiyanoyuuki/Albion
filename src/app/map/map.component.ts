import { CdkDragEnd } from '@angular/cdk/drag-drop';
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

  constructor() {  }

  ngOnInit(): void {
  }

  getLieux():Lieu[]
  {
    return this.data.lieux.filter(lieu=>lieu.parent==this.data.lieuActuel.id);
  }

  changeLieu(lieu:Lieu)
  {
    this.datatmp = Object.assign({},this.data);
    lieu.ancienLieu = this.data.lieuActuel;
    this.datatmp.lieuActuel = lieu;
    this.maj();
  }

  public dragEnd($event: CdkDragEnd, lieu:Lieu) {
    let tmp = $event.source.getFreeDragPosition();
    if(this.data.lieuActuel.parent=='')
    {
      lieu.x = lieu.x + tmp.x;
      lieu.y = lieu.y + tmp.y;;
    }
    $event.source._dragRef.reset();
  }

  clickRetour()
  {
    this.datatmp = Object.assign({},this.data);
    this.datatmp.lieuActuel = this.datatmp.lieuActuel.ancienLieu;
    this.maj();
  }

  maj(){
    this.newData.emit(this.datatmp);
    this.focus = undefined;
  }

  majFromChild(newData:Data){
    this.datatmp = newData;
    this.maj();
  }

}
