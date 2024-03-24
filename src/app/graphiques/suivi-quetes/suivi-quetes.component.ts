import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { pnjQuete, Quete } from 'src/app/model';

@Component({
  selector: 'app-suivi-quetes',
  templateUrl: './suivi-quetes.component.html',
  styleUrls: ['./suivi-quetes.component.scss'],
  animations: [
    trigger('openClose', [
      state('opened', style({ width: '300px', border: '3px ridge #202020', padding: '15px' })),
      state('closed', style({ width: '0px', border: 'unset', padding: '0px' })),
      transition('opened <=> closed', [animate('0.2s')])
    ]),
  ],
})
export class SuiviQuetesComponent implements OnInit {
  @Input() data: Data;

  public isOpen: boolean = true;
  constructor() { }
  ngOnInit(): void { }

  getQuetes(type: string) {
    let quetes: Quete[] = [];
    quetes = this.data.quetes.filter((quete: Quete) => (quete.type == type && quete.etapeEnCours) && !quete.accomplie);
    return quetes;
  }

  getObjectifs(quete: Quete) {
    let objectifs: string[] = [];
    let etape = quete.etapeEnCours;
    if (etape) {
      if (etape.objectif) { return [etape.objectif + " " + (etape.nbObjectif ? etape.objectifActuel + "/" + etape.nbObjectif : "")]; }
      if (etape.pnjsAVoir) { etape.pnjsAVoir.forEach((pnj: pnjQuete) => objectifs.push("Parler à " + pnj.nom + " " + (pnj.vu ? "1" : "0") + "/1")); }
    }
    return objectifs;
  }
}
