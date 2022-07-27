import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addEntity, Data, Entite, Etape, Lieu, MenuContextuel, ObjetInventaire, Position, Quete } from '../model';
import { of } from 'rxjs';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { PersoService } from '../services/perso.service';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-menu-contextuel',
  templateUrl: './menu-contextuel.component.html',
  styleUrls: ['./menu-contextuel.component.scss']
})

export class MenuContextuelComponent implements OnInit {

  @Input() data: Data;
  @Input() menu: MenuContextuel;
  @Input() perso: Entite;

  private setting = { element: { dynamicDownload: null as unknown as HTMLElement } }

  public fenetre: string = "";
  public objetSelected: ObjetInventaire;
  public monsterLevelSelected: { niveau: number, pdvmax: number, manamax: number } | undefined = undefined;
  public delete: string = "Supprimer";

  public alphabet: string[];


  public focus: Entite | undefined;
  public objetFocus: ObjetInventaire | undefined;
  public add: boolean = false;

  public quete: boolean = false;
  public nbrQuetes: number;
  public focusQuete: Quete | undefined;
  public queteAccepter: string;

  //Inputs
  public input1: string = "1";
  public input2: string = "1";
  public input3: string = "1";

  //Admin add item / loot
  public choixTypeObjet = "Ajouter un loot";
  public addObjet: boolean = false;
  public emplacements: string[] = ["Tête", "Torse", "Gants", "Jambes", "Bottes", "Arme", "Utilitaire", "Collier", "Epaulieres", "Ceinture", "Anneau"];
  public emplacementSelected: string = "";
  public letterSelected: string = "";

  //Modifier Map
  public modifMap: boolean;

  constructor(private persoService: PersoService, private appService: AppService) { }

  ngOnInit(): void {
  }

  deletion() {
    if (this.delete == "Supprimer") { this.delete = "Confirmer suppression"; }
    else { this.data.entites.splice(this.data.entites.indexOf(this.perso), 1); }
  }

  close() { this.appService.closeMenuContextuel(); }

  clickLierFamilier() {
    if (this.perso.statutFamilier == 'lie') { this.perso.statutFamilier = '' }
    else {
      this.perso.statutFamilier = 'lie'
    }
    this.close();
  }

  clickAfficherFamilier() {
    if (this.perso.statutFamilier == 'affiche') { this.perso.statutFamilier = '' }
    else {
      if (this.data.lieuActuel.id == 'map') {
        this.perso.familier.x = this.perso.x + 50;
        this.perso.familier.y = this.perso.y;
      }
      else {
        this.perso.familier.x = this.perso.x + 50;
        this.perso.familier.y = this.perso.y;
      }
      this.perso.statutFamilier = 'affiche'
    }
    this.close();
  }

  getQuetes() {
    let quetesEnCours = this.data.quetes.filter((quete: Quete) =>
      quete.etapeEnCours.pnj == this.perso.nom
    );
    if (quetesEnCours.length > 0) {
      this.nbrQuetes = quetesEnCours.length;
      return quetesEnCours;
    } else {
      return [];
    }
  }

  accepQuete() {
    if (this.focusQuete) {
      if (this.queteAccepter != this.focusQuete.nom) {
        this.queteAccepter = this.focusQuete.nom;
      } else if (this.queteAccepter == this.focusQuete.nom) {
        this.data.quetes.push(this.focusQuete);
        this.queteAccepter = '';
        this.focusQuete.etatQuete = 1;
        this.focusQuete.accepte = true;
        let queteFocus = this.focusQuete;
        let nouvelleEtape = this.focusQuete.etapes.find((etape: Etape) => etape.id == queteFocus.etapeEnCours.id + 1);
        if (nouvelleEtape) {
          this.focusQuete.etapeEnCours = nouvelleEtape;
          this.focusQuete = undefined;
        }
      }
    }
  }

  etapeSuivante() {
    let debug = true;
    let conditionRespectees = true;
    if (this.focusQuete) {
      let etape = this.focusQuete.etapeEnCours;
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
        let queteFocus = this.focusQuete;
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
          this.focusQuete = undefined;
        }
        if (queteFocus.etapeEnCours.id < queteFocus.etapes.length) {
          let nouvelleEtape = queteFocus.etapes.find((etape: Etape) => etape.id == queteFocus.etapeEnCours.id + 1);
          if (nouvelleEtape) {
            queteFocus.etapeEnCours = nouvelleEtape;
            this.focusQuete = undefined;
          }
        }
      }
    }
  }

  repos() {
    let persosTeam = this.data.entites.filter((entite: Entite) => entite.joueur);
    persosTeam.forEach((perso: Entite) => {
      perso.pdv = perso.pdvmax;
      perso.mana = perso.manamax
    });
    this.data.repos.lance = true;
    setTimeout(() => {
      this.data.repos.animation = true;
      setTimeout(() => {
        this.data.repos.stop = true;
        setTimeout(() => {
          this.data.repos.stop = false;
          this.data.repos.animation = false;
          this.data.repos.lance = false;
        }, 1000);
      }, 4000);
    }, 1000);
  }

  //SAUVEGARDE

  public sauvegarde() {
    this.fakeValidateUserData().subscribe((res: any) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: 'AlbionSave.json',
        text: JSON.stringify(res)
      });
    });
  }

  private fakeValidateUserData() {
    let sauvegarde = JSON.stringify(this.data);
    return of(sauvegarde);
  }



  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }
}