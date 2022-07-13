import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Data } from '@angular/router';
import { addEntity, Entite, MenuContextuel } from '../model';
import { of } from 'rxjs';

@Component({
  selector: 'app-menu-contextuel',
  templateUrl: './menu-contextuel.component.html',
  styleUrls: ['./menu-contextuel.component.scss']
})
export class MenuContextuelComponent implements OnInit {

  @Input() data: Data;
  @Input() menu: MenuContextuel;

  @Output() majEvent = new EventEmitter<addEntity>();


  private setting = { element: { dynamicDownload: null as unknown as HTMLElement } }
  public letterSelected: string = "";
  public levelSelected: number = 0;
  public typeSelected: string | undefined = undefined;
  public teamSelected: string = "Neutre";
  public entitySelected: Entite;
  public monsterLevelSelected: { niveau: number, pdvmax: number, manamax: number } | undefined = undefined;

  public alphabet: string[];
  public levels: number[];
  public types: string[] = ["PNJS", "Monstres"];
  public teams: string[] = ["Ami", "Neutre", "Ennemi"];

  public focus: Entite | undefined;
  public add: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.levels = Array.from({ length: 8 }, (_, i) => i + 1);
    let alpha = Array.from(Array(26)).map((e, i) => i + 65);
    this.alphabet = alpha.map((x) => String.fromCharCode(x));
    this.entitySelected = this.getEntitesPossibles()[0];

  }

  getEntitesPossibles() {
    let entitesPossibles: Entite[] = [];
    let pnjsActuels: string[] = [];
    this.data.pnjsNeutres.forEach((entite: Entite) => { pnjsActuels.push(entite.nom); });
    this.data.pnjs.forEach((entite: Entite) => { if (!pnjsActuels.includes(entite.nom)) { entitesPossibles.push(entite) } });

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
      this.majEvent.emit(addEntity);
  }

  getType() {
    if (this.teamSelected == "Neutre") { return "pnjsNeutres"; }
    else if (this.teamSelected == "Ami") { return "team"; }
    else { return "ennemis"; }
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
