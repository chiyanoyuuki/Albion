import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Data, Personnage, PNJ } from '../model';

@Component({
  selector: 'app-pnjs',
  templateUrl: './pnjs.component.html',
  styleUrls: ['./pnjs.component.scss']
})
export class PnjsComponent implements OnInit {

  constructor() { }

  @Input() data : Data;
  @Output() newData = new EventEmitter<Data>();

  public datatmp : Data;
  public focus : any;

  ngOnInit(): void {
  }

  public dragEnd($event: CdkDragEnd, perso:PNJ) {
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

  public clickPerso(perso:PNJ)
  {

  }

  maj(){
    this.newData.emit(this.datatmp);
  }

}
