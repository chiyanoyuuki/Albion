import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { addEntity, Data, Entite, Lieu, MenuContextuel } from '../model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() data: Data;

  public focus: any;
  public personnagesActuels: Entite[];
  public changingTo: Lieu | undefined;
  public persoHovered: string[] = [];
  public menuContextuel: MenuContextuel | undefined;

  constructor() { }

  ngOnInit(): void {

  }

  //GET=================================================================

  getPersonnagesInside(lieu: Lieu) {
    let personnagesInside: Entite[] = [];
    const personnagesActuels = lieu.personnagesActuels;
    if ((!personnagesActuels || lieu.personnagesActuels.length == 0) && lieu.pnjs.length == 0) { return personnagesInside; }
    this.data.equipe.forEach((perso: Entite) => {
      if (personnagesActuels.includes(perso.nom)) { personnagesInside.push(perso); }
    });
    this.data.pnjsNeutres.forEach((perso: Entite) => {
      if (personnagesActuels.includes(perso.nom)) { personnagesInside.push(perso); }
    });
    lieu.pnjs.forEach((entite: Entite) => personnagesInside.push(entite));
    return personnagesInside;
  }

  getLieux(): Lieu[] {
    return this.data.lieux.filter(lieu => lieu.parent == this.data.lieuActuel.id);
  }

  public getEntitesPresentes(entites: Entite[]) {
    return entites.filter((entite: Entite) =>
      this.data.lieuActuel.personnagesActuels.includes(entite.nom)
    );
  }

  //CLICKS==================================================================

  clicMap() {
    this.menuContextuel = undefined;
    this.changingTo = undefined;
    this.focus = undefined;
  }

  clickRetour() {
    this.menuContextuel = undefined;
    this.data.lieuActuel = this.data.lieuActuel.ancienLieu;
  }

  changeLieu(lieu: Lieu) {
    this.menuContextuel = undefined;
    this.changingTo = undefined;
    lieu.ancienLieu = this.data.lieuActuel;
    this.data.lieuActuel = lieu;
  }

  rentrerLieu(lieu: Lieu) {
    this.menuContextuel = undefined;
    this.focus == undefined ? this.changingTo = lieu : this.focus = undefined;
  }

  rentrerPerso(lieu: Lieu, perso: Entite) {
    this.persoHovered = [];
    this.menuContextuel = undefined;
    let personnagesActuels = this.data.lieuActuel.personnagesActuels;
    let index = personnagesActuels.indexOf(perso.nom);
    personnagesActuels.splice(index, 1);
    lieu.personnagesActuels.push(perso.nom);
  }

  rentrerPnj(lieu: Lieu, perso: Entite) {
    this.persoHovered = [];
    this.menuContextuel = undefined;
    let personnagesActuels = this.data.lieuActuel.pnjs;
    let index = personnagesActuels.indexOf(perso);
    personnagesActuels.splice(index, 1);
    lieu.pnjs.push(perso);
  }

  sortirPerso(lieu: Lieu, perso: Entite) {
    this.menuContextuel = undefined;
    if (this.data.lieuActuel.parent == "") {
      perso.x = lieu.x;
      perso.y = lieu.y;
    }
    else {
      perso.xcombat = lieu.x;
      perso.ycombat = lieu.y;
    }

    let personnagesActuels = lieu.personnagesActuels;
    let index = personnagesActuels.indexOf(perso.nom);
    if (index != -1) { personnagesActuels.splice(index, 1); this.data.lieuActuel.personnagesActuels.push(perso.nom); }
    else { index = lieu.pnjs.indexOf(perso); lieu.pnjs.splice(index, 1); this.data.lieuActuel.pnjs.push(perso); }
  }

  clicDroitMap(event: MouseEvent) {
    this.focus = undefined;
    this.changingTo = undefined;
    this.menuContextuel = { x: event.offsetX, y: event.offsetY };
  }

  //AUTRE=========================================================================

  public dragEnd($event: CdkDragEnd, lieu: Lieu) {
    let tmp = $event.source.getFreeDragPosition();
    if (this.data.lieuActuel.parent == '') {
      lieu.x = lieu.x + tmp.x;
      lieu.y = lieu.y + tmp.y;;
    }
    $event.source._dragRef.reset();
  }

  public majFromChild(addEntite: addEntity) {
    this.menuContextuel = undefined;
    addEntite.entite.x = addEntite.menuContextuel.x;
    addEntite.entite.y = addEntite.menuContextuel.y;
    if (addEntite.team == "Ami") {
      this.data.equipe.push(addEntite.entite);
      this.data.lieuActuel.personnagesActuels.push(addEntite.entite.nom);
    }
    else if (addEntite.team == "Neutre") {
      this.data.pnjsNeutres.push(addEntite.entite);
      this.data.lieuActuel.personnagesActuels.push(addEntite.entite.nom);
    }
    else {
      this.data.lieuActuel.pnjs.push(addEntite.entite);
    }
  }
}
