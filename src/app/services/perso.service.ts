import { Injectable } from '@angular/core';
import { Observable, Subject, timeout } from 'rxjs';
import { addEntity, Data, Entite, Equipement, Lieu, ObjetInventaire, pnjQuete, Quete, Tests } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PersoService {

  constructor() { }
  private clickInfosPersosSubject = new Subject<void>();

  clickInfosPersos() { this.clickInfosPersosSubject.next(); }
  listenClickInfosPersos() { return this.clickInfosPersosSubject.asObservable(); }

  getItemInventoryByName(perso: Entite, nomItem: string) { return perso.inventaire.find((objet: ObjetInventaire) => objet.nom == nomItem); }
  getItemByName(data: Data, nomItem: string) { return data.objets.find((objet: ObjetInventaire) => nomItem == objet.nom); }

  enleverXObjet(perso: Entite, nomItem: string, x: number) {
    console.log("Enlever objet", perso.nom, nomItem, x);
    let itemDansInventaire = this.getItemInventoryByName(perso, nomItem);
    if (itemDansInventaire) {
      itemDansInventaire.qte = itemDansInventaire.qte - x;
      if (itemDansInventaire.qte == 0) { this.supprimerObjet(perso, itemDansInventaire.nom); }
      return true;
    }
    return false;
  }

  ajouterXObjet(data: Data, perso: Entite, itemToAdd: ObjetInventaire, x: number) {
    console.log("Ajouter objet", perso.nom, itemToAdd.nom, x);
    if (itemToAdd.nom == "Argent") { perso.argent += x; return true; }
    let item = this.getItemByName(data, itemToAdd.nom);
    if (item) {
      let emplacementVide = perso.inventaire.length < 18;
      let itemDansInventaire = this.getItemInventoryByName(perso, itemToAdd.nom);
      if (itemDansInventaire) {
        itemDansInventaire.qte = itemDansInventaire.qte + x;
        return true;
      }
      else if (emplacementVide) {
        perso.inventaire.push({ emplacement: item.emplacement, image: item.image, nom: item.nom, qte: x, taux: 0, prix: item.prix });
        return true;
      }
    }
    return false;
  }

  supprimerObjet(perso: Entite, nomItem: string) {
    console.log("Supprimer objet", perso.nom, nomItem);
    let itemDansInventaire = this.getItemInventoryByName(perso, nomItem);
    if (itemDansInventaire) {
      perso.inventaire.splice(perso.inventaire.indexOf(itemDansInventaire), 1);
      return true;
    }
    return false;
  }

  addEntity(data: Data, addEntite: addEntity) {
    addEntite.entite.inventaire = [];
    if (addEntite.menuContextuel) {
      addEntite.entite.x = addEntite.menuContextuel.x;
      addEntite.entite.y = addEntite.menuContextuel.y;
    } else {
      addEntite.entite.x = 200;
      addEntite.entite.y = 200;
    }
    addEntite.entite.lieu = data.lieuActuel.id;

    if (addEntite.team == "Ami") { addEntite.entite.team = 0; }
    else if (addEntite.team == "Neutre") { addEntite.entite.team = 1; }
    else { addEntite.entite.team = 2; }

    if (!addEntite.entite.solo) { addEntite.entite.nom = this.getNomMonstre(data, addEntite.entite.nom); }
    if (addEntite.entite.loot) { this.addLoot(data, addEntite.entite); }

    data.entites.push(addEntite.entite);
  }

  getNomMonstre(data: Data, nom: string) {
    let nb = 1;
    data.entites.forEach((entite: Entite) => {
      if (entite.nom.startsWith(nom)) { nb += 1; }
    });
    return nom + ' ' + ('0' + nb).slice(-2);
  }

  addLoot(data: Data, entite: Entite) {
    entite.loot.forEach((loot: ObjetInventaire) => {
      if (loot.nom == "Argent") {
        let qte = Math.ceil(Math.random() * loot.qte);
        entite.inventaire.push({ nom: "Argent", image: "argent", qte: qte, emplacement: "", taux: 0, prix: 0 });
      }
      else {
        let objet = this.getItemByName(data, loot.nom);
        if (objet) {
          let inventaire = entite.inventaire;
          if (!inventaire) { entite.inventaire = []; inventaire = entite.inventaire; }
          for (let i = 0; i < loot.qte; i++) {
            let objetPresent = inventaire.find((item: ObjetInventaire) => item.nom == loot.nom);
            let tmp = Math.random() * 100;
            if (tmp <= loot.taux) {
              if (objetPresent) { objetPresent.qte += 1; }
              else { inventaire.push({ emplacement: objet.emplacement, image: objet.image, nom: objet.nom, qte: 1, taux: 0, prix: objet.prix }); }
            }
          }
        }
      }
    });
  }

  joueursPresentsInLieu(data: Data) {
    let persos = data.entites.filter((perso: Entite) => perso.joueur && perso.lieu == data.lieuActuel.id);
    return persos;
  }

  peutDonnerQuetes(data: Data, perso: Entite) {
    let persosSurMap = data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == data.lieuActuel.id).length;
    let quetes = data.quetes.filter((quete: Quete) =>
      persosSurMap > 0 &&
      this.conditionsValidees(data, quete) &&
      ((quete.donneur == perso.nom && !quete.accomplie && !quete.etapeEnCours) ||
        (quete.etapeEnCours
          && quete.etapeEnCours.pnjsAVoir
          && quete.etapeEnCours.pnjsAVoir.find((pnjQuete: pnjQuete) => pnjQuete.nom == perso.nom && !pnjQuete.vu)))
    );
    return quetes;
  }

  conditionsValidees(data: Data, quete: Quete) {
    let retour = true;
    if (quete.conditionQuete) {
      retour = false;
      let condition = quete.conditionQuete;
      let idquete = condition.substring(0, condition.lastIndexOf("_"));
      let etapequete = (Number)(condition.substring(condition.lastIndexOf("_") + 1));

      let conditionquete = data.quetes.find((q: Quete) => q.id == idquete);
      if (conditionquete) {
        let etape = conditionquete.etapeEnCours;
        if (etape) {
          if (etape.id >= etapequete || conditionquete.accomplie) { retour = true; }
        }
      }
    }
    return retour;
  }

}