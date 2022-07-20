import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Entite } from 'src/app/model';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss']
})
export class FormulaireComponent implements OnInit {

  @Input() perso: Entite;
  @Input() formulaire: string;
  @Output() closeForm = new EventEmitter<null>();

  public quantite: string;

  constructor() { }

  ngOnInit(): void {
    if (this.formulaire == "etat") {
      this.quantite = this.perso.etat;
    }
  }

  form() {
    if (this.quantite) {
      if (this.formulaire == "etat") {
        this.perso.etat = this.quantite;
        this.close();
      }
      else {
        if (!this.quantite.match(/^-?[0-9]+$/g)) {
          return;
        }
        let quantiteNbr: number = Number(this.quantite);
        if (this.formulaire == 'gold') {
          this.perso.argent += quantiteNbr;
          if (this.perso.argent < 0) {
            this.perso.argent = 0;
          }
        } else if (this.formulaire == 'pv') {
          this.perso.pdv += quantiteNbr;
          if (this.perso.pdv > this.perso.pdvmax) {
            this.perso.pdv = this.perso.pdvmax;
          } else if (this.perso.pdv < 0) {
            this.perso.pdv = 0;
          }
        } else if (this.formulaire == 'mana') {
          this.perso.mana += quantiteNbr;
          if (this.perso.mana > this.perso.manamax) {
            this.perso.mana = this.perso.manamax;
          } else if (this.perso.mana < 0) {
            this.perso.mana = 0;
          }
        }
        this.close();
      }
    }
  }

  close() {
    this.closeForm.emit();
  }

}
