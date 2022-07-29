import { Component, Input, OnInit } from '@angular/core';
import parseJson from 'parse-json';
import { addEntity, Data, Entite } from 'src/app/model';
import { AppService } from 'src/app/services/app.service';
import { PersoService } from 'src/app/services/perso.service';

@Component({
  selector: 'app-embuscade',
  templateUrl: './embuscade.component.html',
  styleUrls: ['./embuscade.component.scss']
})
export class EmbuscadeComponent implements OnInit {

  @Input() data: Data;

  public typeAttaques: string[] = ['de monstres','de bandits','d\'animaux'];
  public enemisMonstres: Entite[];
  public enemisBandits: Entite[];
  public enemisAnimaux: Entite[];


  public choixEnemi: Entite|undefined;
  public embuscade: string = 'de monstres';

  public typeSelected: string = "de monstres";
  public enemiSelected: string;

  public liste: Entite[] = [];

  constructor(private persoService: PersoService, private appService: AppService) {  }

  ngOnInit(): void {
    this.enemisMonstres = this.data.pnjs.filter((pnj: Entite) => pnj.type == "monstre"&&!pnj.solo);
    this.enemisBandits = this.data.pnjs.filter((pnj: Entite) => pnj.type == "bandit"&&!pnj.solo);
    this.enemisAnimaux = this.data.pnjs.filter((pnj: Entite) => pnj.type == "animaux"&&!pnj.solo);
  }
  
  ajoutList(){
    let entite = Object.assign({},this.choixEnemi);
    entite.niveau = 1;
    this.liste.push(entite);
  }

  setLvl(enemi:Entite, niveau: { niveau: number, pdvmax: number, manamax: number }){
    enemi.niveau = niveau.niveau;
    enemi.pdvmax = niveau.pdvmax;
    enemi.pdv = niveau.pdvmax;
    enemi.manamax = niveau.manamax;
    enemi.mana = niveau.manamax;
    console.log('liste', this.liste);
  }

  addEntity() {
    this.liste.forEach((entite:Entite) => {
      const addEntity: addEntity = { entite: entite, menuContextuel: undefined, team: "2"};
      this.persoService.addEntity(this.data, addEntity);
    });
    this.appService.closeMenuContextuel();
  }
}
