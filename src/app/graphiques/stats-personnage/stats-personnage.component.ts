import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Boutique, Data, Entite, Equipement, Forme, ObjetInventaire, Quete, Sort } from 'src/app/model';
import { FonctionsService } from 'src/app/services/fonctions.service';

@Component({
  selector: 'app-stats-personnage',
  templateUrl: './stats-personnage.component.html',
  styleUrls: ['./stats-personnage.component.scss']
})
export class StatsPersonnageComponent implements OnInit {

  @Input() data: Data;
  @Input() perso: Entite;

  public gain: string;
  public formulaire: string;
  public ongletActif: string = "inventaire";
  public objetActifInventaire: ObjetInventaire | undefined;
  public fenetreFocused: string = "";

  constructor(private fonctionsService: FonctionsService) { }
  ngOnInit(): void { }

  clickGain(perso: Entite, clicked: string, type: string) {
    if(perso.joueur){this.gain = this.fonctionsService.clickGain(this.data, perso, clicked, this.gain, type, undefined);}
  }

  public getEtat() {
    if (this.perso.pdv == 0) { return "Mort"; }
    if (!this.perso.etat) { return "Bonne Santé"; }
    return this.perso.etat;
  }

  public getContainerLeft() {
    let retour = -170;
    let x = this.perso.x;
    if (this.data.lieuActuel.id == "map") {
      x = this.perso.x;
    }
    if (x < 170) {
      retour += 170 - x;
    }
    return retour + "px";
  }

  public changeForme() {
    let formeActuelle = this.perso.formes.find((forme: Forme) => forme.nom == this.perso.forme.nom);
    if (formeActuelle) {
      let index = this.perso.formes.indexOf(formeActuelle);
      if (index < this.perso.formes.length - 1) { this.perso.forme = this.perso.formes[index + 1]; }
      else if (index != 0) { this.perso.forme = this.perso.formes[0]; }
    }

  }
}
