import { Component, Input, OnInit } from '@angular/core';
import { ObjectExpression } from 'estree';
import { Data, Entite, Etape, ObjetInventaire, pnjQuete, Quete } from 'src/app/model';
import { AppService } from 'src/app/services/app.service';
import { PersoService } from 'src/app/services/perso.service';

@Component({
  selector: 'app-feuille-quete',
  templateUrl: './feuille-quete.component.html',
  styleUrls: ['./feuille-quete.component.scss']
})
export class FeuilleQueteComponent implements OnInit {

  @Input() data: Data;
  @Input() ongletActif: string;

  public quete: Quete;
  public queteEnCours: boolean;

  public papierPris: string;
  public recompenses: ObjetInventaire[];

  constructor(private appService: AppService, private persosService: PersoService) { }

  ngOnInit(): void {
    if (this.data.focusQuete) { this.quete = this.data.focusQuete.quete; }
    if (this.quete.etapeEnCours) { this.queteEnCours = true; }
    this.recompenses = this.getRecompenses();
    if (this.data.focusQuete && this.data.focusQuete.pnj && this.queteEnCours) {
      let pnj = this.data.focusQuete.pnj;
      let pnjconcerne = this.quete.etapeEnCours.pnjsAVoir.find((pnjQuete: pnjQuete) => pnjQuete.nom == pnj.nom);
      if (pnjconcerne) {
        pnjconcerne.vu = true;
        if (pnjconcerne.recompenses) {
          let peuxRecupererObjets: boolean = this.peuxRecupererObjets(pnjconcerne.recompenses);
          if (peuxRecupererObjets) {
            this.donnerObjets(pnjconcerne.recompenses);
          }
        }
        let objectifsAccomplis = true;
        this.quete.etapeEnCours.pnjsAVoir.forEach((pnjQuete: pnjQuete) => {
          if (!pnjQuete.vu) objectifsAccomplis = false;
        })
        if (objectifsAccomplis) { this.etapeSuivante(); }
      }
    }
  }

  donnerObjets(objetsRecompense: ObjetInventaire[]) {
    let persosSurMap = this.persosService.joueursPresentsInLieu(this.data);
    if (persosSurMap && persosSurMap.length > 0) {
      persosSurMap.forEach((perso: Entite) => {
        if (objetsRecompense) {
          objetsRecompense.forEach((objet: ObjetInventaire) => {
            let resultat = this.persosService.ajouterXObjet(this.data, perso, objet, objet.qte);
            if (resultat) {
              objetsRecompense.splice(objetsRecompense.indexOf(objet), 1);
            }
          })

        }
      });
    }
  }

  peuxRecupererObjets(objetsRecompense: ObjetInventaire[]) {
    let objets: ObjetInventaire[] = [];
    objetsRecompense.forEach((objet: ObjetInventaire) => { if (objet.nom != "Argent") { objets.push(Object.assign({}, objet)) } });
    if (objets.length == 0) { return true; }
    let nbrObjets = objets.length;
    let emplacementsLibres = 0;
    let persosSurMap = this.persosService.joueursPresentsInLieu(this.data);
    if (persosSurMap && persosSurMap.length > 0) {
      persosSurMap.forEach((perso: Entite) => {
        if (emplacementsLibres < nbrObjets) {
          emplacementsLibres += 18 - perso.inventaire.length;
          if (emplacementsLibres < nbrObjets) {
            objets.forEach((objet: ObjetInventaire) => {
              if (perso.inventaire.find((obj: ObjetInventaire) => obj.nom == objet.nom)) {
                objets.splice(objets.indexOf(objet), 1);
                nbrObjets = nbrObjets - 1;
              }
            })
          }
        }
      })
    }
    return emplacementsLibres > nbrObjets;
  }

