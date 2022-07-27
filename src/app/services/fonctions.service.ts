import { Injectable } from '@angular/core';
import { Data, Entite, Equipement, ObjetInventaire, Quete } from '../model';
import { PersoService } from './perso.service';

@Injectable({
  providedIn: 'root'
})
export class FonctionsService {

  constructor(private persoService: PersoService) { }

  clickGain(perso: Entite, clicked: string, gain: string, type: string) {
    console.log("Click Gain :", perso.nom, clicked, gain, type);
    if (gain != clicked) { gain = clicked; }
    else if (gain == clicked) {
      if (gain == "") { return ""; }

      if (type == "niveau") {
        if (clicked == 'Niveau') { perso.niveau += 1; }
      }
      else if (type == "stat") {
        let statCliquee = perso.stats.find((stat: { nom: string, qte: number }) => stat.nom == clicked);
        if (statCliquee) { statCliquee.qte += 1; }
      }
      else if (type == "inventaire") {
        let objetClique = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == clicked);
        if (objetClique) { this.persoService.enleverXObjet(perso, objetClique.nom, 1); }
      }
      else if (type == "stuff") {
        let emplacementStuffConcerne = perso.stuff.find((emplacement: Equipement) => emplacement.emplacement == clicked);
        if (emplacementStuffConcerne) {
          let ok = this.persoService.ajouterXObjet(perso, emplacementStuffConcerne.objet, 1);
          if (ok) { emplacementStuffConcerne.objet = { "emplacement": '', "nom": '', "image": '', qte: 0, taux: 0, prix: 0 }; }
        }
      }
      gain = "";
    }

    return gain;
  }
}