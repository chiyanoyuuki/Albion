import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addEntity, Data, Entite, Etape, Lieu, MenuContextuel, ObjetInventaire, Position, Quete } from '../model';
import { of } from 'rxjs';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

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
  public teamSelected: string = "Ennemi";
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

  //Inputs
  public input1: string = "1";
  public input2: string = "1";
  public input3: string = "1";

  //Admin add item / loot
  public choixTypeObjet = "Ajouter un loot";
  public addObjet: boolean = false;
  public emplacements: string[] = ["Tête", "Torse", "Gants", "Jambes", "Bottes", "Arme", "Utilitaire", "Collier", "Epaulieres", "Ceinture", "Anneau"];
  public emplacementSelected: string = "";

  //Modifier Map
  public modifMap: boolean;
  public dummy: Position = { id: -1, startX: 500, startY: 500 }

  constructor() { }

  ngOnInit(): void {
    this.levels = Array.from({ length: 9 }, (_, i) => i + 1);
    let alpha = Array.from(Array(26)).map((e, i) => i + 65);
    this.alphabet = alpha.map((x) => String.fromCharCode(x));
    this.entitySelected = this.getEntitesPossibles()[0];
    this.entitySelected.team = 2;
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
    this.input1 = this.input1.replace(/[^0-9]*/g, "");
    let qte = Number(this.input1);
    if (this.choixTypeObjet == "Ajouter un objet") {
      let obj = { emplacement: item.emplacement, image: item.image, nom: item.nom, prix: item.prix, qte: qte, taux: item.taux };
      let inv = this.perso.inventaire;
      if (item.nom == "Argent") {
        this.perso.argent += qte;
      }
      else if (!inv) {
        this.perso.inventaire = [obj];
      }
      else {
        let objetDejaDansInventaire = this.perso.inventaire.find((obj: ObjetInventaire) => obj.nom == item.nom);
        if (objetDejaDansInventaire) {
          objetDejaDansInventaire.qte += qte;
        }
        else if (this.perso.inventaire.length < 18) {
          this.perso.inventaire.push(obj);
        }
      }

    }
    else {
      let pnj = this.data.pnjs.find((entite: Entite) => this.perso.nom.startsWith(entite.nom));
      if (pnj) {
        let loot = pnj.loot;
        this.input2 = this.input2.replace(/[^0-9]*/g, "");
        let tx = Number(this.input2);
        let item = { emplacement: this.objetSelected.emplacement, image: this.objetSelected.image, nom: this.objetSelected.nom, prix: this.objetSelected.prix, qte: qte, taux: tx };
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
      console.log(pnj);
    }
  }

  clickLoot(objet: ObjetInventaire) {
    this.objetSelected = objet;
    this.input1 = '' + objet.taux;
    this.input2 = '' + objet.qte
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

  repos(){
    let persosTeam = this.data.entites.filter((entite: Entite) => entite.joueur);
    persosTeam.forEach((perso: Entite) => {
      perso.pdv = perso.pdvmax;
      perso.mana = perso.manamax
    });
    this.data.repos.lance = true;
    setTimeout (() => {
      this.data.repos.animation = true;
      setTimeout (() => {
        this.data.repos.stop = true;
        setTimeout (() => {
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

  //Modifier Map

  clickModifMap() {
    this.modifMap = true;
    this.input2 = '';
    this.input3 = '';
    if (this.data.lieuActuel.scale) { this.input1 = '' + this.data.lieuActuel.scale; }
    if (this.data.lieuActuel.scaleFond) { this.input2 = '' + this.data.lieuActuel.scaleFond; }
    if (this.data.lieuActuel.finFond) { this.input3 = '' + this.data.lieuActuel.finFond; }
  }

  public getTop(position: Position) {
    let scale = 1;
    scale = this.getScale(position);
    return (scale > 1 ? scale * 20 + (scale < 0.5 ? 59 : 79) : '84') + 'px';
  }

  public getScale(position: Position) {
    let scale = 1;
    if (this.data.lieuActuel.scale) { scale = this.data.lieuActuel.scale; }
    if (this.data.lieuActuel.scaleFond) { scale = this.getNewScale(position); }
    return scale;
  }

  public getNewScale(position: Position) {
    let scale = this.data.lieuActuel.scale - this.data.lieuActuel.scaleFond;
    let map = document.getElementById("map");
    if (map) {
      let finFond = 0;
      let height = map.offsetHeight;
      if (this.data.lieuActuel.finFond) {
        finFond = this.data.lieuActuel.finFond;
      }
      height = height - finFond;
      let posYPerso = position.startY + 250;
      if (finFond != 0 && posYPerso < this.data.lieuActuel.finFond) {
        scale = this.data.lieuActuel.scaleFond;
      }
      else {
        posYPerso = posYPerso - finFond;
        let div = height / posYPerso;
        scale = scale / div + this.data.lieuActuel.scaleFond;
      }
    }
    return scale;
  }

  public positionDragEnd($event: CdkDragEnd, position: Position) {
    let tmp = $event.source.getFreeDragPosition();
    position.startX = position.startX + tmp.x;
    position.startY = position.startY + tmp.y;
    $event.source._dragRef.reset();
  }

  modifierMap() {
    let map = this.data.lieux.find((lieu: Lieu) => lieu.id == this.data.lieuActuel.id);
    if (map) {
      map.scale = Number(this.input1);
      map.scaleFond = Number(this.input2);
      map.finFond = Number(this.input3);
    }
    this.data.lieuActuel.scale = Number(this.input1);
    this.data.lieuActuel.scaleFond = Number(this.input2);
    this.data.lieuActuel.finFond = Number(this.input3);
    console.log(this.data.lieuActuel);
  }

  ajouterPosition(i: number) {
    let positions = this.data.lieuActuel.position_start;
    if (i == 1) {
      if (positions) {
        this.data.lieuActuel.position_start.push({ id: positions.length, startX: 500, startY: 500 });
      }
      else {
        this.data.lieuActuel.position_start = ([{ id: 0, startX: 500, startY: 500 }]);
      }
    }
    else {
      if (positions) {
        this.data.lieuActuel.position_start.pop();
      }
    }
  }
}