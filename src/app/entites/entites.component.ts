import { Entite, Data } from '../model';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-entites',
  templateUrl: './entites.component.html',
  styleUrls: ['./entites.component.scss']
})
export class EntitesComponent implements OnInit {

  @Input() data: Data;
  @Input() type: string;
  @Output() newData = new EventEmitter<Data>();

  public entites: any;
  public datatmp: Data;
  public focus: any;

  constructor() { }

  ngOnInit(): void {
  }

  public dragEnd($event: CdkDragEnd, perso: Entite) {
    let tmp = $event.source.getFreeDragPosition();
    if (this.data.lieuActuel.parent == '') {
      perso.x = perso.x + tmp.x;
      perso.y = perso.y + tmp.y;;
    }
    else {
      perso.xcombat = perso.xcombat + tmp.x;
      perso.ycombat = perso.ycombat + tmp.y;;
    }
    $event.source._dragRef.reset();
  }

  public isReverted(perso: Entite) {
    return !perso.solo && Number(perso.nom.replace(/[a-zA-Z ]*/, "")) % 2 == 0;
  }


  public clickPerso(perso: Entite) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.type == "personnages") { this.entites = this.data.personnages };
    if (this.type == "amisActuels") { this.entites = this.data.amisActuels };
    if (this.type == "ennemis") { this.entites = this.data.lieuActuel.pnjs };
  }

  maj() {
    this.newData.emit(this.datatmp);
  }
}