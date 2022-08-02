import { Component, Input, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { pnjQuete, Quete } from 'src/app/model';

@Component({
  selector: 'app-suivi-quetes',
  templateUrl: './suivi-quetes.component.html',
  styleUrls: ['./suivi-quetes.component.scss']
})
export class SuiviQuetesComponent implements OnInit {
  @Input() data: Data;

  constructor() { }
  ngOnInit(): void { }

  getQuetes(type: string) {
    let quetes: Quete[] = [];
    quetes = this.data.quetes.filter((quete: Quete) => quete.type == type && quete.etapeEnCours);
    return quetes;
  }

  getObjectifs(quete: Quete) {
    let objectifs: string[] = [];
    let etape = quete.etapeEnCours;
    if (etape) {
      if (etape.pnjsAVoir) { etape.pnjsAVoir.forEach((pnj: pnjQuete) => objectifs.push("Parler à " + pnj.nom + " " + (pnj.vu ? "1" : "0") + "/1")); }
    }
    return objectifs;
  }
}
