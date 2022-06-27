import { Component, Input, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { Entite, MenuContextuel, Rule } from '../model';

@Component({
  selector: 'app-menu-contextuel',
  templateUrl: './menu-contextuel.component.html',
  styleUrls: ['./menu-contextuel.component.scss']
})
export class MenuContextuelComponent implements OnInit {

  @Input() data: Data;
  @Input() menu: MenuContextuel;

  public levels: number[];
  public alphabet: string[];

  public letterSelected: string = "";
  public levelSelected: number = 0;
  public entitySelected: Entite | undefined = undefined;

  public rules: Rule[] = [
    { "nom": "OnlyPnjs", "active": false },
    { "nom": "OnlyMonstres", "active": false }
  ];
  public focus: Entite | undefined;
  public add: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.levels = Array.from({ length: 8 }, (_, i) => i + 1);
    let alpha = Array.from(Array(26)).map((e, i) => i + 65);
    this.alphabet = alpha.map((x) => String.fromCharCode(x));
  }

  getEntitesPossibles() {
    let entitesPossibles: Entite[] = [];
    let pnjsActuels: string[] = [];
    this.data.pnjsNeutres.forEach((entite: Entite) => { pnjsActuels.push(entite.id); });
    this.data.pnjs.forEach((entite: Entite) => { if (!pnjsActuels.includes(entite.id)) { entitesPossibles.push(entite) } });

    if (this.rules[0].active) { entitesPossibles = entitesPossibles.filter((entite: Entite) => entite.solo); }
    else if (this.rules[1].active) { entitesPossibles = entitesPossibles.filter((entite: Entite) => !entite.solo); }

    if (this.letterSelected != "") { entitesPossibles = entitesPossibles.filter((entite: Entite) => entite.nom.startsWith(this.letterSelected)); }
    if (this.levelSelected != 0) { entitesPossibles = entitesPossibles.filter((entite: Entite) => entite.niveau == this.levelSelected); }

    return entitesPossibles.sort((a: Entite, b: Entite) => {
      return a.nom > b.nom ? 1 : -1;
    });
  }

  clickRule(rule: Rule) {
    rule.active = !rule.active;
    if (rule.nom == "OnlyMonstres") { this.rules[0].active = false; }
    else if (rule.nom == "OnlyPnjs") { this.rules[1].active = false; }
  }

}
