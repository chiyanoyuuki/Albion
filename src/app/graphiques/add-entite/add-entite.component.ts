import { Component, Input, OnInit } from '@angular/core';
import { addEntity, Entite, MenuContextuel, Data, LevelStats } from 'src/app/model';
import { AppService } from 'src/app/services/app.service';
import { PersoService } from 'src/app/services/perso.service';

@Component({
  selector: 'app-add-entite',
  templateUrl: './add-entite.component.html',
  styleUrls: ['./add-entite.component.scss']
})
export class AddEntiteComponent implements OnInit {
  @Input() data: Data;
  @Input() menu: MenuContextuel;

  public focus: Entite | undefined;

  public alphabet: string[];
  public levels: number[];
  public types: string[] = ["PNJS", "Monstres"];
  public teams: string[] = ["Ami", "Neutre", "Ennemi"];

  public letterSelected: string = "";
  public levelSelected: number = 0;
  public typeSelected: string | undefined = undefined;
  public teamSelected: string = "Ennemi";
  public entitySelected: Entite;
  public monsterLevelSelected: LevelStats | undefined = undefined;

  constructor(private appService: AppService, private persoService: PersoService) { }

  ngOnInit(): void 
  {
    this.levels = Array.from({ length: 9 }, (_, i) => i + 1);
    let alpha = Array.from(Array(26)).map((e, i) => i + 65);
    this.alphabet = alpha.map((x) => String.fromCharCode(x));
    this.entitySelected = this.getEntitesPossibles()[0];
    this.entitySelected.team = 2;
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

  public clickTeam(equipe: string) {
    this.teamSelected = equipe;
    if (equipe == "Ami") { this.entitySelected.team = 0; }
    else if (equipe == "Neutre") { this.entitySelected.team = 1; }
    else { this.entitySelected.team = 2; }
  }

  addEntity() {
    const addEntity: addEntity = { entite: this.entitySelected, menuContextuel: this.menu, team: this.teamSelected };
    this.persoService.addEntity(this.data, addEntity);
    this.appService.closeMenuContextuel();
  }
}
