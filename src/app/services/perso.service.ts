import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { Observable, Subject, timeout } from 'rxjs';
import { addEntity, Entite, Equipement, ObjetInventaire, Tests } from '../model';

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

  addEntity(data:Data, addEntite: addEntity) {
    let test = false;
    addEntite.entite.inventaire = [];
    if (addEntite.menuContextuel) {
      addEntite.entite.x = addEntite.menuContextuel.x;
      addEntite.entite.y = addEntite.menuContextuel.y;
    }else{
      addEntite.entite.x = 200;
      addEntite.entite.y = 200;
    }
    addEntite.entite.lieu = data.lieuActuel.id;

    if (addEntite.team == "Ami") { addEntite.entite.team = 0; }
    else if (addEntite.team == "Neutre") { addEntite.entite.team = 1; }
    else { addEntite.entite.team = 2; }

    if (!addEntite.entite.solo) {addEntite.entite.nom = this.getNomMonstre(data,addEntite.entite.nom);}
    if (addEntite.entite.loot)  {this.addLoot(data, addEntite.entite);}

    data.entites.push(addEntite.entite);
  }

  getNomMonstre(data:Data, nom:string)
  {
      let nb = 1;
      data.entites.forEach((entite: Entite) => {
        if (entite.nom.startsWith(nom)) { nb += 1; }
      });
      return nom + ' ' + ('0' + nb).slice(-2);
  }

  addLoot(data:Data, entite:Entite)
  {
    entite.loot.forEach((loot: ObjetInventaire) => 
    {
      if (loot.nom == "Argent") {
        let qte = Math.ceil(Math.random() * loot.qte);
        entite.inventaire.push({ nom: "Argent", image: "argent", qte: qte, emplacement: "", taux: 0, prix: 0 });
      }
      else 
      {
        let objet = data.objets.find((item: ObjetInventaire) => item.nom == loot.nom);
        if (objet) {
          let inventaire = entite.inventaire;
          if (!inventaire) { entite.inventaire = []; inventaire = entite.inventaire; }
          for (let i = 0; i < loot.qte; i++) {
            let objetPresent = inventaire.find((item: ObjetInventaire) => item.nom == loot.nom);
            let tmp = Math.random() * 100;
            if (tmp <= loot.taux) 
            {
              if (objetPresent) {objetPresent.qte += 1;}
              else {inventaire.push({ emplacement: objet.emplacement, image: objet.image, nom: objet.nom, qte: 1, taux: 0, prix: objet.prix });}
            }
          }
        }
      }
    });
  }

}