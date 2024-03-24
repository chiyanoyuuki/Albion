import { Component, Input, OnInit } from '@angular/core';
import parseJson from 'parse-json';
import { addEntity, Data, Entite, MenuContextuel } from 'src/app/model';
import { AppService } from 'src/app/services/app.service';
import { PersoService } from 'src/app/services/perso.service';

@Component({
  selector: 'app-embuscade',
  templateUrl: './embuscade.component.html',
  styleUrls: ['./embuscade.component.scss']
})
export class EmbuscadeComponent implements OnInit {

  @Input() data: Data;
  @Input() menu: MenuContextuel;

  public typeEnemis: string[] = ['monstres', 'bandits', 'animaux'];
  public enemisMonstres: Entite[];
  public enemisBandits: Entite[];
  public enemisAnimaux: Entite[];

  public red:string = "red";
  public top:number = 200;

  public choixEnemi: Entite | undefined;
  public embuscade: string = 'monstres';

  public typeSelected: string = "monstres";
  public enemiSelected: string;

  public liste: Entite[] = [];

  public positionMinX: number;
  public positionMaxX: number;
  public positionMinY: number;
  public positionMaxY: number;


  public findFond: number;
  public tailleHauteurMap: number;
  public tailleLargeurMap: number;
  public largeurDivPerso: number;
  public scale: number;
  public taillePersoSansScale: number;
  public hauteurDivPerso: number;

  // haut
  public spawnHautYMin: number;
  public spawnHautYMax: number;
  public spawnHautXMin: number;
  public spawnHautXMax: number;
  public haut: boolean = true;
  // bas
  public spawnBasYMin: number;
  public spawnBasYMax: number;
  public spawnBasXMin: number;
  public spawnBasXMax: number;
  public bas: boolean = true;
  // droite
  public spawndroitYMin: number;
  public spawndroitYMax: number;
  public spawndroitXMin: number;
  public spawndroitXMax: number;
  public droite: boolean = true;
  // gauche
  public spawngaucheYMin: number;
  public spawngaucheYMax: number;
  public spawngaucheXMin: number;
  public spawngaucheXMax: number;
  public gauche: boolean = true;

  public spawns: {nom:string, actif: boolean, positions: {xmin:number, xmax:number, ymin:number, ymax:number}}[] = [];

  constructor(private persoService: PersoService, private appService: AppService) { }

