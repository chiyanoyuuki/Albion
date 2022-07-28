import { Component, Input, OnInit } from '@angular/core';
import { Quete, Data, Entite, Etape, ObjetInventaire } from 'src/app/model';

@Component({
  selector: 'app-quete',
  templateUrl: './quete.component.html',
  styleUrls: ['./quete.component.scss']
})
export class QueteComponent implements OnInit {

  @Input() data: Data;
  @Input() perso: Entite;

  public queteAccepter: string;
  public quetesEnCours: Quete[];
  constructor() { }

  ngOnInit(): void {
    this.quetesEnCours = this.data.quetes.filter((quete: Quete) =>
      quete.etapeEnCours.pnj == this.perso.nom
    );
  }
  getSymbole(quete: Quete){
    if (quete.etatQuete > 0) {
      return '?';
    }else{
      return '!';
    }
  }


  accepQuete() {
    if (this.data.focusQuete) {
      if (this.queteAccepter != this.data.focusQuete.nom) {
        this.queteAccepter = this.data.focusQuete.nom;
      } else if (this.queteAccepter == this.data.focusQuete.nom) {
        this.data.quetes.push(this.data.focusQuete);
        this.queteAccepter = '';
        this.data.focusQuete.etatQuete = 1;
        this.data.focusQuete.accepte = true;
        let queteFocus = this.data.focusQuete;
        let nouvelleEtape = this.data.focusQuete.etapes.find((etape: Etape) => etape.id == queteFocus.etapeEnCours.id + 1);
        if (nouvelleEtape) {
          this.data.focusQuete.etapeEnCours = nouvelleEtape;
          this.data.focusQuete = null;
        }
      }
    }
  }

  etapeSuivante() {
    let debug = true;
    let conditionRespectees = true;
    if (this.data.focusQuete) {
      let etape = this.data.focusQuete.etapeEnCours;
      if (etape.objets) {
        let entitesPresentes = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.id);
        etape.objets.forEach((objet: ObjetInventaire) => {
          if (conditionRespectees) {
            let nb = 0;
            entitesPresentes.forEach((entite: Entite) => {
              if (nb < objet.qte) {
                let objetDansInventaire = entite.inventaire.find((objetATrouver: ObjetInventaire) => objetATrouver.nom == objet.nom);
                if (objetDansInventaire) {
                  nb += objetDansInventaire.qte;
                }
              }
            });
            if (nb < objet.qte) {
              conditionRespectees = false;
            }
          }
        });
        if (conditionRespectees) {
          etape.objets.forEach((objet: ObjetInventaire) => {
            let nb = objet.qte;
            entitesPresentes.forEach((entite: Entite) => {
              if (nb > 0) {
                let objetDansInventaire = entite.inventaire.find((objetATrouver: ObjetInventaire) => objetATrouver.nom == objet.nom)
                if (objetDansInventaire) {
                  if (objetDansInventaire.qte >= nb) {
                    objetDansInventaire.qte -= nb;
                    nb = 0;
                    if (objetDansInventaire.qte == 0) {
                      entite.inventaire.splice(entite.inventaire.indexOf(objetDansInventaire), 1);
                    }
                  } else {
                    nb -= objetDansInventaire.qte;
                    entite.inventaire.splice(entite.inventaire.indexOf(objetDansInventaire), 1);
                  }
                }
              }
            });
          });
        }
      }
      if (conditionRespectees) {
        let queteFocus = this.data.focusQuete;
        if (queteFocus.etapes.length == queteFocus.etapeEnCours.id) {
          let entitesJoueurPresentes = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.id);
          let emplacementVide = false;
          queteFocus.recompenses.forEach((objetRecompense: ObjetInventaire) => {
            entitesJoueurPresentes.forEach((entite: Entite) => {
              let itemDejaDansInventaire = entite.inventaire.find((objetDansInventaire: ObjetInventaire) => objetDansInventaire.nom == objetRecompense.nom);
              if (itemDejaDansInventaire) {
                if (debug) console.log('Objet deja dans inventaire de' + entite.nom);
                itemDejaDansInventaire.qte += objetRecompense.qte;
              }
              else {
                if (debug) console.log('Objet pas dans inventaire');
                emplacementVide = entite.inventaire.length < 18;
                if (emplacementVide) {
                  if (debug) console.log('Emplacement vide trouvé chez ' + entite.nom);
                  entite.inventaire.push({ emplacement: objetRecompense.emplacement, image: objetRecompense.image, nom: objetRecompense.nom, qte: objetRecompense.qte, taux: 0, prix: objetRecompense.prix });
                }
              }
            });
          });
          this.data.quetes.splice(this.data.quetes.indexOf(queteFocus), 1);
          this.data.focusQuete = null;
        }
        if (queteFocus.etapeEnCours.id < queteFocus.etapes.length) {
          let nouvelleEtape = queteFocus.etapes.find((etape: Etape) => etape.id == queteFocus.etapeEnCours.id + 1);
          if (nouvelleEtape) {
            queteFocus.etapeEnCours = nouvelleEtape;
            this.data.focusQuete = null;
          }
        }
      }
    }
  }

}