  etapeSuivante() {
    console.log("etape suivante");
    if (this.data.focusQuete) {
      let pnj = this.data.focusQuete.pnj as Entite;
      let pnjconcerne = this.quete.etapeEnCours.pnjsAVoir.find((pnjQuete: pnjQuete) => pnjQuete.nom == pnj.nom);
      let recompenses = this.data.focusQuete.quete.etapeEnCours.recompenses;
      if (pnjconcerne && pnjconcerne.recompenses) {
        let peuxRecupererObjets: boolean = this.peuxRecupererObjets(pnjconcerne.recompenses);
        if (peuxRecupererObjets) {
          this.donnerObjets(pnjconcerne.recompenses);
        }
      }
      if (recompenses) {
        let peuxRecupererObjets: boolean = this.peuxRecupererObjets(recompenses);
        if (peuxRecupererObjets) {
          this.donnerObjets(recompenses);
        }
      }
    }
    let id = this.quete.etapeEnCours.id;
    let nouvelleEtape = this.quete.etapes.find((etape: Etape) => etape.id == id + 1);
    if (nouvelleEtape) { this.quete.etapeEnCours = nouvelleEtape; }
    else { this.finirQuete(); }
  }

  finirQuete() {
    console.log("fin quête");
    this.quete.accomplie = true;
  }


  close() {
    this.data.focusQuete = undefined;
  }

  prendrePapier() {
    let entitesJoueur = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.parent);
    let emplacementVide = false;
    let stop = false;
    if (this.papierPris != this.quete.nom) {
      this.papierPris = this.quete.nom;
    } else if (this.papierPris == this.quete.nom) {
      if (entitesJoueur.length > 0) {
        entitesJoueur.forEach((entite: Entite) => {
          emplacementVide = entite.inventaire.length < 18;
          if (emplacementVide) {
            if (!stop) {
              entite.inventaire.push({ emplacement: "", image: "item_parchemin", nom: this.quete.nom, qte: 1, taux: 0, prix: 1 });
              this.quete.tableauQuetes.affiche = false;
              stop = true;
            }
          }
        });
        this.data.focusQuete = undefined;
      }
    }

  }
  accepQuete() {
    this.quete.etapeEnCours = this.quete.etapes[0];
    this.queteEnCours = true;
    this.data.focusQuete = undefined;
    this.appService.closeMenuContextuel(false);
  }

  inInventaire(nomObjet: string) {
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

  getRecompenses() {
    let retour: ObjetInventaire[] = [];
    if (this.quete.etapes) {
      if (this.quete.etapeEnCours) {
        let etape = this.quete.etapeEnCours;
        if (this.data.focusQuete && etape.pnjsAVoir) {
          let pnjactuel = this.data.focusQuete.pnj as Entite;
          if (pnjactuel) {
            let pnjQuete = etape.pnjsAVoir.find((pnj: pnjQuete) => pnj.nom == pnjactuel.nom);
            if (pnjQuete && pnjQuete.recompenses) {
              console.log(pnjQuete.recompenses);
              retour = pnjQuete.recompenses;
            }
          }
        }
        let recompenses = this.quete.etapeEnCours.recompenses;
        if (recompenses) { retour = recompenses; }
      }
      else {
        let recompenses = this.quete.etapes[this.quete.etapes.length - 1].recompenses;
        if (recompenses) { retour = recompenses; }
      }
    }

    return retour;
  }

  getImageRecompense(objet: ObjetInventaire) {
    return this.data.objets.find((obj: ObjetInventaire) => obj.nom == objet.nom)?.image;
  }

  getDescription() {
    let retour = "";
    if (this.queteEnCours) {
      retour = this.quete.etapeEnCours.description;
      if (this.data.focusQuete && this.data.focusQuete.pnj) {
        let pnj = this.data.focusQuete.pnj;
        let pnjconcerne = this.quete.etapeEnCours.pnjsAVoir.find((pnjQuete: pnjQuete) => pnjQuete.nom == pnj.nom);
        if (pnjconcerne) {
          if (pnjconcerne.dialogue) { retour = pnjconcerne.dialogue; }
        }
      }
    }
    else { retour = this.quete.description; }

    return retour;
  }

}
