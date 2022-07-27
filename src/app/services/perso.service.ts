import { Injectable } from '@angular/core';
import { Observable, Subject, timeout } from 'rxjs';
import { Entite, Equipement, ObjetInventaire, Tests } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PersoService {

  constructor() { }
  private clickInfosPersosSubject = new Subject<void>();

  clickInfosPersos() { this.clickInfosPersosSubject.next(); }
  listenClickInfosPersos() { return this.clickInfosPersosSubject.asObservable(); }

  enleverXObjet(perso: Entite, nomItem: string, x: number) {
    console.log("Enlever objet", perso.nom, nomItem, x);
    let itemDansInventaire = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == nomItem);
    if (itemDansInventaire) {
      itemDansInventaire.qte = itemDansInventaire.qte - x;
      if (itemDansInventaire.qte == 0) { this.supprimerObjet(perso, itemDansInventaire.nom); }
      return true;
    }
    return false;
  }

  ajouterXObjet(perso: Entite, item: ObjetInventaire, x: number) {
    console.log("Ajouter objet", perso.nom, item.nom, x);
    let emplacementVide = perso.inventaire.length < 18;
    let itemDansInventaire = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == item.nom);
    if (itemDansInventaire) {
      itemDansInventaire.qte = itemDansInventaire.qte + x;
      return true;
    }
    else if (emplacementVide) {
      perso.inventaire.push({ emplacement: item.emplacement, image: item.image, nom: item.nom, qte: x, taux: 0, prix: item.prix });
      return true;
    }
    return false;
  }

  supprimerObjet(perso: Entite, nomItem: string) {
    console.log("Supprimer objet", perso.nom, nomItem);
    let itemDansInventaire = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == nomItem);
    if (itemDansInventaire) {
      perso.inventaire.splice(perso.inventaire.indexOf(itemDansInventaire), 1);
      return true;
    }
    return false;
  }

}