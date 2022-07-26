import { Component, Input, OnInit } from '@angular/core';
import { Data, Entite } from 'src/app/model';

@Component({
  selector: 'app-image-shadow-perso',
  templateUrl: './image-shadow-perso.component.html',
  styleUrls: ['./image-shadow-perso.component.scss']
})
export class ImageShadowPersoComponent implements OnInit {

  @Input() data: Data;
  @Input() perso: Entite;

  constructor() { }

  ngOnInit(): void {
  }

  public getTop(perso: Entite) {
    if (perso.overrideY) { return perso.overrideY + "%"; }
    if (perso.joueur && perso.forme.overrideY) { return perso.forme.overrideY + "%"; }
    let scale = this.getScale(perso);
    return (scale > 1 ? scale * 20 + (scale < 0.5 ? 59 : 79) : '84') + 'px';
  }

  public getLeft(perso: Entite) {
    if (perso.overrideX) { return perso.overrideX + '%'; }
    if (perso.joueur && perso.forme.overrideX) { return perso.forme.overrideX + "%"; }
    return '40%';
  }

  public getScale(perso: Entite) {
    let scale = 1;
    if (this.data.lieuActuel.scale) { scale = this.data.lieuActuel.scale; }
    if (this.data.lieuActuel.scaleFond) { scale = this.getNewScale(perso); }
    if (perso.forceDivScale) { scale = scale / perso.forceDivScale; }
    if (perso.joueur && perso.forme.forceDivScale) { scale = scale / perso.forme.forceDivScale; }
    return scale;
  }

  public getNewScale(perso: Entite) {
    let scale = this.data.lieuActuel.scale - this.data.lieuActuel.scaleFond;
    let map = document.getElementById("map");
    if (map) {
      let finFond = 0;
      let height = map.offsetHeight;
      if (this.data.lieuActuel.finFond) {
        finFond = this.data.lieuActuel.finFond;
      }
      height = height - finFond;
      let posYPerso = perso.y + 250;
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

  public isReverted() {
    return !this.perso.solo && Number(this.perso.nom.replace(/[^0-9]*/, "")) % 2 != 0;
  }

}
