import { Component, Input, OnInit } from '@angular/core';
import { Quete, Data, Entite, Etape, ObjetInventaire, pnjQuete } from 'src/app/model';

@Component({
  selector: 'app-quete',
  templateUrl: './quete.component.html',
  styleUrls: ['./quete.component.scss']
})
export class QueteComponent implements OnInit {

  @Input() data: Data;
  @Input() perso: Entite;
  @Input() quetes: Quete[];

  public queteAccepter: string;
  constructor() { }

  ngOnInit(): void { }
  getSymbole(quete: Quete) {
    if (quete.etatQuete > 0) {
      return '?';
    } else {
      return '!';
    }
  }


  accepQuete() {
    if (this.data.focusQuete) {
      if (this.queteAccepter != this.data.focusQuete.quete.nom) {
        this.queteAccepter = this.data.focusQuete.quete.nom;
      } else if (this.queteAccepter == this.data.focusQuete.quete.nom) {
        this.data.quetes.push(this.data.focusQuete.quete);
        this.queteAccepter = '';
        this.data.focusQuete.quete.etatQuete = 1;
        let queteFocus = this.data.focusQuete;
        let nouvelleEtape = this.data.focusQuete.quete.etapes.find((etape: Etape) => etape.id == queteFocus.quete.etapeEnCours.id + 1);
        if (nouvelleEtape) {
          this.data.focusQuete.quete.etapeEnCours = nouvelleEtape;
          this.data.focusQuete = undefined;
        }
      }
    }
  }

  setQuete(quete: Quete) {
    this.data.focusQuete = { quete: quete, pnj: this.perso }
  }

  etapeSuivante() {
    let debug = true;
    let conditionRespectees = true;
    if (this.data.focusQuete) {
      let etape = this.data.focusQuete.quete.etapeEnCours;
      if (etape.objetsAAvoir) {
        let entitesPresentes = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.id);
        etape.objetsAAvoir.forEach((objet: ObjetInventaire) => {
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
          etape.objetsAAvoir.forEach((objet: ObjetInventaire) => {
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
        if (queteFocus.quete.etapes.length == queteFocus.quete.etapeEnCours.id) {
          let entitesJoueurPresentes = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.id);
          let emplacementVide = false;
          /* queteFocus.recompenses.forEach((objetRecompense: ObjetInventaire) => {
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
          }); */
          this.data.quetes.splice(this.data.quetes.indexOf(queteFocus.quete), 1);
          this.data.focusQuete = undefined;
        }
        if (queteFocus.quete.etapeEnCours.id < queteFocus.quete.etapes.length) {
          let nouvelleEtape = queteFocus.quete.etapes.find((etape: Etape) => etape.id == queteFocus.quete.etapeEnCours.id + 1);
          if (nouvelleEtape) {
            queteFocus.quete.etapeEnCours = nouvelleEtape;
            this.data.focusQuete = undefined;
          }
        }
      }
    }
  }

}
