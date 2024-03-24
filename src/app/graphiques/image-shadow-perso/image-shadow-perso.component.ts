import { Component, Input, OnInit } from '@angular/core';
import { Data, Entite } from 'src/app/model';
import { FonctionsService } from 'src/app/services/fonctions.service';

@Component({
  selector: 'app-image-shadow-perso',
  templateUrl: './image-shadow-perso.component.html',
  styleUrls: ['./image-shadow-perso.component.scss']
})
export class ImageShadowPersoComponent implements OnInit {

  @Input() data: Data;
  @Input() perso: Entite;

  constructor(private fonctionsService: FonctionsService) { }

  ngOnInit(): void {
  }

  public getTop(perso: Entite) { return this.fonctionsService.getTop(this.data, perso, undefined); }
  public getLeft(perso: Entite) { return this.fonctionsService.getLeft(perso, undefined); }
  public getScale(perso: Entite) { return this.fonctionsService.getScale(this.data, perso, undefined); }

  public isReverted() { return !this.perso.solo && Number(this.perso.nom.replace(/[^0-9]*/, "")) % 2 != 0; }
}
