import { Component, Input, OnInit } from '@angular/core';
import { Data, Entite, Quete } from 'src/app/model';

@Component({
  selector: 'app-feuille-quete',
  templateUrl: './feuille-quete.component.html',
  styleUrls: ['./feuille-quete.component.scss']
})
export class FeuilleQueteComponent implements OnInit {

  @Input() data: Data;
  @Input() focusQuete: Quete | undefined;
  @Input() ongletActif: string;

  public queteAccepter: string;
  public papierPris: string;

  constructor() { }

  ngOnInit(): void {
  }

  
  close() {
    this.focusQuete = undefined;
  }
  
  prendrePapier() {
    let entitesJoueur = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.parent);
    let emplacementVide = false;
    let stop = false;
    if (this.focusQuete) {
      if (this.papierPris != this.focusQuete.nom) {
        this.papierPris = this.focusQuete.nom;
      } else if (this.papierPris == this.focusQuete.nom) {
        if (entitesJoueur.length > 0) {
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
      }
    }
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
