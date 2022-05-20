import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Personnage, PNJ } from '../model';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.scss']
})
export class EquipeComponent implements OnInit {

  public personnages : Personnage[];
  public amisActuels : PNJ[];
  
  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    this.personnages = this.dataService.getPersonnages();
    this.amisActuels = this.dataService.getAmisActuels();
  }
}
