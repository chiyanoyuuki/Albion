import { Data, Personnage } from '../model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

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

  public dragEnd($event: CdkDragEnd, perso:Personnage) {
    let tmp = $event.source.getFreeDragPosition();
    if(this.data.lieuActuel.parent=='')
    {
      perso.x = perso.x + tmp.x;
      perso.y = perso.y + tmp.y;;
    }
    else
    {
      perso.xcombat = perso.xcombat + tmp.x;
      perso.ycombat = perso.ycombat + tmp.y;;
    }
    $event.source._dragRef.reset();
  }

  maj(){
    this.newData.emit(this.datatmp);
  }
}
