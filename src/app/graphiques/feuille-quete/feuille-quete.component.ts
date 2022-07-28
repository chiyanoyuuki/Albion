import { Component, Input, OnInit } from '@angular/core';
import { ObjectExpression } from 'estree';
import { Data, Entite, ObjetInventaire, Quete } from 'src/app/model';

@Component({
  selector: 'app-feuille-quete',
  templateUrl: './feuille-quete.component.html',
  styleUrls: ['./feuille-quete.component.scss']
})
export class FeuilleQueteComponent implements OnInit {

  @Input() data: Data;
  @Input() ongletActif: string;

  public queteAccepter: string;
  public papierPris: string;

  constructor() { }

  ngOnInit(): void {
  }

  
  close() {
    this.data.focusQuete = null;
  }
  
  prendrePapier() {
    let entitesJoueur = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.parent);
    let emplacementVide = false;
    let stop = false;
    if (this.data.focusQuete) {
      if (this.papierPris != this.data.focusQuete.nom) {
        this.papierPris = this.data.focusQuete.nom;
      } else if (this.papierPris == this.data.focusQuete.nom) {
        if (entitesJoueur.length > 0) {
          entitesJoueur.forEach((entite: Entite) => {
            emplacementVide = entite.inventaire.length < 18;
            if (emplacementVide) {
              if (this.data.focusQuete) {
                if (!stop) {
                  entite.inventaire.push({ emplacement: "", image: "item_parchemin", nom: this.data.focusQuete.nom, qte: 1, taux: 0, prix: 1 });
                  this.data.focusQuete.tableauQuetes.affiche = false;
                  stop = true;
                }
              }
            }
          });
          this.data.focusQuete = null;
        }
      }
    }
  }
  accepQuete() {
    let entitesJoueur = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.parent);
    if (entitesJoueur.length > 0) {
      if (this.data.focusQuete) {
        if (this.queteAccepter != this.data.focusQuete.nom) {
          this.queteAccepter = this.data.focusQuete.nom;
        } else if (this.queteAccepter == this.data.focusQuete.nom) {
          this.queteAccepter = '';
          this.data.focusQuete.etatQuete = 1;
          this.data.focusQuete.accepte = true;
        }
      }
    }
  }

  inInventaire(nomObjet: string){
    let retour = false;
    let joueurs = this.data.entites.filter((perso: Entite) => perso.joueur);
    joueurs.forEach(joueur => {
      let objet = joueur.inventaire.find((objet: ObjetInventaire) => objet.nom == nomObjet);
      if (objet) {
        retour = true;
      }
    });
    return retour;
  }

}
