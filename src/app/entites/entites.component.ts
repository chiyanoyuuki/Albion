import { Entite, Data, MenuContextuel, Lieu } from '../model';
import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-entites',
  templateUrl: './entites.component.html',
  styleUrls: ['./entites.component.scss']
})
export class EntitesComponent implements OnInit, DoCheck {

  @Input() data: Data;
  @Input() type: string;

  public entites: any;
  public quetePrincipale: any;
  public queteSecondaire: any;
  public quetes: any;
  public focus: any;
  public menuContextuel: MenuContextuel | undefined;
  public persoMenuContextuel: Entite | undefined;
  public ongletActif: string = "inventaire";

  constructor() { }

  ngOnInit(): void {
    
  }

  ngDoCheck(): void {
    if (this.type == "personnages") { this.entites = this.data.equipe };
    if (this.type == "pnjsNeutres") { this.entites = this.data.pnjsNeutres };
    if (this.type == "ennemis") { this.entites = this.data.lieuActuel.pnjs };
    this.quetePrincipale = this.data.quetesprincipales;
    this.queteSecondaire = this.data.quetessecondaires;
    this.quetes = [
      this.quetePrincipale,
      this.queteSecondaire
    ]
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
    return !perso.solo && Number(perso.nom.replace(/[^0-9]*/, "")) % 2 != 0;
  }

  public getEntites() {
    if (this.type == "ennemis") { return this.entites; }
    return this.entites.filter((entite: Entite) =>
      this.data.lieuActuel.personnagesActuels.includes(entite.nom)
    );
  }
  public getQuetePrincipale() {
    return this.quetePrincipale;
  }
  public getQueteSecondaire() {
    return this.queteSecondaire;
  }

  public getScale() {
    return 'scale(' + this.data.lieuActuel.scale ? this.data.lieuActuel.scale : 1 + ')';
  }


  public clickPerso(perso: Entite) {

  }

  clicDroit(event: MouseEvent, perso: Entite) {
    this.focus = undefined;
    if (this.menuContextuel == undefined) {
      this.persoMenuContextuel = perso;
      this.menuContextuel = { x: event.offsetX, y: event.offsetY, type: "entite" };
    }
    else {
      this.persoMenuContextuel = undefined;
      this.menuContextuel = undefined;
    }

  }

  public majFromChild() {
    let entite = this.persoMenuContextuel;
    if (!entite) { return }
    if (this.type == "personnages") {
      this.data.equipe.splice(this.data.equipe.indexOf(entite), 1);
      this.data.lieuActuel.personnagesActuels.splice(this.data.lieuActuel.personnagesActuels.indexOf(entite.nom), 1);
    }
    else if (this.type == "pnjsNeutres") {
      this.data.pnjsNeutres.splice(this.data.pnjsNeutres.indexOf(entite), 1);
      this.data.lieuActuel.personnagesActuels.splice(this.data.lieuActuel.personnagesActuels.indexOf(entite.nom), 1);
    }
    else if (this.type == "ennemis") {
      this.data.lieuActuel.pnjs.splice(this.data.lieuActuel.pnjs.indexOf(entite), 1);
    }
    this.persoMenuContextuel = undefined;
    this.menuContextuel = undefined;
    this.majMap();
  }

  majMap() {
    let location = this.data.lieux.find((l: Lieu) => l.id == this.data.lieuActuel.id);
    location = this.data.lieuActuel;
  }
}
