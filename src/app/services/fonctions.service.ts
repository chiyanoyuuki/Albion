import { Injectable } from '@angular/core';
import { Boutique, Data, Entite, Equipement, ObjetInventaire, Position, Quete } from '../model';
import { PersoService } from './perso.service';

@Injectable({
  providedIn: 'root'
})
export class FonctionsService {

  constructor(private persoService: PersoService) { }

  clickGain(data: Data, perso: Entite, clicked: string, gain: string, type: string, boutique: Boutique | undefined) {
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
        if (quete) { data.focusQuete = { quete: quete, pnj: undefined }; }
        else {
          let objetClique = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == clicked);
          if (objetClique) {
            this.persoService.enleverXObjet(perso, objetClique.nom, 1);
          }
        }
      }
      else if (type == "stuff") {
        let emplacementStuffConcerne = perso.stuff.find((emplacement: Equipement) => emplacement.emplacement == clicked);
        if (emplacementStuffConcerne) {
          let ok = this.persoService.ajouterXObjet(data, perso, emplacementStuffConcerne.objet, 1);
          if (ok) { emplacementStuffConcerne.objet = { "emplacement": '', "nom": '', "image": '', qte: 0, taux: 0, prix: 0 }; }
        }
      }
      else if (type == "vente" && boutique) {
        let objetClique = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == clicked);
        if (objetClique) {
          this.persoService.enleverXObjet(perso, objetClique.nom, 1);
          let objetPresentBoutique = boutique.objets.find((objet: ObjetInventaire) => objet.nom == clicked);
          if (objetPresentBoutique) { objetPresentBoutique.qte += 1; }
          else {
            boutique.objets.push({ "emplacement": objetClique.emplacement, "nom": objetClique.nom, "image": objetClique.image, qte: 1, prix: objetClique.prix * 1.5, taux: 0 });
          }
          perso.argent = perso.argent + this.getPrix(objetClique.prix);
        }
      }
      else if (type == "achat" && boutique) {
        if (gain == "") { return "" }
        let objetClique = boutique.objets.find((objet: ObjetInventaire) => objet.nom == clicked);
        if (objetClique) {
          if (perso.argent < objetClique.prix) { return "" }
          objetClique.qte -= 1;
          if (objetClique.qte == 0) { boutique.objets.splice(boutique.objets.indexOf(objetClique), 1); }

          let res = this.persoService.ajouterXObjet(data, perso, objetClique, 1);
          if (res) { perso.argent -= objetClique.prix; }
        }
      }
      gain = "";
    }

    return gain;
  }

  public getPrix(prix: number) {
    if (prix > 1) { prix = Math.floor(prix / 1.5); }
    return prix;
  }

  public getTop(data: Data, perso: Entite | undefined, position: Position | undefined) {
    if (perso instanceof Entite && perso.overrideY) { return perso.overrideY + "%"; }
    if (perso instanceof Entite && perso.joueur && perso.forme.overrideY) { return perso.forme.overrideY + "%"; }
    let scale = this.getScale(data, perso, position);
    return (scale > 1 ? scale * 20 + (scale < 0.5 ? 59 : 79) : '84') + 'px';
  }

  public getLeft(perso: Entite | undefined, position: Position | undefined) {
    if (perso && perso.overrideX) { return perso.overrideX + '%'; }
    if (perso && perso.joueur && perso.forme.overrideX) { return perso.forme.overrideX + "%"; }
    return '40%';
  }

  public getScale(data: Data, perso: Entite | undefined, position: Position | undefined) {
    let scale = 1;
    if (data.lieuActuel.scale) { scale = data.lieuActuel.scale; }
    if ((perso || position) && data.lieuActuel.scaleFond) { scale = this.getNewScale(data, perso, position); }
    if (perso && perso.forceDivScale) { scale = scale / perso.forceDivScale; }
    if (perso && perso.joueur && perso.forme.forceDivScale) { scale = scale / perso.forme.forceDivScale; }
    return scale;
  }

  public getNewScale(data: Data, perso: Entite | undefined, position: Position | undefined) {
    let scale;
    let height = data.mapHeight;
    let finFond = 0;
    let pieds = 0;

    if (data.lieuActuel.finFond) { finFond = data.lieuActuel.finFond; }
    if (perso) { pieds = perso.y + 150; }
    else if (position) { pieds = position.y + 150; }

    if (pieds <= finFond) { scale = data.lieuActuel.scaleFond; }
    else if (pieds >= height - 150) { scale = data.lieuActuel.scale; }
    else {
      let marge = (height - 150) - finFond;
      scale = ((pieds - finFond) / marge) * (data.lieuActuel.scale - data.lieuActuel.scaleFond) + data.lieuActuel.scaleFond;
    }
    return scale;
  }
}