  ngOnInit(): void {
    let joueurs = this.data.entites.filter((entite:Entite) => entite.joueur && entite.lieu == this.data.lieuActuel.id);
    this.positionMinX = 60000;
    this.positionMaxX = 0;
    this.positionMinY = 60000;
    this.positionMaxY = 0;
    joueurs.forEach((joueur:Entite) => {
      if (this.positionMinX > joueur.x) { this.positionMinX = joueur.x }
      if (this.positionMaxX < joueur.x) { this.positionMaxX = joueur.x }
      if (this.positionMinY > joueur.y) { this.positionMinY = joueur.y }
      if (this.positionMaxY < joueur.y) { this.positionMaxY = joueur.y }
    });
    
    this.scale = 1;
    if (this.data.lieuActuel.scale) { this.scale = this.data.lieuActuel.scale; }
    this.taillePersoSansScale = 68;
    this.largeurDivPerso = 138;
    this.hauteurDivPerso = 81;
    let findFondMapActuelle = this.data.lieuActuel.finFond;


    this.positionMaxY = this.positionMaxY + 78 + (this.taillePersoSansScale*this.scale);
    this.positionMaxX = this.positionMaxX + this.largeurDivPerso;

    this.tailleHauteurMap = this.data.mapHeight;
    this.tailleLargeurMap = 1900;

    // zone haut
    this.spawnHautYMin = this.positionMinY-300;
    this.spawnHautYMax = this.positionMinY-100;
    this.spawnHautXMin = this.positionMinX-300;
    this.spawnHautXMax = this.positionMaxX+300;
    // verif si finFond
    if (findFondMapActuelle) { 
      if (findFondMapActuelle > this.spawnHautYMin) {
        this.spawnHautYMin = findFondMapActuelle;
        if (findFondMapActuelle > this.spawnHautYMax) {
          this.haut = false;
        }
      }
    }
    // verif si à coter du haut de la map
    if (this.spawnHautYMin < 0) {
      this.spawnHautYMin = 0;
      if (this.spawnHautYMax < 0) {
        this.haut = false;
      }
    }
    // verif si à coter du bord droit de la map
    if (this.spawnHautXMax > this.tailleLargeurMap) {
      this.spawnHautXMax = this.tailleLargeurMap;
    }
    // verif si à coter du bord gauche de la map
    if (this.spawnHautXMin < 0) {
      this.spawnHautXMin = 0;
    }
    this.spawns.push({nom: 'haut', actif: this.haut, positions: {xmin: this.spawnHautXMin, xmax: this.spawnHautXMax, ymin: this.spawnHautYMin, ymax: this.spawnHautYMax}});

    // zone droite
    this.spawndroitYMin = this.positionMinY-300;
    this.spawndroitYMax = this.positionMaxY+300;
    this.spawndroitXMin = this.positionMaxX+100;
    this.spawndroitXMax = this.positionMaxX+300;
    // verif si finFond
    if (findFondMapActuelle) { 
      if (findFondMapActuelle > this.spawnHautYMin) {
        this.spawnHautYMin = findFondMapActuelle;
      }
    }
    // verif si à coter du haut de la map
    if (this.spawndroitYMin < 0) {
      this.spawndroitYMin = 0;
    }
    // verif si à coter du bord droit de la map
    if (this.spawndroitXMax > this.tailleLargeurMap) {
      this.spawndroitXMax = this.tailleLargeurMap;
      if (this.spawndroitXMin > this.tailleLargeurMap) {
        this.droite = false;
      }
    }
    // verif si à coter du bas de la map
    if (this.spawndroitYMax > this.tailleHauteurMap) {
      this.spawndroitYMax = this.tailleHauteurMap;
    }
    this.spawns.push({nom: 'droite', actif: this.droite, positions: {xmin: this.spawndroitXMin, xmax: this.spawndroitXMax, ymin: this.spawndroitYMin, ymax: this.spawndroitYMax}});

    // zone bas
    this.spawnBasYMin = this.positionMaxY+100;
    this.spawnBasYMax = this.positionMaxY+300;
    this.spawnBasXMin = this.positionMinX-300;
    this.spawnBasXMax = this.positionMaxX+300;
    // verif si à coter du bord gauche de la map
    if (this.spawnBasXMin < 0) {
      this.spawnBasXMin = 0;
    }
    // verif si à coter du bord droit de la map
    if (this.spawnBasXMax > this.tailleLargeurMap) {
      this.spawnBasXMax = this.tailleLargeurMap;
    }
    // verif si à coter du bas de la map
    if (this.spawnBasYMax > this.tailleHauteurMap) {
      this.spawnBasYMax = this.tailleHauteurMap;
      if (this.spawnBasYMin > this.tailleHauteurMap) {
        this.bas = false;
      }
    }
    this.spawns.push({nom: 'bas', actif: this.bas, positions: {xmin: this.spawnBasXMin, xmax: this.spawnBasXMax, ymin: this.spawnBasYMin, ymax: this.spawnBasYMax}});

    // zone gauche
    this.spawngaucheYMin = this.positionMinY-300;
    this.spawngaucheYMax = this.positionMaxY+300;
    this.spawngaucheXMin = this.positionMinX-300;
    this.spawngaucheXMax = this.positionMinX-100;
    // verif si à coter du bord gauche de la map
    if (this.spawngaucheXMin < 0) {
      this.spawngaucheXMin = 0;
      if (this.spawngaucheXMax < 0) {
        this.gauche = false;
      }
    }
    // verif si finFond
    if (findFondMapActuelle) { 
      if (findFondMapActuelle > this.spawngaucheYMin) {
        this.spawngaucheYMin = findFondMapActuelle;
      }
    }
    // verif si à coter du haut de la map
    if (this.spawngaucheYMin < 0) {
      this.spawngaucheYMin = 0;
    }
    // verif si à coter du bas de la map
    if (this.spawngaucheYMax > this.tailleHauteurMap) {
      this.spawngaucheYMax = this.tailleHauteurMap;
    }
    this.spawns.push({nom: 'gauche', actif: this.gauche, positions: {xmin: this.spawngaucheXMin, xmax: this.spawngaucheXMax, ymin: this.spawngaucheYMin, ymax: this.spawngaucheYMax}});
    
  }

  enemisChoisi(){
    let groupEnemis = this.enemisMonstres = this.data.pnjs.filter((pnj: Entite) => pnj.type == this.embuscade && !pnj.solo);
    if (groupEnemis) {
      return groupEnemis;
    }else{
      return [];
    }
  }

  ajoutList() {
    let entite = Object.assign({}, this.choixEnemi);
    entite.niveau = 1;
    this.liste.push(entite);
  }

