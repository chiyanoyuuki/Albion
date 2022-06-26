import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Data, Entite, Lieu } from '../model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() data: Data;
  @Output() newData = new EventEmitter<Data>();

  public datatmp: Data;
  public focus: any;
  public personnagesActuels: Entite[];

  constructor() { }

  ngOnInit(): void {

  }

  getPersonnagesInside(lieu: Lieu) {
    let personnagesInside: Entite[] = [];
    const personnagesActuels = lieu.personnagesActuels;
    if (!personnagesActuels || lieu.personnagesActuels.length == 0) { return personnagesInside; }
    this.data.equipe.forEach((perso: Entite) => {
      if (personnagesActuels.includes(perso.id)) { personnagesInside.push(perso); }
    });
    this.data.pnjsNeutres.forEach((perso: Entite) => {
      if (personnagesActuels.includes(perso.id)) { personnagesInside.push(perso); }
    });
    return personnagesInside;
  }

  getLieux(): Lieu[] {
    return this.data.lieux.filter(lieu => lieu.parent == this.data.lieuActuel.id);
  }

  changeLieu(lieu: Lieu) {
    if (this.focus != undefined) {
      this.focus = undefined;
      return;
    }
    this.datatmp = Object.assign({}, this.data);
    lieu.ancienLieu = this.data.lieuActuel;
    this.datatmp.lieuActuel = lieu;
    this.maj();
  }

  public dragEnd($event: CdkDragEnd, lieu: Lieu) {
    let tmp = $event.source.getFreeDragPosition();
    if (this.data.lieuActuel.parent == '') {
      lieu.x = lieu.x + tmp.x;
      lieu.y = lieu.y + tmp.y;;
    }
    $event.source._dragRef.reset();
  }

  clickRetour() {
    this.datatmp = Object.assign({}, this.data);
    this.datatmp.lieuActuel = this.datatmp.lieuActuel.ancienLieu;
    this.maj();
  }

  sortirPerso(lieu: Lieu, perso: Entite) {
    if(this.data.lieuActuel.parent==""){
      perso.x = lieu.x;
      perso.y = lieu.y;
    }
    else{
      perso.xcombat = lieu.x;
      perso.ycombat = lieu.y;
    }
    

    let personnagesActuels = lieu.personnagesActuels;
    personnagesActuels.splice(personnagesActuels.indexOf(perso.id), 1);
    this.data.lieuActuel.personnagesActuels.push(perso.id);
  }

  maj() {
    this.newData.emit(this.datatmp);
    this.focus = undefined;
  }

  majFromChild(newData: Data) {
    this.datatmp = newData;
    this.maj();
  }

}
