import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Entite, ObjetInventaire } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PersoService {

  constructor() {}
  private clickInfosPersosSubject = new Subject<void>();

  clickInfosPersos() { this.clickInfosPersosSubject.next(); }
  listenClickInfosPersos() { return this.clickInfosPersosSubject.asObservable(); }

  enleverXObjet(perso:Entite, nomItem:string, x:number){
    let itemDansInventaire = perso.inventaire.find((objet:ObjetInventaire)=>objet.nom==nomItem);
    if(itemDansInventaire)
    {
      itemDansInventaire.qte = itemDansInventaire.qte - x;
      if(itemDansInventaire.qte == 0){this.supprimerObjet(perso,itemDansInventaire.nom);}
    }
  }

  supprimerObjet(perso:Entite, nomItem:string){
    let itemDansInventaire = perso.inventaire.find((objet:ObjetInventaire)=>objet.nom==nomItem);
    if(itemDansInventaire)
    {
      perso.inventaire = perso.inventaire.splice(perso.inventaire.indexOf(itemDansInventaire),1);
    }
  }

}