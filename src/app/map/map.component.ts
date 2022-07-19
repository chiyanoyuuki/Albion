import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { addEntity, Data, Entite, Lieu, MenuContextuel, Position } from '../model';

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

  getPersonnagesDansLieu(lieu: Lieu) {
    return this.data.entites.filter((entite: Entite) => entite.lieu == lieu.id);
  }

  getLieux(): Lieu[] {
    return this.data.lieux.filter(lieu => lieu.parent == this.data.lieuActuel.id);
  }

  getPersosSurMapActuelle() {
    return this.data.entites.filter((entite: Entite) => entite.lieu == this.data.lieuActuel.id);
  }

  getEntitesPresentes(nb: number) {
    return this.getPersosSurMapActuelle().filter((entite: Entite) => entite.team == nb);
  }

  //CLICKS==================================================================

  clicMap() {
    this.menuContextuel = undefined;
    this.changingTo = undefined;
    this.focus = undefined;
  }

  clickRetour() {
    this.menuContextuel = undefined;
    let lieutmp = this.data.lieux.find((lieu: Lieu) => lieu.id == this.data.lieuActuel.parent);
    if (lieutmp) { this.data.lieuActuel = lieutmp; }
  }

  changeLieu(lieu: Lieu) {
    this.menuContextuel = undefined;
    this.changingTo = undefined;
    this.data.lieuActuel = lieu;
  }

  rentrerLieu(lieu: Lieu) {
    this.menuContextuel = undefined;
    let nb = this.getPersosSurMapActuelle().length;
    if (nb == 0) {
      this.changeLieu(lieu);
    }
    else {
      this.focus == undefined ? this.changingTo = lieu : this.focus = undefined;
    }
  }

  rentrerEntite(lieu: Lieu, perso: Entite) {
    this.verifPositionDeDepart(lieu, perso);
    perso.lieu = lieu.id;
  }

  verifPositionDeDepart(lieu: Lieu, perso: Entite) {
    this.persoHovered = [];
    this.menuContextuel = undefined;
    if (lieu.position_start) {
      let persosACheck = this.getPersonnagesDansLieu(lieu);
      let trouve = false;
      lieu.position_start.forEach((position: Position) => {
        if (!trouve) {
          let personnageSurLaPosition: Entite | undefined = undefined;
          persosACheck.forEach((persoDansLieu: Entite) => {
            if (persoDansLieu.xcombat == position.startX && persoDansLieu.ycombat == position.startY) {
              personnageSurLaPosition = persoDansLieu;
            }
          });
          if (!personnageSurLaPosition) {
            trouve = true;
            perso.xcombat = position.startX;
            perso.ycombat = position.startY;
          }
        }
      });
      if (!trouve) {
        perso.xcombat = lieu.position_start[0].startX;
        perso.ycombat = lieu.position_start[0].startY;
      }
    }
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
    perso.lieu = lieu.parent;
  }

  clicDroitMap(event: MouseEvent) {
    this.focus = undefined;
    this.changingTo = undefined;
    this.menuContextuel = { x: event.offsetX, y: event.offsetY, type: "map" };
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
    addEntite.entite.lieu = this.data.lieuActuel.id;

    if (addEntite.team == "Ami") { addEntite.entite.team = 0; }
    else if (addEntite.team == "Neutre") { addEntite.entite.team = 1; }
    else { addEntite.entite.team = 2; }

    if (!addEntite.entite.solo) {
      const nomEntite = addEntite.entite.nom;
      let nb = 1;
      this.data.entites.forEach((entite: Entite) => {
        if (entite.nom.startsWith(nomEntite)) { nb += 1; }
      });
      addEntite.entite.nom = addEntite.entite.nom + ' ' + ('0' + nb).slice(-2);
    }
    this.data.entites.push(addEntite.entite);
  }
}
