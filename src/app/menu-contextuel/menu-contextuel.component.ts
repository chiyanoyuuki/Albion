import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Data } from '@angular/router';
import { addEntity, Entite, Etape, MenuContextuel, ObjetInventaire, Quete } from '../model';
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
  public monsterLevelSelected: { niveau: number, pdvmax: number, manamax: number } | undefined = undefined;
  public delete: string = "Supprimer";

  public alphabet: string[];
  public levels: number[];
  public types: string[] = ["PNJS", "Monstres"];
  public teams: string[] = ["Ami", "Neutre", "Ennemi"];

  public focus: Entite | undefined;
  public add: boolean = false;

  public quete: boolean = false;
  public nbrQuetes: number;
  public focusQuete: Quete | undefined;
  public queteAccepter: string;

  constructor() { }

  ngOnInit(): void {
    this.levels = Array.from({ length: 9 }, (_, i) => i + 1);
    let alpha = Array.from(Array(26)).map((e, i) => i + 65);
    this.alphabet = alpha.map((x) => String.fromCharCode(x));
    this.entitySelected = this.getEntitesPossibles()[0];
    this.entitySelected.team = 1;
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

  clickEntite(entite: Entite) {
    if (this.entitySelected == undefined || this.entitySelected.nom != entite.nom) {
      let entiteTmp = Object.assign({}, entite);
      if (entite.levels) {
        this.monsterLevelSelected = entite.levels[0];
      }
      this.entitySelected = entiteTmp;
      return;
    }
  }

  addEntity() {
    const addEntity: addEntity = { entite: this.entitySelected, menuContextuel: this.menu, team: this.teamSelected };
    this.addEntityEvent.emit(addEntity);
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

  getQuetes(){
    let quetesEnCours = this.data.quetes.filter((quete: Quete) =>
      quete.etapeEnCours.pnj == this.perso.nom
    );
    if (quetesEnCours) {
      this.nbrQuetes = quetesEnCours.length;
      return quetesEnCours;
    }else{
      return false;
    }
  }

  accepQuete(){
    if (this.focusQuete) {
      if (this.queteAccepter != this.focusQuete.nom) {
        this.queteAccepter = this.focusQuete.nom;
      } else if (this.queteAccepter == this.focusQuete.nom) {
        this.data.quetessecondaires.push(this.focusQuete);
        this.queteAccepter = '';
        this.focusQuete.etatQuete = 1;
        let queteFocus = this.focusQuete;
        let nouvelleEtape = this.focusQuete.etapes.find((etape: Etape)=> etape.id == queteFocus.etapeEnCours.id + 1);
        if (nouvelleEtape) {
          this.focusQuete.etapeEnCours = nouvelleEtape;
          this.focusQuete = undefined;
        }
      }
    }
  }

  etapeSuivante(){
    if (this.focusQuete) {
      let etape = this.focusQuete.etapeEnCours;
      console.log(etape.nom);
      if (etape.objets) {
        let entitesPresentes = this.data.entites.filter((entite: Entite)=> entite.joueur && entite.lieu == this.data.lieuActuel.id);
        let conditionRespectees = true;
        etape.objets.forEach((objet: ObjetInventaire) => {
          if (conditionRespectees) {
            console.log('conditionRespectees 1');
            let nb = 0;
            entitesPresentes.forEach((entite: Entite) => {
              if (nb < objet.qte) {
                console.log('nb < objet.qte 1');
                console.log(objet.nom);
                let objetDansInventaire = entite.inventaire.find((objetATrouver: ObjetInventaire)=> objetATrouver.nom == objet.nom);
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
                let objetDansInventaire = entite.inventaire.find((objetATrouver: ObjetInventaire)=> objetATrouver.nom == objet.nom)
                if (objetDansInventaire) {
                  console.log('objetDansInventaire 2');
                  if (objetDansInventaire.qte >= nb) {
                    objetDansInventaire.qte -= nb;
                    console.log(objetDansInventaire.qte);
                    nb = 0;
                    if (objetDansInventaire.qte = 0) {
                      entite.inventaire.splice(entite.inventaire.indexOf(objetDansInventaire), 1);
                    }
                  }else{
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
        let nouvelleEtape = queteFocus.etapes.find((etape: Etape)=> etape.id == queteFocus.etapeEnCours.id + 1);
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

}
