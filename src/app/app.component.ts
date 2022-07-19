import { Component, OnInit } from '@angular/core';
import { Entite, Lieu } from './model';
import DATA from '../assets/data.json';
import { HttpClient } from '@angular/common/http';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public data: any = DATA;

  constructor(private appService: AppService) {
    this.appService.getPersonnages().subscribe(res => console.log(res));
  }

  ngOnInit() {
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      console.log("cond");
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });
    document.oncontextmenu = function () {
      return false;
    }

    console.log(this.data);
    //Verifications
    //Entites non placées==================================================================
    const lieux: Lieu[] = this.data.lieux;
    let persos: string[] = [];
    lieux.forEach((lieu: Lieu) => {
      if (lieu.personnagesActuels) { lieu.personnagesActuels.forEach((nom: string) => persos.push(nom)); }
    });
    //Personnages de l'équipe
    const persosManquants: Entite[] = this.data.equipe.filter((perso: Entite) =>
      !persos.includes(perso.nom)
    );
    if (persosManquants.length > 0) { console.warn("Des personnages de l'équipe ne sont pas placés !"); persosManquants.forEach(p => console.log(p.nom)); }
    //Pnjs Neutres
    const amisManquants: Entite[] = this.data.pnjsNeutres.filter((perso: Entite) =>
      !persos.includes(perso.nom)
    );
    if (amisManquants.length > 0) { console.warn("Des PNJs neutres ne sont pas placés !"); amisManquants.forEach(p => console.log(p.nom)); }
    //PersonnagesActuels non définie pour un lieu===================================================================
    let manquePersonnagesActuels: string[] = [];
    lieux.forEach((lieu: Lieu) => {
      if (!lieu.personnagesActuels) { manquePersonnagesActuels.push(lieu.id); }
    });
    if (manquePersonnagesActuels.length > 0) { console.warn("Des lieux n'ont pas de personnagesActuels !"); manquePersonnagesActuels.forEach(p => console.log(p)); }
    //Points d'entrée non définis pour un lieu===================================================================
    let manqueEntrees: string[] = [];
    lieux.forEach((lieu: Lieu) => {
      if (lieu.entreex == undefined) { manqueEntrees.push(lieu.id); }
    });
    if (manqueEntrees.length > 0) { console.warn("Des lieux n'ont pas de points d'entrée !"); manqueEntrees.forEach(p => console.log(p)); }
  }
}