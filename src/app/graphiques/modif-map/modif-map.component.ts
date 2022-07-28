import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Position, Data, Lieu } from 'src/app/model';
import { FonctionsService } from 'src/app/services/fonctions.service';

@Component({
  selector: 'app-modif-map',
  templateUrl: './modif-map.component.html',
  styleUrls: ['./modif-map.component.scss']
})
export class ModifMapComponent implements OnInit {
  @Input() data: Data;

  public input1: string = "1";
  public input2: string = "";
  public input3: string = "";

  public dummy: Position = { id: -1, x: 500, y: 500 };

  constructor(private fonctionsService: FonctionsService) { }
  ngOnInit(): void {
    if (this.data.lieuActuel.scale) { this.input1 = '' + this.data.lieuActuel.scale; }
    if (this.data.lieuActuel.scaleFond) { this.input2 = '' + this.data.lieuActuel.scaleFond; }
    if (this.data.lieuActuel.finFond) { this.input3 = '' + this.data.lieuActuel.finFond; }
  }

  positionDragEnd($event: CdkDragEnd, position: Position) {
    let tmp = $event.source.getFreeDragPosition();
    position.x = position.x + tmp.x;
    position.y = position.y + tmp.y;
    $event.source._dragRef.reset();
  }

  modifierMap() {
    let map = this.data.lieux.find((lieu: Lieu) => lieu.id == this.data.lieuActuel.id);
    if (map) {
      map.scale = Number(this.input1);
      map.scaleFond = Number(this.input2);
      map.finFond = Number(this.input3);
    }
    this.data.lieuActuel.scale = Number(this.input1);
    this.data.lieuActuel.scaleFond = Number(this.input2);
    this.data.lieuActuel.finFond = Number(this.input3);
    console.log(this.data.lieuActuel);
  }

  ajouterPosition(i: number) {
    let positions = this.data.lieuActuel.position_start;
    if (i == 1) {
      if (positions) {
        this.data.lieuActuel.position_start.push({ id: positions.length, x: 500, y: 500 });
      }
      else {
        this.data.lieuActuel.position_start = ([{ id: 0, x: 500, y: 500 }]);
      }
    }
    else {
      if (positions) {
        this.data.lieuActuel.position_start.pop();
      }
    }
  }

  public getTop(position: Position) { return this.fonctionsService.getTop(this.data, position); }
  public getScale(position: Position) { return this.fonctionsService.getScale(this.data, position); }

}
