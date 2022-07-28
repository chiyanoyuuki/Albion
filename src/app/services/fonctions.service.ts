import { Injectable } from '@angular/core';
import { Data, Entite, Equipement, ObjetInventaire, Position, Quete } from '../model';
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

  public getTop(data: Data, perso: Entite | Position) {
    if (perso instanceof Entite && perso.overrideY) { return perso.overrideY + "%"; }
    if (perso instanceof Entite && perso.joueur && perso.forme.overrideY) { return perso.forme.overrideY + "%"; }
    let scale = this.getScale(data, perso);
    return (scale > 1 ? scale * 20 + (scale < 0.5 ? 59 : 79) : '84') + 'px';
  }

  public getLeft(perso: Entite | Position) {
    if (perso instanceof Entite && perso.overrideX) { return perso.overrideX + '%'; }
    if (perso instanceof Entite && perso.joueur && perso.forme.overrideX) { return perso.forme.overrideX + "%"; }
    return '40%';
  }

  public getScale(data: Data, perso: Entite | Position) {
    let scale = 1;
    if (data.lieuActuel.scale) { scale = data.lieuActuel.scale; }
    if (data.lieuActuel.scaleFond) { scale = this.getNewScale(data, perso); }
    if (perso instanceof Entite && perso.forceDivScale) { scale = scale / perso.forceDivScale; }
    if (perso instanceof Entite && perso.joueur && perso.forme.forceDivScale) { scale = scale / perso.forme.forceDivScale; }
    return scale;
  }

  public getNewScale(data: Data, perso: Entite | Position) {
    let scale = data.lieuActuel.scale - data.lieuActuel.scaleFond;
    let finFond = 0;
    let height = data.mapHeight;
    if (data.lieuActuel.finFond) { finFond = data.lieuActuel.finFond; }
    height = height - finFond;
    let posYPerso = perso.y + 150;
    if (finFond != 0 && posYPerso < finFond) { scale = data.lieuActuel.scaleFond; }
    else {
      posYPerso = posYPerso - finFond;
      let div = height / posYPerso;
      scale = scale / div + data.lieuActuel.scaleFond;
    }
    return scale;
  }
}