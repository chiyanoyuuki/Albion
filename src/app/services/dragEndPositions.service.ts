import { Injectable } from '@angular/core';
import { Data, Entite, Equipement, ObjetInventaire, Tests } from '../model';
import { PersoService } from './perso.service';

@Injectable({
  providedIn: 'root'
})
export class DragEndPositionsService {

  constructor(private persoService: PersoService) { }

  finiChezPerso(entite: Entite, xDragEnd: number, yDragEnd: number, emplacementFocused: string) {
    let finiDansInventaireAutrePerso: Entite | undefined;
    let finiDansStuffAutrePerso: Entite | undefined;
    let finiDansEmplacement1: boolean = false;
    let finiDansEmplacement2: boolean = false;
    if (this.finiDansZone("inventaire" + entite.nom, xDragEnd, yDragEnd, 450, 100)) { finiDansInventaireAutrePerso = entite; }
    if (emplacementFocused == "Arme") {
      finiDansEmplacement1 = this.finiDansZone(entite.nom + emplacementFocused + '1', xDragEnd, yDragEnd, 50, 50);
      if (finiDansEmplacement1) { finiDansStuffAutrePerso = entite; }
      finiDansEmplacement2 = this.finiDansZone(entite.nom + emplacementFocused + '2', xDragEnd, yDragEnd, 50, 50);
      if (finiDansEmplacement2) { finiDansStuffAutrePerso = entite; }
    }
    else {
      if (this.finiDansZone(entite.nom + emplacementFocused, xDragEnd, yDragEnd, 50, 50)) { finiDansStuffAutrePerso = entite; }
    }
    return { finiDansInventaireAutrePerso, finiDansStuffAutrePerso, finiDansEmplacement1, finiDansEmplacement2 };
  }

  finiDansZone(nomZone: string, xDragEnd: number, yDragEnd: number, tailleXZone: number, tailleYZone: number) {
    let finiDansZone = false;
    let zone = document.getElementById(nomZone)?.getBoundingClientRect();
    if (zone) {
      const leftZone = zone.left;
      const topZone = zone.top;
      finiDansZone = xDragEnd >= leftZone && xDragEnd <= leftZone + tailleXZone && yDragEnd >= topZone && yDragEnd <= topZone + tailleYZone;
    }
    return finiDansZone;
  }

  dragFromPersoInvToPersoStuff(data: Data, persoDebut: Entite, persoFin: Entite, emplacementFocused: string, tests: Tests, item: ObjetInventaire) {
    if (item.nom == "Argent") { return; }
    console.log("Drag from " + persoDebut.nom + " inventaire to " + persoFin.nom + " stuff :", emplacementFocused, item.nom);
    let emplacementVide = persoFin.inventaire.length < 18;
    let emplacementStuffConcerne = persoFin.stuff.find((stuff: Equipement) => (stuff.emplacement == emplacementFocused ||
      (stuff.emplacement == "Arme1" && emplacementFocused == "Arme" && tests.finiDansEmplacement1) ||
      (stuff.emplacement == "Arme2" && emplacementFocused == "Arme" && tests.finiDansEmplacement2)));
    let ancienItemEmplacement = Object.assign({}, emplacementStuffConcerne);

    let objetDansInventaireFin = persoFin.inventaire.find((objet: ObjetInventaire) => objet.nom == ancienItemEmplacement.objet.nom);
    if (emplacementVide || (!emplacementVide && item.qte == 1 && persoDebut == persoFin) || objetDansInventaireFin) {
      if (emplacementStuffConcerne) {
        emplacementStuffConcerne.objet = { emplacement: item.emplacement, image: item.image, nom: item.nom, qte: 1, taux: 0, prix: item.prix };
        this.persoService.enleverXObjet(persoDebut, item.nom, 1);
        if (ancienItemEmplacement.objet.nom != "") { this.persoService.ajouterXObjet(data, persoFin, ancienItemEmplacement.objet, 1); }
      }
    }
  }

  dragFromPersoInvToPersoInv(data: Data, persoDebut: Entite, persoFin: Entite, item: ObjetInventaire, qte: number) {
    if (persoDebut == persoFin) { return; }
    console.log("Drag from " + persoDebut.nom + " inventaire to " + persoFin.nom + " inventaire :", item.nom, qte);
    let ok = this.persoService.ajouterXObjet(data, persoFin, item, qte);
    if (ok) { this.persoService.enleverXObjet(persoDebut, item.nom, qte); }

  }
}