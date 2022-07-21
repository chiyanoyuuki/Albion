import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Data, Entite, Equipement, ObjetInventaire, Quete } from 'src/app/model';

@Component({
  selector: 'app-stats-personnage',
  templateUrl: './stats-personnage.component.html',
  styleUrls: ['./stats-personnage.component.scss']
})
export class StatsPersonnageComponent implements OnInit {

  @Input() data: Data;
  @Input() perso: Entite;
  @Output() closeForm = new EventEmitter<null>();

  public gain: string;
  public formulaire: string;
  public ongletActif: string = "inventaire";
  public objetActifInventaire: ObjetInventaire | undefined;
  public objetActifStuff: Equipement | undefined;
  public sortActif: { nom: string, image: string } | undefined;
  public quantite: string;
  public focus: boolean = false;
  public emplacementFocused: string;
  public itemDragged: string;
  public fenetreFocused: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  clickGain(perso: Entite, clicked: string) {
    if (this.gain != clicked) {
      this.gain = clicked;
    } else if (this.gain == clicked) {
      if (this.gain == "") { return }
      if (clicked == 'Niveau') {
        perso.niveau += 1;
      }
      let statCliquee = perso.stats.find((stat: { nom: string, qte: number }) => stat.nom == clicked);
      if (statCliquee) {
        statCliquee.qte += 1;
      }
      let objetClique = perso.inventaire.find((objet: ObjetInventaire) => objet.nom == clicked);
      if (objetClique) {
        objetClique.qte -= 1;
        if (objetClique.qte == 0) {
          perso.inventaire.splice(perso.inventaire.indexOf(objetClique), 1);
          perso.inventaire.push({ "emplacement": '', "nom": '', "image": '', qte: 0 });
        }
      }
      this.gain = "";
    }
  }

  clickGainStuff(perso: Entite, clicked: Equipement) {
    if (this.gain != clicked.objet.nom) {
      this.gain = clicked.objet.nom;
    } else if (this.gain == clicked.objet.nom) {
      if (this.gain == "") { return; }
      let objetDejaDansInventaire = this.perso.inventaire.find((objet: ObjetInventaire) => objet.nom == clicked.objet.nom);
      let emplacementLibre = this.perso.inventaire.find((objet: ObjetInventaire) => objet.nom == "");
      if (!objetDejaDansInventaire && !emplacementLibre) { return; }

      if (objetDejaDansInventaire) {
        objetDejaDansInventaire.qte += 1;
      }
      else {
        if (emplacementLibre) {
          emplacementLibre.emplacement = clicked.objet.emplacement;
          emplacementLibre.image = clicked.objet.image;
          emplacementLibre.nom = clicked.objet.nom;
          emplacementLibre.qte = 1;
        }
      }
      clicked.objet = { "emplacement": '', "nom": '', "image": '', qte: 0 };
      this.gain = "";
    }
  }

  getQuetesPrincipales() {
    return this.data.quetesprincipales.filter((quete: Quete) =>
      quete.perso == this.perso.nom || quete.perso == "Toute l'équipe"
    );
  }

  close() {
    this.closeForm.emit();
  }

  getLeft(emplacement: Equipement) {
    let tmp = this.data.positionsStuff.find((position: { emplacement: string, x: number, y: number }) => position.emplacement == emplacement.emplacement);
    return tmp?.x + "px";
  }

  getTop(emplacement: Equipement) {
    let tmp = this.data.positionsStuff.find((position: { emplacement: string, x: number, y: number }) => position.emplacement == emplacement.emplacement);
    return tmp?.y + "px";
  }

  public dragEnd($event: CdkDragEnd, item: ObjetInventaire) {
    let tmp = $event.source.getFreeDragPosition();

    const offsetsStart = document.getElementById(this.itemDragged)?.getBoundingClientRect();
    let offsetsEnd = document.getElementById(this.emplacementFocused)?.getBoundingClientRect();
    let offsetsEnd2;
    if (this.emplacementFocused == "Arme") {
      offsetsEnd = document.getElementById(this.emplacementFocused + '1')?.getBoundingClientRect();
      offsetsEnd2 = document.getElementById(this.emplacementFocused + '2')?.getBoundingClientRect();
    }

    if (offsetsStart && offsetsEnd) {
      const endLeft = offsetsStart.left + tmp.x + 20;
      const endTop = offsetsStart.top + tmp.y + 20;

      const posStartX = offsetsEnd.left;
      const posStartY = offsetsEnd.top;

      let finiDansEmplacement: boolean = false;
      let finiDansEmplacement1: boolean = false;
      let finiDansEmplacement2: boolean = false;

      if (offsetsEnd2) {
        const posStartX2 = offsetsEnd2.left;
        const posStartY2 = offsetsEnd2.top;
        finiDansEmplacement2 = endLeft >= posStartX2 && endLeft <= posStartX2 + 50 && endTop >= posStartY2 && endTop <= posStartY2 + 50;
      }
      finiDansEmplacement1 = endLeft >= posStartX && endLeft <= posStartX + 50 && endTop >= posStartY && endTop <= posStartY + 50;

      finiDansEmplacement = finiDansEmplacement1 || finiDansEmplacement2;

      if (finiDansEmplacement) {
        let emplacementVide = this.perso.inventaire.find((objet: ObjetInventaire) => objet.nom == "");
        let stuffConcerne = this.perso.stuff.find((stuff: Equipement) =>
        (stuff.emplacement == this.emplacementFocused ||
          (stuff.emplacement == "Arme1" && this.emplacementFocused == "Arme" && finiDansEmplacement1) ||
          (stuff.emplacement == "Arme2" && this.emplacementFocused == "Arme" && finiDansEmplacement2)));
        let ancienStuff = Object.assign({}, stuffConcerne);

        if ((emplacementVide || (!emplacementVide && item.qte == 1)) && ancienStuff.objet.nom != item.nom) {
          if (stuffConcerne) {
            stuffConcerne.objet = item;
            let objetDansInventaire = this.perso.inventaire.find((objet: ObjetInventaire) => objet.nom == item.nom);
            if (objetDansInventaire) {
              objetDansInventaire.qte -= 1;
              if (objetDansInventaire.qte == 0) {
                this.perso.inventaire.splice(this.perso.inventaire.indexOf(objetDansInventaire), 1);
                this.perso.inventaire.push({ "emplacement": '', "nom": '', "image": '', qte: 0 });
              }
            }

            if (ancienStuff.objet.nom != "") {
              let objetDejaDansInventaire = this.perso.inventaire.find((objet: ObjetInventaire) => objet.nom == ancienStuff.objet.nom);
              if (objetDejaDansInventaire) {
                objetDejaDansInventaire.qte += 1;
              }
              else {

                let emplacementLibre = this.perso.inventaire.find((objet: ObjetInventaire) => objet.nom == "");
                if (emplacementLibre) {
                  emplacementLibre.emplacement = ancienStuff.objet.emplacement;
                  emplacementLibre.image = ancienStuff.objet.image;
                  emplacementLibre.nom = ancienStuff.objet.nom;
                  emplacementLibre.qte = 1;
                }
              }
            }
          }
        }
      }
    }
    $event.source._dragRef.reset();
    this.emplacementFocused = "";
  }

  public dragStart(item: ObjetInventaire) {
    this.emplacementFocused = item.emplacement;
    this.itemDragged = item.nom;
  }

  public isEmplacementFocused(emplacement: Equipement) {
    return this.emplacementFocused != "" && emplacement.emplacement.startsWith(this.emplacementFocused);
  }
}
