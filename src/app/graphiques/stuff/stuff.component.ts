import { Component, Input, OnInit } from '@angular/core';
import { Data, Entite, Equipement } from 'src/app/model';
import { FonctionsService } from 'src/app/services/fonctions.service';

@Component({
  selector: 'app-stuff',
  templateUrl: './stuff.component.html',
  styleUrls: ['./stuff.component.scss']
})
export class StuffComponent implements OnInit {
  @Input() data: Data;
  @Input() perso: Entite;

  public gain: string;
  public objetActifStuff: Equipement | undefined;

  constructor(private fonctionsService: FonctionsService) { }

  ngOnInit(): void {
  }

  clickGain(perso: Entite, clicked: string, type: string) {
    this.gain = this.fonctionsService.clickGain(this.data, perso, clicked, this.gain, type, undefined);
  }

  getLeft(emplacement: Equipement) {
    let tmp = this.data.positionsStuff.find((position: { emplacement: string, x: number, y: number }) => position.emplacement == emplacement.emplacement);
    return tmp?.x + "px";
  }

  getTop(emplacement: Equipement) {
    let tmp = this.data.positionsStuff.find((position: { emplacement: string, x: number, y: number }) => position.emplacement == emplacement.emplacement);
    return tmp?.y + "px";
  }

  isEmplacementFocused(emplacement: Equipement) {
    return this.data.itemDragged != undefined && this.data.itemDragged.item.emplacement && this.data.itemDragged.item.emplacement != "" && emplacement.emplacement.startsWith(this.data.itemDragged.item.emplacement);
  }
}
