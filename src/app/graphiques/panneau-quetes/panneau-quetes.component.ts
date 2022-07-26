import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnInit, Input } from '@angular/core';
import { Quete, Data, Entite } from 'src/app/model';

@Component({
  selector: 'app-panneau-quetes',
  templateUrl: './panneau-quetes.component.html',
  styleUrls: ['./panneau-quetes.component.scss']
})
export class PanneauQuetesComponent implements OnInit {

  @Input() data: Data;

  public queteAccepter: string;
  public focusQuete: Quete | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  getQuetes() {
    return this.data.quetes.filter((quete: Quete) => quete.tableauQuetes && quete.tableauQuetes.affiche);
  }

  endDragQuete($event: CdkDragEnd, quete: Quete) {
    let tmp = $event.source.getFreeDragPosition();
    quete.tableauQuetes.x = quete.tableauQuetes.x + tmp.x;
    quete.tableauQuetes.y = quete.tableauQuetes.y + tmp.y;
    $event.source._dragRef.reset();
  }
  dragStart(quete: Quete) {
    let quetes = this.getQuetes();
    let taille = quetes.length;
    quetes.forEach((quete: Quete) => {
      quete.tableauQuetes.zIndex = quete.tableauQuetes.zIndex - 1;
      if (quete.tableauQuetes.zIndex < 0) {
        quete.tableauQuetes.zIndex = 0;
      }
    });
    quete.tableauQuetes.zIndex = taille;
  }
  voirQuete(quete: Quete) {
    this.focusQuete = quete;
  }
  close() {
    this.focusQuete = undefined;
  }
  prendrePapier() {
    let entitesJoueur = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.parent);
    let emplacementVide = false;
    let stop = false;
    entitesJoueur.forEach((entite: Entite) => {
      emplacementVide = entite.inventaire.length < 18;
      if (emplacementVide) {
        if (this.focusQuete) {
          if (!stop) {
            entite.inventaire.push({ emplacement: "", image: "item_parchemin", nom: this.focusQuete.nom, qte: 1, taux: 0, prix: 1 });
            this.focusQuete.tableauQuetes.affiche = false;
            stop = true;
          }
        }
      }
    });
    this.focusQuete = undefined;
  }
  accepQuete() {
    let entitesJoueur = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.parent);
    if (entitesJoueur.length > 0) {
      if (this.focusQuete) {
        if (this.queteAccepter != this.focusQuete.nom) {
          this.queteAccepter = this.focusQuete.nom;
        } else if (this.queteAccepter == this.focusQuete.nom) {
          this.queteAccepter = '';
          this.focusQuete.etatQuete = 1;
          this.focusQuete.accepte = true;
        }
      }
    }
  }

}
