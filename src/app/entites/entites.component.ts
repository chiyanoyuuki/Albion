import { Entite, Data, MenuContextuel, Lieu, ObjetInventaire } from '../model';
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

  public quetePrincipale: any;
  public queteSecondaire: any;
  public quetes: any;
  public focus: any;
  public menuContextuel: MenuContextuel | undefined;
  public persoMenuContextuel: Entite | undefined;
  public ongletActif: string = "inventaire";
  public objetActif: ObjetInventaire | undefined;
  public formulaire: string;
  public quantite: string;
  public gain: string;
  public persoActuel: string;
  public nomPersoActuel: string;
  public lastPersoClicked: Entite | undefined;
  public mapHeight: number;

  constructor() { }

  ngOnInit(): void {

  }

  public dragEnd($event: CdkDragEnd, perso: Entite) {
    let tmp = $event.source.getFreeDragPosition();
    if (this.data.lieuActuel.parent == '') {
      perso.x = perso.x + tmp.x;
      perso.y = perso.y + tmp.y;;
    }
    else {
      perso.xcombat = perso.xcombat + tmp.x;
      perso.ycombat = perso.ycombat + tmp.y;
    }
    $event.source._dragRef.reset();
  }

  public isReverted(perso: Entite) {
    return !perso.solo && Number(perso.nom.replace(/[^0-9]*/, "")) % 2 != 0;
  }

  public getEntitesPresentes() {
    let retour: Entite[] = this.data.entites.filter((entite: Entite) => entite.lieu == this.data.lieuActuel.id);
    let familiersactifs: Entite[] = retour.filter((entite: Entite) => entite.team == 0 && entite.statutFamilier == 'affiche');
    familiersactifs.forEach((entite: Entite) => retour.push(entite.familier));
    return retour;
  }
  public getQuetePrincipale() {
    return this.quetePrincipale;
  }
  public getQueteSecondaire() {
    return this.queteSecondaire;
  }

  public clickPersoActuel(perso: Entite) {
    perso.actif = !perso.actif;
  }

  clicDroit(event: MouseEvent, perso: Entite) {
    this.focus = undefined;
    if (this.menuContextuel == undefined) {
      this.persoMenuContextuel = perso;
      this.menuContextuel = { x: event.offsetX, y: event.offsetY, type: "entite" };
    }
    else {
      this.persoMenuContextuel = undefined;
      this.menuContextuel = undefined;
    }

  }

  form(perso: Entite) {
    if (!this.quantite.match(/^-?[0-9]+$/g)) {
      return;
    }
    let quantiteNbr: number = Number(this.quantite);
    if (this.formulaire == 'gold') {
      perso.argent += quantiteNbr;
      if (perso.argent < 0) {
        perso.argent = 0;
      }
    } else if (this.formulaire == 'pv') {
      perso.pdv += quantiteNbr;
      if (perso.pdv > perso.pdvmax) {
        perso.pdv = perso.pdvmax;
      } else if (perso.pdv < 0) {
        perso.pdv = 0;
      }
    } else if (this.formulaire == 'mana') {
      perso.mana += quantiteNbr;
      if (perso.mana > perso.manamax) {
        perso.mana = perso.manamax;
      } else if (perso.mana < 0) {
        perso.mana = 0;
      }
    }
    this.formulaire = "";
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

  public getScale(perso: Entite) {
    let scale = 1;
    if (this.data.lieuActuel.scale) { scale = this.data.lieuActuel.scale; }
    if (this.data.lieuActuel.scaleFond) { scale = this.getNewScale(perso); }
    if (perso.forceDivScale) { scale = scale / perso.forceDivScale; }
    if (perso.joueur && perso.forme.forceDivScale) { scale = scale / perso.forme.forceDivScale; }
    return 'scale(' + scale + ')';
  }

  public getTop(perso: Entite) {
    if (perso.overrideY) { return perso.overrideY + "%"; }
    if (perso.joueur && perso.forme.overrideY) { return perso.forme.overrideY + "%"; }
    let scale = 1;
    if (this.data.lieuActuel.scale) { scale = this.data.lieuActuel.scale; }
    if (this.data.lieuActuel.scaleFond) { scale = this.getNewScale(perso); }
    if (perso.forceDivScale) { scale = scale / perso.forceDivScale; }
    if (perso.joueur && perso.forme.forceDivScale) { scale = scale / perso.forme.forceDivScale; }
    return (scale > 1 ? scale * 20 + (scale < 0.5 ? 59 : 79) : '84') + 'px';
  }

  public getLeft(perso: Entite) {
    if (perso.overrideX) { return perso.overrideX + '%'; }
    if (perso.joueur && perso.forme.overrideX) { return perso.forme.overrideX + "%"; }
    return '40%';
  }

  public getNewScale(perso: Entite) {
    let scale = this.data.lieuActuel.scale - this.data.lieuActuel.scaleFond;
    const map = document.getElementById("map");
    if (map) {
      if (this.mapHeight != map.offsetHeight) {
        this.mapHeight = map.offsetHeight;
      }
      let finFond = 0;
      let height = this.mapHeight;
      if (this.data.lieuActuel.finFond) {
        finFond = this.data.lieuActuel.finFond;
      }
      height = height - finFond;
      let posYPerso = perso.ycombat + 250;
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
