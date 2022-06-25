import { Component, OnInit } from '@angular/core';
import { Data, Entite, Lieu } from './model';
import * as DATA from '../assets/data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public data: any = DATA;

  ngOnInit() {
    //Verifications
    //Entites non placées===================================================================
    const lieux: Lieu[] = this.data.lieux;
    let persos: string[] = [];
    lieux.forEach((lieu: Lieu) => {
      if (lieu.personnagesActuels) { lieu.personnagesActuels.forEach((id: string) => persos.push(id)); }
    });
    //Personnages
    const persosManquants: Entite[] = this.data.personnages.filter((perso: Entite) =>
      !persos.includes(perso.id)
    );
    if (persosManquants.length > 0) { console.warn("Des personnages principaux ne sont pas placés !"); persosManquants.forEach(p => console.log(p.id)); }
    //Amis
    const amisManquants: Entite[] = this.data.amisActuels.filter((perso: Entite) =>
      !persos.includes(perso.id)
    );
    if (amisManquants.length > 0) { console.warn("Des amis ne sont pas placés !"); amisManquants.forEach(p => console.log(p.id)); }
  }

  majFromChild(newData: Data) {
    this.data = newData;
  }
}