import { Injectable } from '@angular/core';
import { Boutique, Data, Entite, Equipement, ObjetInventaire, Quete } from '../model';
import { PersoService } from './perso.service';

@Injectable({
  providedIn: 'root'
})
export class FonctionsService {

  constructor(private persoService: PersoService) { }

  clickGain(data: Data, perso: Entite, clicked: string, gain: string, type: string, boutique: Boutique|undefined) {
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
        let quete = data.quetes.find((quete: Quete) => quete.nom == clicked);
        if (quete) {
          data.focusQuete = quete;
        }else{
          let objetClique = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == clicked);
          if (objetClique) { 
            this.persoService.enleverXObjet(perso, objetClique.nom, 1); 
          }
        }
      }
      else if (type == "stuff") {
        let emplacementStuffConcerne = perso.stuff.find((emplacement: Equipement) => emplacement.emplacement == clicked);
        if (emplacementStuffConcerne) {
          let ok = this.persoService.ajouterXObjet(perso, emplacementStuffConcerne.objet, 1);
          if (ok) { emplacementStuffConcerne.objet = { "emplacement": '', "nom": '', "image": '', qte: 0, taux: 0, prix: 0 }; }
        }
      }
      else if (type == "boutique"&&boutique) {
        console.log('boutique');
        
        let objetClique = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == clicked);
        if (objetClique) { 
          this.persoService.enleverXObjet(perso, objetClique.nom, 1);
          let objetPresentBoutique = boutique.objets.find((objet: ObjetInventaire) => objet.nom == clicked);
          if (objetPresentBoutique) {
            objetPresentBoutique.qte += 1;
          } else {
            boutique.objets.push({ "emplacement": objetClique.emplacement, "nom": objetClique.nom, "image": objetClique.image, qte: 1, prix: objetClique.prix * 1.5, taux: 0 });
          }
          perso.argent += objetClique.prix;
        }
      }
      gain = "";
    }

    return gain;
  }
}