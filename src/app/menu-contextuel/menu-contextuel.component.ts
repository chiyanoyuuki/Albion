import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addEntity, Data, Entite, Etape, MenuContextuel, ObjetInventaire, Quete } from '../model';
import { of } from 'rxjs';

@Component({
  selector: 'app-menu-contextuel',
  templateUrl: './menu-contextuel.component.html',
  styleUrls: ['./menu-contextuel.component.scss']
})
export class MenuContextuelComponent implements OnInit {

  @Input() data: Data;
  @Input() menu: MenuContextuel;
  @Input() perso: Entite;

  @Output() addEntityEvent = new EventEmitter<addEntity>();
  @Output() deleteEntityEvent = new EventEmitter<string>();
  @Output() closeEvent = new EventEmitter<null>();


  private setting = { element: { dynamicDownload: null as unknown as HTMLElement } }
  public letterSelected: string = "";
  public levelSelected: number = 0;
  public typeSelected: string | undefined = undefined;
  public teamSelected: string = "Neutre";
  public entitySelected: Entite;
  public objetSelected: ObjetInventaire;
  public monsterLevelSelected: { niveau: number, pdvmax: number, manamax: number } | undefined = undefined;
  public delete: string = "Supprimer";

  public alphabet: string[];
  public levels: number[];
  public types: string[] = ["PNJS", "Monstres"];
  public teams: string[] = ["Ami", "Neutre", "Ennemi"];

  public focus: Entite | undefined;
  public objetFocus: ObjetInventaire | undefined;
  public add: boolean = false;

  public quete: boolean = false;
  public nbrQuetes: number;
  public focusQuete: Quete | undefined;
  public queteAccepter: string;

  //Admin add item / loot
  public choixTypeObjet = "Ajouter un loot";
  public taux: string = "50";
  public quantite: string = "1";
  public addObjet: boolean = false;
  public emplacements: string[] = ["Tête", "Torse", "Gants", "Jambes", "Bottes", "Arme", "Utilitaire", "Collier", "Epaulieres", "Ceinture", "Anneau"];
  public emplacementSelected: string = "";

  constructor() { }

  ngOnInit(): void {
    this.levels = Array.from({ length: 9 }, (_, i) => i + 1);
    let alpha = Array.from(Array(26)).map((e, i) => i + 65);
    this.alphabet = alpha.map((x) => String.fromCharCode(x));
    this.entitySelected = this.getEntitesPossibles()[0];
    this.entitySelected.team = 1;
    this.objetSelected = this.getObjetsPossibles()[0];
  }

  getEntitesPossibles() {
    let entitesPossibles: Entite[] = this.data.pnjs.filter((entitePossible: Entite) =>
      !this.data.entites.some((entitePresente: Entite) => entitePresente.nom == entitePossible.nom && entitePresente.solo)
    );

    if (this.typeSelected == "PNJS") { entitesPossibles = entitesPossibles.filter((entite: Entite) => entite.solo); }
    else if (this.typeSelected == "Monstres") { entitesPossibles = entitesPossibles.filter((entite: Entite) => !entite.solo); }

    if (this.letterSelected != "") { entitesPossibles = entitesPossibles.filter((entite: Entite) => entite.nom.startsWith(this.letterSelected)); }
    if (this.levelSelected != 0) { entitesPossibles = entitesPossibles.filter((entite: Entite) => entite.niveau == this.levelSelected); }

    entitesPossibles = entitesPossibles.sort((a: Entite, b: Entite) => {
      return a.nom > b.nom ? 1 : -1;
    });

    return entitesPossibles;
  }

  getObjetsPossibles() {
    let objetsPossibles: ObjetInventaire[] = this.data.objets;

    if (this.letterSelected != "") { objetsPossibles = objetsPossibles.filter((objet: ObjetInventaire) => objet.nom.startsWith(this.letterSelected)); }
    if (this.emplacementSelected != "") { objetsPossibles = objetsPossibles.filter((objet: ObjetInventaire) => objet.emplacement == this.emplacementSelected); }

    objetsPossibles = objetsPossibles.sort((a: ObjetInventaire, b: ObjetInventaire) => {
      return a.nom > b.nom ? 1 : -1;
    });

    return objetsPossibles;
  }

  clickEntite(entite: Entite) {
    if (this.entitySelected == undefined || this.entitySelected.nom != entite.nom) {
      let entiteTmp = Object.assign({}, entite);
      if (entite.levels) {
        this.monsterLevelSelected = entite.levels[0];
      }
      if (this.teamSelected == "Ami") { entiteTmp.team = 0; }
      else if (this.teamSelected == "Neutre") { entiteTmp.team = 1; }
      else { entiteTmp.team = 2; }
      this.entitySelected = entiteTmp;
      return;
    }
  }

  addEntity() {
    const addEntity: addEntity = { entite: this.entitySelected, menuContextuel: this.menu, team: this.teamSelected };
    this.addEntityEvent.emit(addEntity);
  }

