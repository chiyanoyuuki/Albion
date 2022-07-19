import { Entite, Data, MenuContextuel, Lieu, ObjetInventaire } from '../model';
import { Component, DoCheck, HostListener, Input, OnInit } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

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
      perso.ycombat = perso.ycombat + tmp.y;;
    }
    $event.source._dragRef.reset();
  }

  public isReverted(perso: Entite) {
    return !perso.solo && Number(perso.nom.replace(/[^0-9]*/, "")) % 2 != 0;
  }

  public getEntitesPresentes() {
    return this.data.entites.filter((entite: Entite) => entite.lieu == this.data.lieuActuel.id);
  }
  public getQuetePrincipale() {
    return this.quetePrincipale;
  }
  public getQueteSecondaire() {
    return this.queteSecondaire;
  }

  public getScale() {
    return 'scale(' + this.data.lieuActuel.scale ? this.data.lieuActuel.scale : 1 + ')';
  }


  public clickPerso(perso: Entite) {

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

  public majFromChild() {
    let entite = this.persoMenuContextuel;
    if (!entite) { return }
    this.data.entites.splice(this.data.entites.indexOf(entite), 1);
    this.persoMenuContextuel = undefined;
    this.menuContextuel = undefined;
    this.majMap();
  }

  majMap() {
    let location = this.data.lieux.find((l: Lieu) => l.id == this.data.lieuActuel.id);
    location = this.data.lieuActuel;
  }
}