  setLvl(enemi: Entite, niveau: { niveau: number, pdvmax: number, manamax: number }) {
    enemi.niveau = niveau.niveau;
    enemi.pdvmax = niveau.pdvmax;
    enemi.pdv = niveau.pdvmax;
    enemi.manamax = niveau.manamax;
    enemi.mana = niveau.manamax;
    console.log('liste', this.liste);
  }

  positionRandomXPossible(string:string){
    let min = 0;
    let max = 0;
    let tab = ['gauche','haut','droite','bas'];
    let spawnsNonActif = this.spawns.filter((spawn:{nom:string, actif: boolean, positions: {xmin:number, xmax:number, ymin:number, ymax:number}}) => !spawn.actif);
    if (spawnsNonActif) {
      spawnsNonActif.forEach((spawn:{nom:string, actif: boolean, positions: {xmin:number, xmax:number, ymin:number, ymax:number}}) => {
        tab.splice(tab.indexOf(spawn.nom),1);
      });
    }

    let spawn = this.spawns.find((spawn:{nom:string, actif: boolean, positions: {xmin:number, xmax:number, ymin:number, ymax:number}}) => spawn.actif && spawn.nom == string);
    if (spawn) {
      min = spawn.positions.xmin;
      max = spawn.positions.xmax;
    }else{
      let randomTab =  Math.floor(Math.random() * (tab.length - 0) + 0);
      let emplacementTab = tab[randomTab];
      let newSpawn = this.spawns.find((spawn:{nom:string, actif: boolean, positions: {xmin:number, xmax:number, ymin:number, ymax:number}}) => spawn.actif && spawn.nom == emplacementTab);
      if (newSpawn) {
        min = newSpawn.positions.xmin;
        max = newSpawn.positions.xmax;
      }
    }
    return Math.random() * (max - min) + min;
  }
  positionRandomYPossible(string:string){
    let min = 0;
    let max = 0;
    let tab = ['gauche','haut','droite','bas'];
    let spawnsNonActif = this.spawns.filter((spawn:{nom:string, actif: boolean, positions: {xmin:number, xmax:number, ymin:number, ymax:number}}) => !spawn.actif);
    if (spawnsNonActif) {
      spawnsNonActif.forEach((spawn:{nom:string, actif: boolean, positions: {xmin:number, xmax:number, ymin:number, ymax:number}}) => {
        tab.splice(tab.indexOf(spawn.nom),1);
      });
    }

    let spawn = this.spawns.find((spawn:{nom:string, actif: boolean, positions: {xmin:number, xmax:number, ymin:number, ymax:number}}) => spawn.actif && spawn.nom == string);
    if (spawn) {
      min = spawn.positions.ymin;
      max = spawn.positions.ymax;
    }else{
      let randomTab =  Math.floor(Math.random() * (tab.length - 0) + 0);
      let emplacementTab = tab[randomTab];
      let newSpawn = this.spawns.find((spawn:{nom:string, actif: boolean, positions: {xmin:number, xmax:number, ymin:number, ymax:number}}) => spawn.actif && spawn.nom == emplacementTab);
      if (newSpawn) {
        min = newSpawn.positions.ymin;
        max = newSpawn.positions.ymax;
      }
    }
    return Math.random() * (max - min) + min;
  }

  addEntity() {
    this.liste.forEach((entite: Entite, index )=> {
      if (index%4 == 0) {
        this.menu.x = this.positionRandomXPossible('haut')-(this.largeurDivPerso/2);
        this.menu.y = this.positionRandomYPossible('haut')-(this.hauteurDivPerso)-((this.taillePersoSansScale*this.scale)/2);
      }else if (index%3 == 0) {
        this.menu.x = this.positionRandomXPossible('droite')-(this.largeurDivPerso/2);
        this.menu.y = this.positionRandomYPossible('droite')-(this.hauteurDivPerso)-((this.taillePersoSansScale*this.scale)/2);
      }else if (index%2 == 0) {
        this.menu.x = this.positionRandomXPossible('bas')-(this.largeurDivPerso/2);
        this.menu.y = this.positionRandomYPossible('bas')-(this.hauteurDivPerso)-((this.taillePersoSansScale*this.scale)/2);
      }else {
        this.menu.x = this.positionRandomXPossible('gauche')-(this.largeurDivPerso/2);
        this.menu.y = this.positionRandomYPossible('gauche')-(this.hauteurDivPerso)-((this.taillePersoSansScale*this.scale)/2);
      }
      this.menu.type = "map";
      const addEntity: addEntity = { entite: entite, menuContextuel: this.menu, team: "2" };
      this.persoService.addEntity(this.data, addEntity);
    });
    this.appService.closeMenuContextuel(false);
  }
}