  addItem() {
    let item = this.objetSelected;
    this.quantite = this.quantite.replace(/[^0-9]*/g, "");
    let qte = Number(this.quantite);
    if (this.choixTypeObjet == "Ajouter un objet") {
      let objetDejaDansInventaire = this.perso.inventaire.find((obj: ObjetInventaire) => obj.nom == item.nom);
      if (item.nom == "Argent") {
        this.perso.argent += qte;
      }
      else {
        if (objetDejaDansInventaire) {
          objetDejaDansInventaire.qte += qte;
        }
        else if (this.perso.inventaire.length < 18) {
          this.perso.inventaire.push({ emplacement: item.emplacement, image: item.image, nom: item.nom, prix: item.prix, qte: qte, taux: item.taux });
        }
      }
    }
    else {
      let pnj = this.data.pnjs.find((entite: Entite) => this.perso.nom.startsWith(entite.nom));
      if (pnj) {
        let loot = pnj.loot;
        this.taux = this.taux.replace(/[^0-9]*/g, "");
        let tx = Number(this.taux);
        let item = {
          emplacement: this.objetSelected.emplacement,
          image: this.objetSelected.image,
          nom: this.objetSelected.nom,
          prix: this.objetSelected.prix,
          qte: qte,
          taux: tx
        };
        if (!loot || (loot && loot.length == 0)) {
          pnj.loot = [item];
        }
        else {
          let objetDejaDansLoot = loot.find((obj: ObjetInventaire) => obj.nom == item.nom);
          if (objetDejaDansLoot) {
            objetDejaDansLoot.qte = qte;
            objetDejaDansLoot.taux = tx;
          }
          else {
            pnj.loot.push(item);
          }
        }
      }

    }
  }

  clickLoot(objet: ObjetInventaire) {
    this.objetSelected = objet;
    this.taux = '' + objet.taux;
    this.quantite = '' + objet.qte
  }

  deleteLoot() {
    let pnj = this.data.pnjs.find((entite: Entite) => this.perso.nom.startsWith(entite.nom));
    if (pnj) {
      if (pnj.loot) {
        let objetDejaDansLoot = pnj.loot.find((obj: ObjetInventaire) => obj.nom == this.objetSelected.nom);
        if (objetDejaDansLoot) {
          pnj.loot.splice(pnj.loot.indexOf(objetDejaDansLoot), 1);
        }
      }
    }
  }

  deletion() {
    if (this.delete == "Supprimer") { this.delete = "Confirmer suppression"; }
    else {
      this.deleteEntityEvent.emit();
    }
  }

  close() {
    this.closeEvent.emit();
  }

  clickMonsterLevel(level: { niveau: number, pdvmax: number, manamax: number }) {
    this.monsterLevelSelected = level;
    if (this.entitySelected) {
      this.entitySelected.niveau = level.niveau;
      this.entitySelected.pdvmax = level.pdvmax;
      this.entitySelected.pdv = level.pdvmax;
      this.entitySelected.manamax = level.manamax;
      this.entitySelected.mana = level.manamax;
    }
  }

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
        this.perso.familier.xcombat = this.perso.x + 50;
        this.perso.familier.ycombat = this.perso.y;
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
    if (this.focusQuete) {
      let etape = this.focusQuete.etapeEnCours;
      console.log(etape.nom);
      if (etape.objets) {
        let entitesPresentes = this.data.entites.filter((entite: Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.id);
        let conditionRespectees = true;
        etape.objets.forEach((objet: ObjetInventaire) => {
          if (conditionRespectees) {
            console.log('conditionRespectees 1');
            let nb = 0;
            entitesPresentes.forEach((entite: Entite) => {
              if (nb < objet.qte) {
                console.log('nb < objet.qte 1');
                console.log(objet.nom);
                let objetDansInventaire = entite.inventaire.find((objetATrouver: ObjetInventaire) => objetATrouver.nom == objet.nom);
                if (objetDansInventaire) {
                  console.log('objetDansInventaire 1');
                  nb += objetDansInventaire.qte;
                }
              }
            });
            if (nb < objet.qte) {
              console.log('nb < objet.qte 2');
              conditionRespectees = false;
            }
          }
        });
        if (conditionRespectees) {
          console.log('conditionRespectees 2');
          etape.objets.forEach((objet: ObjetInventaire) => {
            let nb = objet.qte;
            entitesPresentes.forEach((entite: Entite) => {
              if (nb > 0) {
                let objetDansInventaire = entite.inventaire.find((objetATrouver: ObjetInventaire) => objetATrouver.nom == objet.nom)
                if (objetDansInventaire) {
                  console.log('objetDansInventaire 2');
                  if (objetDansInventaire.qte >= nb) {
                    objetDansInventaire.qte -= nb;
                    console.log(objetDansInventaire.qte);
                    nb = 0;
                    if (objetDansInventaire.qte = 0) {
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
      let queteFocus = this.focusQuete;
      if (queteFocus.etapes.length == queteFocus.etapeEnCours.id) {
        this.data.quetes.splice(this.data.quetes.indexOf(queteFocus), 1);
        this.focusQuete = undefined;
      }
      if (queteFocus.etapeEnCours.id < queteFocus.etapes.length) {
        console.log('this.focusQuete.etapeEnCours.id < this.focusQuete.etapes.length');
        let nouvelleEtape = queteFocus.etapes.find((etape: Etape) => etape.id == queteFocus.etapeEnCours.id + 1);
        if (nouvelleEtape) {
          console.log('nouvelleEtape');
          queteFocus.etapeEnCours = nouvelleEtape;
          this.focusQuete = undefined;
        }
      }
    }
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

  public clickTeam(equipe: string) {
    this.teamSelected = equipe;
    if (equipe == "Ami") { this.entitySelected.team = 0; }
    else if (equipe == "Neutre") { this.entitySelected.team = 1; }
    else { this.entitySelected.team = 2; }
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

  getLoot() {
    let loot: ObjetInventaire[] = [];
    let pnj = this.data.pnjs.find((entite: Entite) => this.perso.nom.startsWith(entite.nom));
    if (pnj) {
      let lootactuel = pnj.loot;
      if (lootactuel) {
        lootactuel.forEach((item: ObjetInventaire) => {
          let objet = this.data.objets.find((obj: ObjetInventaire) => obj.nom == item.nom);
          if (objet) {
            objet.qte = item.qte;
            objet.taux = item.taux;
            loot.push(objet);
          }
        });
      }
    }
    return loot;
  }

}
