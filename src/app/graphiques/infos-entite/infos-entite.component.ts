import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Entite, Data } from 'src/app/model';

@Component({
  selector: 'app-infos-entite',
  templateUrl: './infos-entite.component.html',
  styleUrls: ['./infos-entite.component.scss']
})
export class InfosEntiteComponent implements OnInit {
  @Input() perso: Entite;
  @Input() data: Data;
  @Output() persoActuel = new EventEmitter<Entite>();

  public formulaire: string;
  public quantite: string;

  constructor() { }

  ngOnInit(): void {
    
  }
  

  getNom() {
    let nom = this.perso.nom;
    if (!this.data.admin) { nom = nom.replace(/ *[0-9]+ *$/g, ""); }
    return nom;
  }

  form(perso: Entite) {
    if (!this.quantite.match(/^-?[0-9]+$/g)) {
      return;
    }
    let quantiteNbr: number = Number(this.quantite);

    if (this.formulaire == 'pv') {
      perso.pdv += quantiteNbr;
      if (perso.pdv > perso.pdvmax) {
        perso.pdv = perso.pdvmax;
      } else if (perso.pdv < 0) {
        perso.pdv = 0;
      }
    } else if (this.formulaire == 'mana') {
      perso.mana += quantiteNbr;
      if (perso.mana > perso.manamax) {
        perso.mana = perso.manamax;
      } else if (perso.mana < 0) {
        perso.mana = 0;
      }
    }
    this.formulaire = "";
  }

  infoPerso() {
    if (this.perso.joueur || (this.perso.team > 0 && this.perso.pdv == 0) || this.perso.boutique == this.data.lieuActuel.id || (this.perso.team > 0 && this.data.admin)) {
      this.persoActuel.emit(this.perso);
    }
  }

  getEtat() {
    if (this.perso.pdv == 0 && this.perso.id != "coffre") { return 'Mort'; }
    if (this.perso.etat) { return this.perso.etat; }
    return 'Bonne santé';
  }

}
