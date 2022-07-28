import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Position, Data, Lieu } from 'src/app/model';

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

  public dummy: Position = { id: -1, startX: 500, startY: 500 };

  constructor() { }
  ngOnInit(): void {
    if (this.data.lieuActuel.scale) { this.input1 = '' + this.data.lieuActuel.scale; }
    if (this.data.lieuActuel.scaleFond) { this.input2 = '' + this.data.lieuActuel.scaleFond; }
    if (this.data.lieuActuel.finFond) { this.input3 = '' + this.data.lieuActuel.finFond; }
  }

  positionDragEnd($event: CdkDragEnd, position: Position) {
    let tmp = $event.source.getFreeDragPosition();
    position.startX = position.startX + tmp.x;
    position.startY = position.startY + tmp.y;
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
        this.data.lieuActuel.position_start.push({ id: positions.length, startX: 500, startY: 500 });
      }
      else {
        this.data.lieuActuel.position_start = ([{ id: 0, startX: 500, startY: 500 }]);
      }
    }
    else {
      if (positions) {
        this.data.lieuActuel.position_start.pop();
      }
    }
  }

  public getTop(position: Position) {
    let scale = 1;
    scale = this.getScale(position);
    return (scale > 1 ? scale * 20 + (scale < 0.5 ? 59 : 79) : '84') + 'px';
  }

  public getScale(position: Position) {
    let scale = 1;
    if (this.data.lieuActuel.scale) { scale = this.data.lieuActuel.scale; }
    if (this.data.lieuActuel.scaleFond) { scale = this.getNewScale(position); }
    return scale;
  }

  public getNewScale(position: Position) {
    let scale = this.data.lieuActuel.scale - this.data.lieuActuel.scaleFond;
    let map = document.getElementById("map");
    if (map) {
      let finFond = 0;
      let height = map.offsetHeight;
      if (this.data.lieuActuel.finFond) {
        finFond = this.data.lieuActuel.finFond;
      }
      height = height - finFond;
      let posYPerso = position.startY + 250;
      if (finFond != 0 && posYPerso < this.data.lieuActuel.finFond) {
        scale = this.data.lieuActuel.scaleFond;
      }
      else {
        posYPerso = posYPerso - finFond;
        let div = height / posYPerso;
        scale = scale / div + this.data.lieuActuel.scaleFond;
      }
    }
    return scale;
  }

}
