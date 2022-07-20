import { Component, Input, OnInit } from '@angular/core';
import { Data, Entite, ObjetInventaire, Quete } from 'src/app/model';

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
  public objetActif: ObjetInventaire | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  clickGain(perso: Entite, clicked: string) {
    if (this.gain != clicked) {
      this.gain = clicked;
    } else if (this.gain == clicked) {
      if (clicked == 'Niveau') {
        perso.niveau += 1;
      }
      perso.stats.forEach(element => {
        if (element.nom == clicked) {
          element.qte += 1;
        }
      });
      perso.inventaire.forEach(element => {
        if (element.nom == clicked) {
          element.qte -= 1;
          let item = perso.inventaire.find(objet => objet.nom == clicked);
          if (element.qte == 0) {
            if (item) {
              perso.inventaire.splice(perso.inventaire.indexOf(item), 1);
              perso.inventaire.push({ "nom": '', "image": '', qte: 0 });
            }
          } else if (item && element.qte < 0) {
            item.qte = 0;
          }
        }
      });
      this.gain = "";
    }
  }

  getQuetesPrincipales() {
    return this.data.quetesprincipales.filter((quete: Quete) =>
      quete.perso == this.perso.nom || quete.perso == "Toute l'équipe"
    );
  }

}
