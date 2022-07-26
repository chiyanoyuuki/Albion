import { Entite, Data, MenuContextuel, Lieu, ObjetInventaire, Position } from '../model';
import { Component, DoCheck, HostListener, Input, OnInit } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';

@Component({
  selector: 'app-entites',
  templateUrl: './entites.component.html',
  styleUrls: ['./entites.component.scss']
})
export class EntitesComponent implements OnInit {

  @Input() data: Data;

  public menuContextuel: MenuContextuel | undefined;
  public persoMenuContextuel: Entite | undefined;
  public lastPersoClicked: Entite | undefined;
  public gain: string;

  constructor() { }
  ngOnInit(): void { }

  public dragEnd($event: CdkDragEnd, perso: Entite) {
    let tmp = $event.source.getFreeDragPosition();
    perso.x = perso.x + tmp.x;
    perso.y = perso.y + tmp.y;
    $event.source._dragRef.reset();
  }



  public getEntitesPresentes() {
    let retour: Entite[] = this.data.entites.filter((entite: Entite) => entite.lieu == this.data.lieuActuel.id);
    let familiersactifs: Entite[] = retour.filter((entite: Entite) => entite.team == 0 && entite.statutFamilier == 'affiche');
    familiersactifs.forEach((entite: Entite) => retour.push(entite.familier));
    return retour;
  }

  clicDroit(event: MouseEvent, perso: Entite) {
    if (this.menuContextuel == undefined) {
      this.persoMenuContextuel = perso;
      this.menuContextuel = { x: event.offsetX, y: event.offsetY, type: "entite" };
    }
    else {
      this.persoMenuContextuel = undefined;
      this.menuContextuel = undefined;
    }
  }

  clickGain(perso: Entite, clicked: string) {
    if (this.gain != clicked) {
      this.gain = clicked;
    } else if (this.gain == clicked) {
      if (clicked == 'Niveau') {
        perso.niveau += 1;
      }
      perso.stats.forEach(element => {
        if (element.nom == clicked) {
          element.qte += 1;
        }
      });
      perso.inventaire.forEach(element => {
        if (element.nom == clicked) {
          element.qte -= 1;
          let item = perso.inventaire.find(objet => objet.nom == clicked);
          if (element.qte == 0) {
            if (item) {
              item.nom = "";
              item.image = "";
            }
          } else if (item && element.qte < 0) {
            item.qte = 0;
          }
        }
      });
      this.gain = "";
    }
  }

  public delete() {
    let entite = this.persoMenuContextuel;
    if (!entite) { return }
    this.data.entites.splice(this.data.entites.indexOf(entite), 1);
    this.persoMenuContextuel = undefined;
    this.menuContextuel = undefined;
  }

  public checkIfDisable() {
    this.lastPersoClicked = undefined;
  }
}
